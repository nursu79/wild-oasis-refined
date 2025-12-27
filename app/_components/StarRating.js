"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const labels = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Exceptional!",
};

export default function StarRating({ rating, setRating, maxRating = 5, displayOnly = false, size = 8 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = (num) => {
    if (displayOnly) return;
    if (rating === num) {
      setRating(0);
    } else {
      setRating(num);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[...Array(maxRating)].map((_, i) => {
          const num = i + 1;
          const isFilled = hoverRating ? num <= hoverRating : num <= rating;
          const isHalf = !hoverRating && !isFilled && num - 0.5 <= rating;

          return (
            <button
              key={num}
              type="button"
              disabled={displayOnly}
              onMouseEnter={() => !displayOnly && setHoverRating(num)}
              onMouseLeave={() => !displayOnly && setHoverRating(0)}
              onClick={() => handleRating(num)}
              className={`relative focus:outline-none transition-transform hover:scale-110 ${displayOnly ? "cursor-default" : "cursor-pointer"}`}
            >
                {isFilled ? (
                  <div className="text-[#c2a378] drop-shadow-[0_0_12px_rgba(194,163,120,0.6)]">
                    <StarIcon style={{ height: `${size * 4}px`, width: `${size * 4}px` }} />
                  </div>
                ) : isHalf ? (
                   <div className="relative text-primary-700">
                    <StarOutline style={{ height: `${size * 4}px`, width: `${size * 4}px` }} />
                    <div className="absolute inset-0 overflow-hidden w-1/2 text-[#c2a378] drop-shadow-[0_0_8px_rgba(194,163,120,0.4)]">
                        <StarIcon style={{ height: `${size * 4}px`, width: `${size * 4}px` }} />
                    </div>
                  </div>
                ) : (
                  <div className="text-primary-800 hover:text-[#c2a378]/50 transition-colors">
                    <StarOutline style={{ height: `${size * 4}px`, width: `${size * 4}px` }} />
                  </div>
                )}
            </button>
          );
        })}

        {!displayOnly && (hoverRating || rating) > 0 && (
          <span className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#c2a378] font-sans animate-fade-in">
            {labels[hoverRating || rating]}
          </span>
        )}
      </div>
    </div>
  );
}
