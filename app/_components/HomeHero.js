"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import bg from "@/public/bg.png";

export default function HomeHero() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // Subtle parallax shifts
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <div ref={targetRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[60vh] lg:min-h-[80vh] relative pt-12 lg:pt-0">
      
      {/* Text Section (Overlapping) */}
      <motion.div 
        style={{ y: yText }}
        className="relative z-20 col-span-1 lg:col-span-7 lg:mr-[-100px] animate-fade-in-up"
      >
        <h1 className="text-6xl lg:text-9xl text-accent-50 mb-8 tracking-tighter font-serif font-medium leading-none">
          The Wild <br /> Oasis.
        </h1>
        <p className="text-xl text-primary-200 mb-10 max-w-xl font-sans leading-relaxed border-l-2 border-accent-500 pl-6">
          Where nature&apos;s beauty and comfortable living blend seamlessly.
          Hidden away in the heart of the Italian Dolomites, this is your
          paradise away from home.
        </p>
        <Link
          href="/cabins"
          className="bg-accent-500 px-8 py-5 text-primary-950 text-lg font-semibold hover:bg-accent-600 transition-all hover:shadow-[0_0_30px_rgba(198,153,99,0.5)] hover:-translate-y-1 inline-block"
        >
          Start your journey
        </Link>
      </motion.div>

      {/* Image Section with Parallax & Texture */}
      <div className="relative col-span-1 lg:col-span-5 h-[500px] lg:h-[750px] w-full animate-fade-in [animation-delay:0.3s] overflow-hidden rounded-2xl shadow-2xl">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-accent-500/10 transform rotate-6 scale-95 blur-3xl z-0" />
        
        <motion.div 
          style={{ y: yImage }}
          className="relative h-full w-full scale-110"
        >
          <Image
            src={bg}
            fill
            placeholder="blur"
            quality={100}
            className="object-cover object-top brightness-90 grayscale-[0.1] contrast-[1.1]"
            alt="Mountains and forests with two cabins"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* Premium Texture & Blend Overlays */}
        {/* 1. The "Hook" Blend: Gold-to-Obsidian Gradient at the bottom */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-95" />
        
        {/* 2. Gold Tint Overlay (Bottom Weight) */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-10 bg-gradient-to-t from-accent-950/40 to-transparent mix-blend-multiply pointer-events-none" />
        
        {/* 3. Vignette */}
        <div className="absolute inset-0 z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]" />
      </div>

    </div>
  );
}
