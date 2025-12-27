"use client";

import Image from "next/image";
import TextExpander from "@/app/_components/TextExpander";
import { EyeSlashIcon, MapPinIcon, UsersIcon, WifiIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useGeolocation } from "@/app/_hooks/useGeolocation";
import ErrorBoundary from "@/app/_components/ErrorBoundary";

// Haversine formula to calculate distance
function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/_components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-primary-950/50 animate-pulse flex items-center justify-center rounded-2xl border border-accent-500/10">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-accent-500 font-serif italic text-sm">Calibrating Satellite View...</p>
      </div>
    </div>
  )
});

function Cabin({ cabin }) {
  const { 
    id, 
    name, 
    maxCapacity, 
    regularPrice, 
    discount, 
    image, 
    description,
    latitude,
    longitude,
    arrival_instructions,
    proximity_stats
  } = cabin;
  
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const { isLoading: geoLoading, position, getPosition } = useGeolocation();
  
  // No fallbacks, let the Map component handle nulls with its placeholder
  const lat = latitude;
  const lng = longitude;
  
  const distance = position && lat && lng ? calcDistance(position.lat, position.lng, lat, lng) : null;
  const travelTime = distance ? Math.round(distance / 80 * 60) : null; // Logic for ~80km/h avg

  // Fallback description
  const displayDescription = description || 
    `Experience the ultimate luxury in Cabin ${name}. Nestled in the heart of the Dolomites, this secluded retreat offers breathtaking views and modern amenities.`;

  return (
    <div className="mb-24">
      {/* 2. Description & location toggle */}
      <div className="space-y-12">
        <p className="text-lg text-primary-300 leading-relaxed font-light first-letter:text-7xl first-letter:font-serif first-letter:text-accent-500 first-letter:mr-3 first-letter:float-left">
          <TextExpander>
            {displayDescription}
          </TextExpander>
        </p>

        {/* High-End Map Interface */}
        <div className="border border-primary-800 rounded-3xl overflow-hidden bg-primary-950 shadow-2xl relative group">
           <div className="relative p-8 z-10">
               <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsLocationOpen(!isLocationOpen)}>
                  <div className="flex items-center gap-6">
                    <div className="bg-accent-500/10 p-4 rounded-full border border-accent-500/20 text-accent-500 shadow-[0_0_30px_rgba(198,153,99,0.2)]">
                      <MapPinIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="font-serif text-2xl text-accent-100 mb-1">Explore San Candido</h4>
                      <div className="flex items-center gap-4 text-sm text-primary-300">
                          <span className="flex items-center gap-1">
                             <span className={`w-2 h-2 rounded-full ${lat && lng ? 'bg-green-500 animate-pulse' : 'bg-primary-700'}`}></span>
                             {lat && lng ? 'Live GPS Coordinates' : 'Coordinates Pending'}
                          </span>
                          <span className="text-primary-600">|</span>
                          <span className="font-mono text-accent-400">
                            {lat && lng ? `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E` : "---, ---"}
                          </span>
                      </div>
                      <p className="text-primary-400 mt-2 text-sm font-light">
                        {geoLoading ? "Triangulating your position..." : 
                         distance ? <span className="text-accent-300 font-bold">{distance} km from you ({travelTime} min drive)</span> : 
                         lat && lng ? "Reveal exact distance from you" : "Satellite link establishing..."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                     {!position && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            getPosition();
                          }}
                          className="text-xs font-bold text-accent-500 hover:text-accent-950 hover:bg-accent-500 border border-accent-500 px-6 py-2 rounded-full transition-all tracking-widest uppercase"
                        >
                          Locate Me
                        </button>
                     )}
                     <motion.div 
                        animate={{ rotate: isLocationOpen ? 180 : 0 }}
                        className="bg-primary-900 rounded-full p-2 border border-primary-800"
                      >
                        <span className="text-accent-500 text-xl font-bold block">↓</span>
                     </motion.div>
                  </div>
               </div>

               <AnimatePresence mode="popLayout">
                 {isLocationOpen && (
                   <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                   >
                     <div className="pt-8 mt-8 border-t border-primary-800/50">
                        {/* THE INTERACTIVE DARK MAP with Error Boundary */}
                        <div className="aspect-[21/9] w-full relative rounded-2xl overflow-hidden shadow-inner border border-white/5 ring-1 ring-accent-500/20 bg-primary-900/10">
                           <ErrorBoundary fallback={
                             <div className="h-full w-full flex flex-col items-center justify-center bg-primary-900/20 border border-red-500/10 rounded-2xl p-8 text-center">
                               <MapPinIcon className="h-12 w-12 text-red-500/50 mb-4" />
                               <h4 className="text-accent-400 font-serif text-lg mb-2">Map Interface Interrupted</h4>
                               <p className="text-primary-400 text-sm max-w-md">Our satellite telemetry is temporarily offline. Please refresh or contact concierge if the issue persists.</p>
                             </div>
                           }>
                             <Map lat={lat} lng={lng} cabinName={name} userPosition={position} />
                           </ErrorBoundary>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
                            <div className="bg-primary-900/40 p-8 rounded-2xl border border-primary-800">
                                <h5 className="text-accent-200 font-serif text-xl mb-4 flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                                   Concierge Arrival
                                </h5>
                                <p className="text-primary-300 text-sm leading-relaxed italic">
                                    {arrival_instructions || "Accessible via SP44. Detailed private access coordinates and entry codes are provided upon confirmed reservation. Valet helipad services available."}
                                </p>
                            </div>
                            <div>
                                <h5 className="text-accent-200 font-serif text-xl mb-4 flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                                   Nearby Proximity
                                </h5>
                                <ul className="grid grid-cols-2 gap-y-3">
                                    {proximity_stats ? (
                                      Object.entries(proximity_stats).map(([key, val]) => (
                                        <li key={key} className="flex flex-col text-sm">
                                           <span className="text-primary-500 uppercase text-[10px] font-black tracking-widest">{key}</span>
                                           <span className="text-primary-200 font-semibold">{val}</span>
                                        </li>
                                      ))
                                    ) : (
                                      <>
                                        <li className="flex flex-col text-sm">
                                           <span className="text-primary-500 uppercase text-[10px] font-black tracking-widest">Ski Lifts</span>
                                           <span className="text-primary-200 font-semibold">2.5 km</span>
                                        </li>
                                        <li className="flex flex-col text-sm">
                                           <span className="text-primary-500 uppercase text-[10px] font-black tracking-widest">Lake Braies</span>
                                           <span className="text-primary-200 font-semibold">12 km</span>
                                        </li>
                                        <li className="flex flex-col text-sm">
                                           <span className="text-primary-500 uppercase text-[10px] font-black tracking-widest">Village Center</span>
                                           <span className="text-primary-200 font-semibold">4 km</span>
                                        </li>
                                        <li className="flex flex-col text-sm">
                                           <span className="text-primary-500 uppercase text-[10px] font-black tracking-widest">Forest Access</span>
                                           <span className="text-primary-200 font-semibold">Immediate</span>
                                        </li>
                                      </>
                                    )}
                                </ul>
                            </div>
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
           </div>
        </div>



        {/* Amenities Grid */}
        <div className="pt-10 border-t border-primary-800">
           <h4 className="text-2xl font-serif text-accent-100 mb-8">Amenities & Features</h4>
           <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <li className="flex items-center gap-4 text-primary-200 group">
                 <div className="p-2 rounded-full border border-primary-800 text-accent-500 group-hover:border-accent-500 group-hover:bg-accent-500/10 transition-colors">
                    <UsersIcon className="h-5 w-5" />
                 </div>
                 <span className="text-lg font-light">Up to <span className="font-semibold text-white">{maxCapacity}</span> guests</span>
              </li>
               <li className="flex items-center gap-4 text-primary-200 group">
                 <div className="p-2 rounded-full border border-primary-800 text-accent-500 group-hover:border-accent-500 group-hover:bg-accent-500/10 transition-colors">
                    <EyeSlashIcon className="h-5 w-5" />
                 </div>
                 <span className="text-lg font-light">100% Private & Secluded</span>
              </li>
               <li className="flex items-center gap-4 text-primary-200 group">
                 <div className="p-2 rounded-full border border-primary-800 text-accent-500 group-hover:border-accent-500 group-hover:bg-accent-500/10 transition-colors">
                    <WifiIcon className="h-5 w-5" />
                 </div>
                 <span className="text-lg font-light">High-Speed Starlink WiFi</span>
              </li>
              {/* Add more fake amenities for the "Luxury" feel */}
              <li className="flex items-center gap-4 text-primary-200 group">
                 <div className="p-2 rounded-full border border-primary-800 text-accent-500 group-hover:border-accent-500 group-hover:bg-accent-500/10 transition-colors">
                    <span className="h-5 w-5 font-serif font-bold flex items-center justify-center">Ω</span>
                 </div>
                 <span className="text-lg font-light">Heated Stone Floors</span>
              </li>
           </ul>
        </div>
      </div>
    </div>
  );
}

export default Cabin;
