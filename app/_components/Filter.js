"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleSearch(e) {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("search", e.target.value);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-4xl mx-auto mb-12">
      {/* Classic Name Search */}
      <div className="relative w-full md:w-80 group">
        <input 
           type="text" 
           placeholder="Search by cabin name..." 
           onChange={handleSearch}
           defaultValue={searchParams.get("search")?.toString()}
           className="w-full bg-[#050505] border border-primary-800/40 rounded-full px-5 py-3 pl-12 text-primary-100 placeholder-primary-500 focus:outline-none focus:border-accent-500/50 transition-all font-light shadow-2xl group-hover:border-primary-700/60"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-500 group-hover:text-accent-500 transition-colors">
             <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
           </svg>
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex flex-wrap justify-center gap-2 p-1 bg-[#050505] rounded-full border border-primary-800 shadow-lg">
        <Button
          filter="all"
          handleFilter={handleFilter}
          activeFilter={activeFilter}
        >
          All cabins
        </Button>
        <Button
          filter="small"
          handleFilter={handleFilter}
          activeFilter={activeFilter}
        >
          2&mdash;3 guests
        </Button>
        <Button
          filter="medium"
          handleFilter={handleFilter}
          activeFilter={activeFilter}
        >
          4&mdash;7 guests
        </Button>
        <Button
          filter="large"
          handleFilter={handleFilter}
          activeFilter={activeFilter}
        >
          8&mdash;12 guests
        </Button>
      </div>
    </div>
  );
}

function Button({ filter, handleFilter, activeFilter, children }) {
  const isActive = filter === activeFilter;
  return (
    <button
      onClick={() => handleFilter(filter)}
      className={`glass-obsidian px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10 active:scale-95 ${
        isActive ? "text-primary-50 shadow-[0_0_15px_rgba(190,150,100,0.2)] bg-white/10" : "text-primary-200"
      }`}
    >
      {children}
    </button>
  );
}

export default Filter;
