"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConciergeFAB({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulate network delay for realism
    setTimeout(() => {
        setMessages((prev) => [...prev, { 
            role: "assistant", 
            text: "I am currently trekking the high peaks to update my knowledge base. I will return with fresh mountain wisdom soon." 
        }]);
        setIsLoading(false);
    }, 1000);
  }

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[100] bg-accent-500 text-primary-950 p-4 rounded-full shadow-[0_0_30px_rgba(194,163,120,0.4)] hover:scale-110 active:scale-95 transition-all group overflow-hidden border-2 border-accent-600/50"
      >
        <div className="flex items-center gap-3 px-2">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
           </svg>
           <span className="font-black text-xs uppercase tracking-widest hidden md:block">Ask the Oasis Concierge</span>
        </div>
      </button>

      {/* Modal Backdrop */}
      <AnimatePresence mode="popLayout">
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#050505]/60 backdrop-blur-md"
            />
            
            {/* Modal Content - Under Construction */}
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-obsidian rounded-3xl overflow-hidden shadow-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
            >
               {/* Pulsing Gold Light Background */}
               <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/10 rounded-full blur-[100px] animate-pulse" />
               </div>

               <div className="z-10 relative">
                  <div className="w-16 h-1 w-accent-500 bg-accent-500 mb-8 rounded-full shadow-[0_0_15px_rgba(194,163,120,0.5)] mx-auto" />
                  
                  <h3 className="text-2xl font-serif font-bold text-accent-100 mb-6 leading-tight">
                     Refining the Oracle
                  </h3>
                  
                  <p className="text-primary-200 text-lg font-light leading-relaxed italic mb-8">
                     &quot;Our AI Concierge is currently trekking the high peaks for better data. Returning soon.&quot;
                  </p>

                  <div className="flex gap-2 justify-center">
                    <span className="w-2 h-2 rounded-full bg-accent-500 animate-bounce" style={{ animationDelay: "0s" }} />
                    <span className="w-2 h-2 rounded-full bg-accent-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 rounded-full bg-accent-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
