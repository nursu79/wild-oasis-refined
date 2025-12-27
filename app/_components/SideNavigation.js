"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import SignOutButton from "./SignOutButton";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navLinks = [
  {
    name: "Home",
    href: "/account",
    icon: HomeIcon,
  },
  {
    name: "Reservations",
    href: "/account/reservations",
    icon: CalendarDaysIcon,
  },
  {
    name: "Guest profile",
    href: "/account/profile",
    icon: UserIcon,
  },
];

function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="relative h-[calc(100vh-12rem)]">
      <ul className="flex flex-col gap-4 h-full text-lg bg-primary-900/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-2xl relative">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.name} className="relative">
              <Link
                className={`group py-3 px-5 transition-all duration-300 flex items-center gap-4 font-semibold rounded-xl relative z-10 ${
                  isActive 
                    ? "text-primary-950" 
                    : "text-primary-300 hover:text-primary-100"
                }`}
                href={link.href}
              >
                <link.icon className={`h-5 w-5 transition-colors ${isActive ? "text-primary-950" : "text-accent-500 group-hover:text-accent-400"}`} />
                <span>{link.name}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-accent-500 rounded-xl shadow-[0_0_20px_rgba(191,155,90,0.3)]"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            </li>
          );
        })}

        <li className="mt-auto pt-6 border-t border-primary-800/50">
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}

export default SideNavigation;
