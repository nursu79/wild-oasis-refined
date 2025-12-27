"use client";

import { motion, AnimatePresence } from "framer-motion";
import CabinCard from "./CabinCard";

function CabinGrid({ cabins, isLoggedIn, isResident, isEthiopian }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-24">
      <AnimatePresence mode="popLayout">
        {cabins.map((cabin, index) => (
          <motion.div
            key={cabin.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden outline-none"
          >
            <CabinCard 
                cabin={cabin} 
                index={index} 
                isLoggedIn={isLoggedIn} 
                isResident={isResident} 
                isEthiopian={isEthiopian}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default CabinGrid;
