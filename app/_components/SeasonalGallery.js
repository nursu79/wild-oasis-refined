"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

function SeasonalGallery({ cabin }) {
  const [season, setSeason] = useState("summer");

  // In a real app, these would come from the DB. 
  // We'll simulate seasonal variants using CSS filters for now since we have limited assets.
  const seasons = {
    summer: { label: "Summer", filter: "none", overlay: "bg-transparent" },
    autumn: { label: "Autumn", filter: "sepia(30%) contrast(110%)", overlay: "bg-orange-900/10" },
    winter: { label: "Winter", filter: "contrast(110%) brightness(110%) saturate(50%)", overlay: "bg-blue-900/10" },
    spring: { label: "Spring", filter: "saturate(120%) brightness(105%)", overlay: "bg-green-900/10" },
  };

  return (
    <div className="relative h-[65vh] w-full group overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
           key={season}
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.7 }}
           className="absolute inset-0"
        >
           <Image
            src={cabin.image?.startsWith("/") || cabin.image?.startsWith("http") ? cabin.image : `/${cabin.image}`}
            fill
            className="object-cover"
            alt={`Cabin ${cabin.name} in ${season}`}
            style={{ filter: seasons[season].filter }}
             sizes="100vw"
             priority
           />
          <div className={`absolute inset-0 ${seasons[season].overlay} mix-blend-overlay`} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent opacity-80" />
        </motion.div>
      </AnimatePresence>

      {/* Season Toggle */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex bg-black/30 backdrop-blur-md rounded-full p-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         {Object.entries(seasons).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setSeason(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${
                season === key 
                  ? "bg-accent-500 text-primary-950 shadow-lg" 
                  : "text-primary-200 hover:text-white hover:bg-white/10"
              }`}
            >
              {label}
            </button>
         ))}
      </div>

      <div className="absolute bottom-10 left-8 md:left-12 max-w-2xl">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-accent-100 font-serif font-bold text-5xl md:text-8xl mb-4 drop-shadow-xl"
        >
          {cabin.name}
        </motion.h1>
      </div>
    </div>
  );
}

export default SeasonalGallery;
