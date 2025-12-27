"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function LegacyNarration({ nationality }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && !text && !loading) {
      const fetchNarration = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mode: "narrate",
              nationality: nationality || "Guest",
              query: "Since 1962, The Wild Oasis has been a cherished family-run retreat. What started as a modest Alpine hut built by our grandparents has ascended into a testament of our family's dedication to the art of luxury hospitality. Over sixty years later, we remain fiercely committed to the personal touch that only a family business can provide. Here, you are not merely a guest; you are an honored member of our Alpine lineage.",
            }),
          });
          
          if (!res.ok) throw new Error("Failed to fetch narration");
          
          // Simple streaming simulation or just standard text for flashiness
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let done = false;
          let narrationText = "";
          
          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            narrationText += chunkValue;
            setText(narrationText);
          }
        } catch (err) {
          console.error(err);
          setText("Witness the vertical heritage of the Dolomites. Managed with love by our family since 1962.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchNarration();
    }
  }, [inView, text, loading, nationality]);

  return (
    <div ref={ref} className="fixed bottom-8 left-8 z-50 max-w-xs transition-all duration-1000">
      <div className={`bg-primary-900/40 backdrop-blur-2xl border border-accent-500/20 p-5 rounded-2xl shadow-3xl transform ${inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
         <div className="flex items-center gap-3 mb-3">
            <div className={`w-2 h-2 rounded-full ${loading ? "bg-accent-500 animate-ping" : "bg-accent-500"}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-500">Concierge AI Narration</span>
         </div>
         <p className="text-xs text-primary-100 leading-relaxed italic font-light font-serif">
           {text || (loading ? "Summoning alpine wisdom..." : "Scroll down to hear our story...")}
         </p>
         {!loading && text && (
           <div className="mt-3 pt-3 border-t border-white/5">
              <span className="text-[10px] text-accent-500/50 uppercase font-bold tracking-widest">Powered by Gemini 1.5 Flash</span>
           </div>
         )}
      </div>
    </div>
  );
}
