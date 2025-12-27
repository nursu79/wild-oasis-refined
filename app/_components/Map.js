"use client";

import { Map, Marker, Overlay } from "pigeon-maps";
import { useEffect, useState, useMemo } from "react";
import { useRouting } from "@/app/_hooks/useRouting";
import NavigationOverlay from "./NavigationOverlay";
import { 
  MapIcon, 
  GlobeAltIcon, 
  ArrowRightCircleIcon, 
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  CloudIcon,
  SunIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

export default function MapComponent({ lat, lng, cabinName, userPosition }) {
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState("midnight"); // "midnight" | "satellite"
  const [weather, setWeather] = useState(null);
  const { 
    route, 
    isLoading: routingLoading, 
    isRecalculating,
    isNavigating,
    currentPosition,
    startNavigation, 
    stopNavigation 
  } = useRouting();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe-Render: Weather Fetcher (Client-side to sync with Map state)
  useEffect(() => {
    if (!lat || !lng) return;
    async function fetchWeather() {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (err) {
        console.error("Weather HUD failed:", err);
      }
    }
    fetchWeather();
  }, [lat, lng]);

  // Safe-Render: Guard Clause
  if (!lat || !lng) {
    return (
      <div className="h-full w-full bg-primary-950/40 rounded-xl flex flex-col items-center justify-center border border-accent-500/10 backdrop-blur-md overflow-hidden relative min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent animate-pulse" />
        <div className="relative flex flex-col items-center gap-4 text-center px-8">
            <div className="w-12 h-12 border-2 border-accent-500/20 border-t-accent-500 rounded-full animate-spin" />
            <p className="text-secondary-400 font-serif italic text-lg">Synchronizing Precision Coordinates...</p>
            <p className="text-primary-500 text-[10px] uppercase tracking-[0.2em] font-black">Orbital Link Pending</p>
        </div>
      </div>
    );
  }

  const provider = (x, y, z, dpr) => {
    if (viewMode === "satellite") {
      return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
    }
    return `https://a.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png`;
  };

  // Traveled/Remaining Path Logic
  const paths = useMemo(() => {
    if (!route || !route.points) return null;
    if (!currentPosition) return { traveled: [], remaining: route.points };

    let nearestIdx = 0;
    let minDist = Infinity;
    route.points.forEach((p, i) => {
        const d = Math.sqrt(Math.pow(p[0]-currentPosition[0], 2) + Math.pow(p[1]-currentPosition[1], 2));
        if (d < minDist) {
            minDist = d;
            nearestIdx = i;
        }
    });

    return {
        traveled: route.points.slice(0, nearestIdx + 1),
        remaining: route.points.slice(nearestIdx)
    };
  }, [route, currentPosition]);

  if (!isMounted) return null;

  return (
    <div className="h-full w-full relative z-0">
      <Map
        center={currentPosition && isNavigating ? currentPosition : (route ? route.points[Math.floor(route.points.length / 2)] : [lat, lng])}
        zoom={isNavigating ? 15 : (route ? 11 : 13)}
        height={undefined} 
        provider={provider}
        className="rounded-xl overflow-hidden shadow-2xl border border-white/5"
      >
        {/* Render Split Path */}
        {paths && (
            <>
                <MapPath points={paths.traveled} color="#4b5563" opacity={0.5} />
                <MapPath points={paths.remaining} color="#c69963" glow={true} isFallback={route.isFallback} />
            </>
        )}

        {/* User position - Nav Mode (Directional Beam) */}
        {currentPosition && (
          <Overlay anchor={currentPosition} offset={[15, 15]}>
             <div className="relative">
                <div className="absolute -inset-8 opacity-40 pointer-events-none">
                   <div className="w-16 h-16 bg-blue-500/40 rounded-full blur-2xl animate-pulse" />
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white transform -translate-y-[2px]" />
                </div>
             </div>
          </Overlay>
        )}

        {/* Cabin position - Custom Stylized Marker */}
        <Overlay anchor={[lat, lng]} offset={[10, 10]}>
          <div className="flex flex-col items-center group">
             <div className="bg-accent-500 w-5 h-5 rounded-full border-2 border-primary-950 shadow-[0_0_20px_#c69963] animate-pulse flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full" />
             </div>
             <div className="mt-2 bg-primary-950/95 text-accent-50 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-accent-500/20 whitespace-nowrap backdrop-blur-md shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                {cabinName}
             </div>
          </div>
        </Overlay>
      </Map>

      {/* Floating Concierge Weather HUD (Top Right) */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-primary-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-4 shadow-2xl min-w-[140px] group hover:border-accent-500/30 transition-all">
           {weather ? (
             <>
               <WeatherIcon code={weather.weathercode} className="w-8 h-8" />
               <div className="flex flex-col">
                  <p className="text-white font-serif text-lg leading-tight">{Math.round(weather.temperature)}°C</p>
                  <p className="text-[9px] uppercase tracking-widest text-primary-400 font-bold opacity-70">
                    {getConditionNote(weather.weathercode)}
                  </p>
               </div>
             </>
           ) : (
             <div className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-primary-800 rounded-full" />
                <div className="h-4 w-16 bg-primary-800 rounded" />
             </div>
           )}
        </div>
      </div>

      {/* Navigation Overlay (Conditional) */}
      <NavigationOverlay 
        route={route} 
        isRecalculating={isRecalculating}
        isSnowy={weather?.weathercode >= 70 && weather?.weathercode <= 77} 
        onStop={stopNavigation}
      />

      {/* Top Left Status & Telemetry (Hide in Nav Mode) */}
      {!isNavigating && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="bg-primary-950/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] text-primary-300 font-mono tracking-[0.2em] uppercase flex items-center gap-3 shadow-xl">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Orbital: {viewMode === "midnight" ? "Tactical" : "Topography"}
            </div>
            {route && (
                <div className="bg-accent-500/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-accent-600/50 text-primary-950 shadow-[0_0_40px_rgba(198,153,99,0.4)] min-w-[160px] animate-slide-in">
                    <div className="flex justify-between items-center mb-1 pb-1 border-b border-primary-950/10">
                        <span className="text-[9px] font-black uppercase tracking-widest">Route Data</span>
                        <button onClick={() => stopNavigation()} className="hover:scale-125 transition-transform"><XMarkIcon className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-end gap-1 mb-0.5">
                       <span className="text-2xl font-serif italic">{(route.distance / 1000).toFixed(1)}</span>
                       <span className="text-[10px] font-black uppercase tracking-tighter mb-1.5 underline decoration-primary-950/20">Kilometers</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-bold opacity-70 italic">{Math.round(route.duration / 60)} min drive</p>
                       {route.isFallback && <span className="text-[8px] bg-primary-950 text-white px-2 py-0.5 rounded-full uppercase font-black tracking-tighter">Fallback</span>}
                    </div>
                </div>
            )}
        </div>
      )}

      {/* Bottom Right Controls (Hide in Nav Mode) */}
      {!isNavigating && (
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-4">
            {/* Start Navigation Button */}
            {userPosition && (
                <button 
                    onClick={() => startNavigation([userPosition.lat, userPosition.lng], [lat, lng])}
                    disabled={routingLoading}
                    className="bg-accent-500 hover:bg-accent-400 text-primary-950 h-14 w-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(198,153,99,0.5)] transition-all border border-primary-950 group active:scale-90"
                    title="Engage Pathfinding"
                >
                    {routingLoading ? (
                        <div className="w-6 h-6 border-3 border-primary-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <ArrowRightCircleIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    )}
                </button>
            )}

            {/* View Toggle */}
            <div className="bg-primary-950/80 backdrop-blur-xl rounded-2xl border border-white/10 p-1 flex shadow-2xl">
                <button 
                    onClick={() => setViewMode("midnight")}
                    className={`p-3 rounded-xl transition-all ${viewMode === "midnight" ? "bg-accent-500 text-primary-950 shadow-lg" : "text-primary-300 hover:text-white hover:bg-white/5"}`}
                >
                    <MapIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setViewMode("satellite")}
                    className={`p-3 rounded-xl transition-all ${viewMode === "satellite" ? "bg-accent-500 text-primary-950" : "text-primary-300 hover:text-white hover:bg-white/5"}`}
                >
                    <GlobeAltIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Street View External Link */}
            <a 
                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-950/60 hover:bg-primary-900 text-accent-400 hover:text-accent-300 px-5 py-2.5 rounded-2xl border border-white/5 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-2xl group active:scale-95"
            >
                <ArrowTopRightOnSquareIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Street View
            </a>
        </div>
      )}

      <style jsx global>{`
        .pigeon-click-block {
          border-radius: 12px;
        }
        @keyframes slide-in {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

// Helpers
function WeatherIcon({ code, className }) {
  if (code === undefined || code === null) return <CloudIcon className={className} />;
  if (code <= 1) return <SunIcon className={`${className} text-yellow-400`} />;
  if (code <= 3) return <CloudIcon className={`${className} text-primary-300`} />;
  if (code <= 67) return <CloudIcon className={`${className} text-blue-400`} />; // Rain
  if (code <= 77) return <CloudIcon className={`${className} text-white animate-pulse`} />; // Snow
  if (code <= 99) return <BoltIcon className={`${className} text-yellow-600`} />;
  return <SunIcon className={`${className} text-yellow-400`} />;
}

function getConditionNote(code) {
  if (code <= 1) return "Perfect Clear Skins";
  if (code <= 3) return "Atmospheric Alpine";
  if (code <= 67) return "Fresh Rain Fall";
  if (code <= 77) return "Primal Snowfall";
  return "Stable Conditions";
}

// Optimized Polyline Renderer
function MapPath({ points, color, glow = false, opacity = 1, isFallback = false, project }) {
  if (!points || points.length < 2 || !project) return null;

  const pathData = points.map(p => {
    const pixel = project(p);
    return pixel ? `${pixel[0]},${pixel[1]}` : null;
  }).filter(Boolean).join(" ");

  return (
    <div style={{ position: 'absolute', pointerEvents: 'none', left: 0, top: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        <polyline
          points={pathData}
          fill="none"
          stroke={color}
          strokeWidth={isFallback ? "2" : "5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={isFallback ? "10 10" : "none"}
          style={{
            filter: glow ? 'drop-shadow(0 0 10px rgba(198, 153, 99, 0.8))' : 'none',
            opacity: opacity
          }}
        />
        {glow && !isFallback && (
           <polyline
                points={pathData}
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
                strokeDasharray="5 10"
                strokeLinecap="round"
                style={{ opacity: 0.3 }}
            />
        )}
      </svg>
    </div>
  );
}
