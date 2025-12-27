"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import StarRating from "./StarRating";
import { motion } from "framer-motion";
import { createReview } from "../_lib/actions";

export default function ReviewForm({ cabinId, guest, onAction, onCancel }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function clientAction(formData) {
    if (!comment || comment.length < 10) return;
    
    // 1. Prepare optimistic review object
    const optimisticReview = {
      id: Math.random(), 
      rating,
      comment,
      created_at: new Date().toISOString(),
      guests: {
        fullName: guest.name,
        image: guest.image
      }
    };

    // 2. Clear local UI immediately
    setComment("");
    setRating(5);
    onCancel();

    // 3. Trigger optimistic update in parent
    onAction(optimisticReview);
    
    // 4. Execute real server action
    // We recreate formData here if needed or just use passed one
    const submissionData = new FormData();
    submissionData.append("rating", rating);
    submissionData.append("comment", comment);
    
    try {
      await createReview(cabinId, submissionData);
    } catch (err) {
      console.error("Failed to post reflection:", err);
      // In a real app we might want to revert the optimistic update here
    }
  }

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      action={clientAction}
      className="bg-primary-950/40 backdrop-blur-xl p-10 rounded-3xl border border-accent-500/10 shadow-2xl mb-12"
    >
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
          <div>
             <h4 className="text-2xl font-serif text-accent-100 mb-1">Share Your Reflection</h4>
             <p className="text-primary-500 text-xs uppercase tracking-widest font-black">Verified Guest Stay</p>
          </div>
          <div className="bg-primary-900/50 px-6 py-4 rounded-2xl border border-primary-800">
             <StarRating rating={rating} setRating={setRating} />
             <input type="hidden" name="rating" value={rating} />
          </div>
       </div>

       <div className="relative group">
          <textarea 
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4" 
            className="w-full bg-primary-900/30 border border-primary-800 rounded-3xl p-8 text-primary-100 outline-none focus:ring-2 focus:ring-accent-500/50 transition-all placeholder:text-primary-700 resize-none"
            placeholder="Tell us about the morning mist, the warmth of the fire, or the silence of the peaks..."
          />
          <div className="absolute bottom-4 right-6 text-[10px] font-bold text-primary-600 uppercase tracking-tighter">
             {comment.length} / 1000 characters
          </div>
       </div>

       <div className="flex flex-col sm:flex-row justify-end items-center gap-8 mt-10">
          <button 
            type="button"
            onClick={onCancel}
            className="text-xs font-black text-primary-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            Discard Thought
          </button>
          <SubmitButton isReady={comment.length >= 10} />
       </div>
    </motion.form>
  )
}

function SubmitButton({ isReady }) {
  const { pending } = useFormStatus();
  
  return (
    <button 
      disabled={pending || !isReady}
      className="bg-accent-500 text-primary-950 px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-accent-400 transition-all shadow-[0_10px_30px_rgba(198,153,99,0.2)] disabled:opacity-20 disabled:grayscale active:scale-95 flex items-center gap-3"
    >
      {pending ? (
        <div className="w-4 h-4 border-2 border-primary-950 border-t-transparent rounded-full animate-spin" />
      ) : null}
      {pending ? "Immortalizing..." : "Post Reflection"}
    </button>
  );
}
