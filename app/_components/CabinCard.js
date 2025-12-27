"use client";

import Image from "next/image";
import Link from "next/link";
import { UsersIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import StarRating from "./StarRating";

function CabinCard({ cabin, index, isLoggedIn, isResident, isEthiopian }) {
  const { id, name, maxCapacity, regularPrice, discount, image, average_rating, num_reviews } = cabin;
  
  const isVerified = average_rating >= 4.5;
  const displayImage = image?.startsWith("/") || image?.startsWith("http") ? image : `/${image}`;

  // Membership & Residency Pricing Logic
  const showDiscount = isLoggedIn && discount > 0;
  
  // High-End Cabin IDs (as requested by user)
  const isFeaturedCabin = id >= 14 && id <= 21;

  // Triple-Layer Math
  const memberPrice = regularPrice - discount;
  const residentPrice = Math.round(memberPrice * 0.9); // Tier 3: Extra 10% off
  
  const finalPrice = (isEthiopian && isFeaturedCabin) ? residentPrice : (showDiscount ? memberPrice : regularPrice);

  // Staggered global entry animation
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="group flex flex-col relative overflow-hidden outline-none"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-sm bg-primary-950">
        <Image
          src={displayImage}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index < 4}
          alt={`Cabin ${name}`}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.classList.add('bg-fallback-pattern');
          }}
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {isVerified && (
              <div className="bg-accent-500 text-primary-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-2xl border border-white/20">
                <CheckBadgeIcon className="h-3.5 w-3.5" />
                Verified Luxury
              </div>
            )}
            
            {isEthiopian && isFeaturedCabin ? (
               <div className="bg-[#c2a378] text-primary-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-2xl border border-white/20">
                  <span className="w-1.5 h-1.5 bg-primary-950 rounded-full animate-pulse"></span>
                  Resident VIP Rate
               </div>
            ) : showDiscount && (
              <div className="bg-primary-950/80 backdrop-blur-md text-accent-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-2xl border border-accent-500/30">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse"></span>
                Member Rate
              </div>
            )}
        </div>

        {/* Fallback Overlay (visible if image fails or while loading) */}
        <div className="absolute inset-0 bg-primary-950 -z-10 flex items-center justify-center">
             <span className="text-primary-700 font-serif opacity-20 text-4xl">The Wild Oasis</span>
        </div>

        <div className="absolute bottom-4 right-4 bg-primary-950/90 px-4 py-2 border border-accent-400/20 shadow-xl backdrop-blur-sm flex flex-col items-end">
          {isEthiopian && isFeaturedCabin ? (
            <div className="flex flex-col items-end">
              <span className="text-primary-500 line-through text-[10px] font-light tracking-widest opacity-40">
                ${regularPrice}
              </span>
              <span className="text-accent-600 line-through text-[11px] font-medium tracking-widest opacity-60">
                ${memberPrice}
              </span>
              <div className="flex items-baseline">
                <span className="font-serif text-2xl font-bold text-[#c2a378] drop-shadow-[0_0_8px_rgba(194,163,120,0.5)]">
                  ${residentPrice}
                </span>
                <span className="text-[10px] font-black tracking-[0.2em] ml-2 text-primary-400 uppercase">/ NIGHT</span>
              </div>
            </div>
          ) : showDiscount ? (
            <>
              <span className="text-secondary-500 line-through text-xs font-light tracking-widest opacity-60">
                ${regularPrice}
              </span>
              <div className="flex items-baseline">
                <span className="font-serif text-xl font-bold text-[#c2a378]">
                  ${memberPrice}
                </span>
                <span className="text-[10px] font-black tracking-[0.2em] ml-2 text-primary-400 uppercase">/ NIGHT</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-baseline">
                <span className="font-serif text-xl font-bold text-accent-100">
                  ${regularPrice}
                </span>
                <span className="text-[10px] font-black tracking-[0.2em] ml-2 text-primary-400 uppercase">/ NIGHT</span>
              </div>
              {discount > 0 && (
                <span className="text-[9px] font-black text-accent-500 uppercase tracking-tighter mt-1 animate-pulse">
                  Ethiopian residents save extra 10%—Sign in
                </span>
              )}
            </>
          )}
        </div>

      </div>

      <div className="flex flex-col flex-grow pt-6 bg-transparent">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-3xl font-medium text-accent-100 group-hover:text-accent-400 transition-colors">
                Cabin {name}
            </h3>
            <div className="flex flex-col items-end gap-1">
                {num_reviews > 0 ? (
                  <>
                    <StarRating rating={average_rating} displayOnly={true} size={4} />
                    <span className="text-[9px] text-primary-500 font-bold uppercase tracking-tighter">
                        {num_reviews} {num_reviews === 1 ? 'Review' : 'Reviews'}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] italic text-primary-600 font-medium">No reflections yet</span>
                )}
            </div>
        </div>

        <div className="flex items-center gap-3 mb-6 border-b border-primary-800 pb-4">
          <UsersIcon className="h-5 w-5 text-accent-500" />
          <span className="text-base text-primary-200">
            Up to <span className="font-bold text-primary-50">{maxCapacity}</span> guests
          </span>
        </div>

        <div className="mt-auto flex justify-end">
          <Link
            href={`/cabins/${id}`}
            className="inline-block border-b border-accent-500 text-accent-500 pb-1 hover:text-accent-400 hover:border-accent-400 transition-all text-sm uppercase tracking-widest font-semibold"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default CabinCard;
