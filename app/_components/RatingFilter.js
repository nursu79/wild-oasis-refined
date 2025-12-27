"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import StarRating from "./StarRating";
import { XMarkIcon } from "@heroicons/react/24/outline";

function RatingFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeRating = Number(searchParams.get("rating")) || 0;

  function handleFilter(rating) {
    const params = new URLSearchParams(searchParams);
    if (rating === 0) {
      params.delete("rating");
    } else {
      params.set("rating", rating);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center gap-6 bg-primary-950/40 px-6 py-3 rounded-full border border-primary-800 backdrop-blur-md shadow-xl group hover:border-accent-500/30 transition-all">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 group-hover:text-accent-500 transition-colors">
          Filter by Rating
        </span>
        <StarRating 
          rating={activeRating} 
          setRating={handleFilter} 
          size={5} 
        />
      </div>

      {activeRating > 0 && (
        <button
          onClick={() => handleFilter(0)}
          className="flex items-center gap-2 text-[10px] font-bold text-accent-500 hover:text-white transition-colors bg-accent-500/10 px-3 py-1 rounded-full border border-accent-500/20"
        >
          <XMarkIcon className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}

export default RatingFilter;
