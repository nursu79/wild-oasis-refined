"use client";

import { useEffect, useState } from "react";

export default function StickyHeader({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-500 border-b border-transparent ${
        isScrolled
          ? "py-3 bg-[#050505]/80 backdrop-blur-xl border-white/5 shadow-2xl"
          : "py-6 bg-transparent"
      }`}
    >
      <div
        className={`px-8 transition-all duration-500 ${
          isScrolled ? "scale-[0.98]" : "scale-100"
        }`}
      >
        {children}
      </div>
    </header>
  );
}
