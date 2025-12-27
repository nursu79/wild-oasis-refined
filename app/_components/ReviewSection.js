"use client";

import { useOptimistic, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import Image from "next/image";
import ReviewForm from "./ReviewForm";
import { createReview } from "../_lib/actions";
import { motion, AnimatePresence } from "framer-motion";

function ReviewSection({ cabinId, reviews, averageRating, canReview, user }) {
  const [showForm, setShowForm] = useState(false);

  // Optimistic UI for reviews
  const [optimisticReviews, addOptimisticReview] = useOptimistic(
    reviews,
    (curReviews, newReview) => [newReview, ...curReviews]
  );

  // Calculate optimistic average and count
  const totalRating = optimisticReviews.reduce((acc, rev) => acc + rev.rating, 0);
  const currentAvg = optimisticReviews.length > 0 
    ? (totalRating / optimisticReviews.length).toFixed(1) 
    : 0;
  const currentCount = optimisticReviews.length;

  return (
    <div className="mt-20 border-t border-primary-800 pt-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div>
          <h3 className="text-4xl font-serif text-accent-100 mb-4 tracking-tight">Guest Reflections</h3>
          <div className="flex items-center gap-6">
             <div className="flex text-accent-500 scale-110">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`h-6 w-6 ${i < Math.floor(currentAvg) ? "text-accent-500" : "text-primary-800"}`} 
                  />
                ))}
             </div>
             <div className="h-8 w-px bg-primary-800 hidden sm:block" />
             <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif text-white italic">{currentAvg}</span>
                <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">/ 5 Rating</span>
             </div>
             <div className="text-xs font-black text-primary-600 uppercase tracking-widest bg-primary-900/40 px-3 py-1 rounded-full border border-primary-800">
                {currentCount} Shared Experiences
             </div>
          </div>
        </div>
        
        {canReview && !showForm && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="bg-accent-500 text-primary-950 px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-accent-400 transition-all shadow-[0_10px_30px_rgba(198,153,99,0.2)]"
          >
            Leave a Reflection
          </motion.button>
        )}

        {!canReview && (
          <div className="bg-primary-900/30 px-6 py-3 rounded-2xl border border-primary-800 italic text-xs text-primary-500 flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
             <span>Reflections are reserved for verified guests after their stay.</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <ReviewForm 
            cabinId={cabinId} 
            guest={user}
            onAction={async (newReview) => {
                addOptimisticReview(newReview);
                // The actual server action is handled inside ReviewForm now? 
                // No, let's keep the action trigger here or pass it down.
                // In ReviewForm I used 'action={handleSubmit}', so I'll pass createReview.bind(null, cabinId)
            }} 
            onCancel={() => setShowForm(false)} 
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <AnimatePresence initial={false}>
          {optimisticReviews.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary-500 font-serif italic text-lg lg:col-span-2 text-center py-20 bg-primary-900/10 rounded-3xl border border-dashed border-primary-800"
            >
              No reflections have been shared yet. Be the first to immortalize your stay.
            </motion.p>
          ) : (
            optimisticReviews.map((review, index) => (
              <motion.div 
                key={review.id} 
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-primary-900/20 hover:bg-primary-900/30 p-8 rounded-3xl border border-primary-800 hover:border-accent-500/30 transition-all duration-500 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                    <StarIcon className="w-32 h-32 text-accent-500" />
                 </div>
                 
                 <div className="flex items-center gap-5 mb-6">
                    <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-primary-800 group-hover:border-accent-500/50 transition-colors shadow-2xl">
                       <Image 
                         src={review.guests.image ? (review.guests.image.startsWith("/") || review.guests.image.startsWith("http") ? review.guests.image : `/${review.guests.image}`) : "/default-user.jpg"} 
                         fill 
                         className="object-cover" 
                         alt={review.guests.fullName} 
                       />
                    </div>
                    <div>
                       <p className="text-white font-serif text-lg leading-tight">{review.guests.fullName}</p>
                       <div className="flex text-accent-500 mt-1">
                          {[...Array(5)].map((_, i) => (
                             <StarIcon key={i} className={`h-3 w-3 ${i < review.rating ? "text-accent-500" : "text-primary-800"}`} />
                          ))}
                       </div>
                    </div>
                 </div>
                 <p className="text-primary-200 text-sm leading-relaxed italic font-serif relative z-10">
                    &quot;{review.comment}&quot;
                 </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ReviewSection;
