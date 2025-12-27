"use client";

import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileNavigation({ session }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((open) => !open);

  return (
    <div className="md:hidden relative">
      <button onClick={toggleMenu} className="relative z-[60] p-2 text-primary-100 focus:outline-none hover:text-accent-400 transition-colors">
        {isOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-14 w-64 glass-obsidian rounded-2xl shadow-2xl p-6 z-[120] flex flex-col gap-6"
          >
             <ul className="flex flex-col gap-6 text-xl font-serif text-primary-100">
                <li>
                  <Link href="/cabins" onClick={toggleMenu} className="hover:text-accent-400 transition-all flex items-center gap-3">
                    <span>Cabins</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" onClick={toggleMenu} className="hover:text-accent-400 transition-all flex items-center gap-3">
                    <span>About</span>
                  </Link>
                </li>
             </ul>

             <div className="border-t border-white/10 pt-6">
                {session?.user?.image ? (
                    <Link
                      href="/account"
                      onClick={toggleMenu}
                      className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-xl transition-all"
                    >
                       <img
                          className="h-10 w-10 rounded-full border border-primary-800"
                          src={session.user.image}
                          alt={session.user.name}
                          referrerPolicy="no-referrer"
                        />
                      <span className="text-sm font-semibold tracking-wider text-accent-100">Guest Area</span>
                    </Link>
                  ) : (
                    <Link href="/account" onClick={toggleMenu} className="text-primary-200 hover:text-white text-lg font-serif block text-center py-2">
                      Guest Area
                    </Link>
                  )}
             </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
