"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MountainWisdom() {
  const [wisdom, setWisdom] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     setWisdom("The mountain breathes with those who listen.");
     setLoading(false);
  }, []);

  return (
    <div className="mb-8 min-h-[3rem] flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        {!loading && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-accent-400 font-serif italic text-lg tracking-wide max-w-xs"
          >
            "{wisdom}"
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
