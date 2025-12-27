"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpIcon, 
  ExclamationTriangleIcon, 
  MapIcon, 
  SignalIcon 
} from "@heroicons/react/24/outline";

export default function NavigationOverlay({ 
  route, 
  isRecalculating, 
  isSnowy, 
  onStop 
}) {
  if (!route) return null;

  return (
    <div className="absolute top-0 left-0 w-full p-4 z-50 pointer-events-none">
      <div className="max-w-md mx-auto flex flex-col gap-3">
        
        {/* Main Instruction Card */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-primary-950/90 backdrop-blur-xl border border-accent-500/30 p-4 rounded-2xl shadow-2xl pointer-events-auto flex items-center gap-4"
        >
          <div className="bg-accent-500/20 p-3 rounded-xl border border-accent-500/20">
             <ArrowUpIcon className={`w-8 h-8 text-accent-500 ${route.isFallback ? 'rotate-45' : 'animate-bounce'}`} />
          </div>
          <div className="flex-1">
             <p className="text-primary-400 text-[10px] uppercase tracking-widest font-black">
                {route.isFallback ? "Direct Pathway" : "Next Maneuver"}
             </p>
             <h3 className="text-accent-100 font-serif text-lg leading-tight">
                {route.isFallback 
                  ? "Proceed to destination in direct line (GPS Unstable)" 
                  : "Proceed toward San Candido via Alpine SP44"}
             </h3>
          </div>
          <button 
            onClick={onStop}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-full border border-red-500/20 transition-all group"
          >
             <span className="text-[10px] font-bold px-2 group-hover:scale-110 block">EXIT</span>
          </button>
        </motion.div>

        <AnimatePresence>
            {/* Recalculating Signal */}
            {isRecalculating && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-accent-500 text-primary-950 px-4 py-2 rounded-full flex items-center justify-center gap-2 shadow-xl mx-auto border border-primary-950/20"
              >
                <SignalIcon className="w-4 h-4 animate-ping" />
                <span className="text-xs font-black uppercase tracking-tighter">Syncing Signal...</span>
              </motion.div>
            )}

            {/* Winter Protocol Alert */}
            {isSnowy && (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-red-950/80 backdrop-blur-md border border-red-500/40 p-3 rounded-xl flex items-start gap-4 shadow-xl"
                >
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-500 shrink-0" />
                    <div>
                        <p className="text-red-200 text-xs font-bold leading-tight uppercase tracking-wide">Winter conditions detected on SP44</p>
                        <p className="text-red-400 text-[10px] mt-1 italic">Ensure 4x4 mode is active and snow chains are available in your trunk.</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Bottom Progress Bar (Mobile Style) */}
        <div className="fixed bottom-8 left-4 right-4 max-w-md mx-auto pointer-events-auto">
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-primary-950/80 backdrop-blur-lg border border-white/10 p-4 rounded-3xl flex items-center justify-between shadow-2xl"
            >
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-primary-500 text-[9px] uppercase font-black tracking-widest">Arrival</p>
                        <p className="text-accent-500 font-serif text-xl italic">
                           {new Date(Date.now() + route.duration * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className="w-px h-8 bg-primary-800" />
                    <div className="text-center">
                        <p className="text-primary-500 text-[9px] uppercase font-black tracking-widest">GAP</p>
                        <p className="text-white font-mono text-lg">{(route.distance / 1000).toFixed(1)} km</p>
                    </div>
                </div>
                
                <div className="bg-primary-900 border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-primary-400" />
                    <span className="text-white font-bold">{Math.round(route.duration / 60)} min</span>
                    {route.isFallback && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse ml-1" title="Fallback Active" />}
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
