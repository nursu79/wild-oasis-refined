import Link from "next/link";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-accent-500 blur-3xl opacity-20 animate-pulse" />
        <CheckBadgeIcon className="h-24 w-24 text-accent-500 relative z-10" />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-5xl font-serif font-bold text-white tracking-tight">
          Reservation Confirmed
        </h1>
        <p className="text-primary-300 text-xl max-w-lg mx-auto leading-relaxed">
          Your slice of wilderness is waiting. We&apos;ve sent the details to your email, and your Forest Butler is preparing for your arrival.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link
          href="/account/reservations"
          className="bg-accent-500 text-primary-950 px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-accent-400 transition-all shadow-xl hover:shadow-accent-500/20 active:scale-95"
        >
          Manage Your Stay
        </Link>
        <Link
          href="/cabins"
          className="bg-transparent border border-primary-700 text-primary-200 px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
        >
          Back to Cabins
        </Link>
      </div>
    </div>
  );
}
