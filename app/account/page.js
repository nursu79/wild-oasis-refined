import { auth } from "../_lib/auth";
import Link from "next/link";
import { getBookings } from "../_lib/data-service";
import { 
  ChatBubbleLeftEllipsisIcon, 
  ArrowDownTrayIcon, 
  CloudIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { format, isFuture, isToday, differenceInDays } from "date-fns";

export const metadata = {
  title: "Guest area",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();
  const firstName = session.user.name.split(" ").at(0);
  
  const bookings = await getBookings(session.user.guestId);
  const activeBookings = bookings.filter(b => 
    b.status === 'unconfirmed' || 
    b.status === 'confirmed' || 
    b.status === 'checked-in'
  );
  
  // Find the next upcoming booking
  const upcomingBooking = activeBookings
    .filter(b => isFuture(new Date(b.startDate)) || isToday(new Date(b.startDate)))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  const daysToArrival = upcomingBooking 
    ? differenceInDays(new Date(upcomingBooking.startDate), new Date()) 
    : null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl text-accent-400">
          Concierge Portal
        </h2>
        <div className="flex items-center gap-4 text-primary-400 text-sm bg-primary-900/40 px-4 py-2 rounded-full border border-accent-500/10">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>Authenticated: <span className="text-primary-100">{session.user.email}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Concierge Welcome Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl group border border-accent-500/10 shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80')] bg-cover bg-center brightness-[0.25] group-hover:scale-105 transition-transform duration-1000" />
           <div className="absolute inset-0 bg-gradient-to-br from-primary-950 px-10 flex flex-col justify-between py-12 min-h-[450px]">
              <div>
                 <p className="text-accent-500 font-serif italic text-lg mb-2">Welcome to your oasis,</p>
                 <h1 className="text-6xl font-serif text-white font-bold tracking-tight">
                    {firstName}
                 </h1>
              </div>

              {upcomingBooking ? (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-accent-500/20 max-w-lg space-y-4 animate-slide-up">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-accent-400 text-xs font-bold uppercase tracking-widest">
                         <CalendarDaysIcon className="w-4 h-4" />
                         Next Stay Detail
                      </div>
                      {daysToArrival !== null && (
                         <div className="flex items-center gap-1.5 text-accent-500 text-xs font-bold bg-accent-500/10 px-3 py-1 rounded-full border border-accent-500/20">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {daysToArrival === 0 ? "Arriving Today" : `${daysToArrival} Days to Arrival`}
                         </div>
                      )}
                   </div>
                   
                   <div>
                      <h3 className="text-2xl font-serif text-white mb-1">{upcomingBooking.cabins.name}</h3>
                      <p className="text-primary-300">
                         {format(new Date(upcomingBooking.startDate), "MMMM dd")} &mdash; {format(new Date(upcomingBooking.endDate), "MMMM dd, yyyy")}
                      </p>
                   </div>

                   <Link 
                     href={`/account/reservations`}
                     className="inline-flex items-center gap-2 bg-accent-500 text-primary-950 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-accent-400 transition-all shadow-lg hover:shadow-accent-500/20 active:scale-95"
                   >
                     Guest Management &rarr;
                   </Link>
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-md animate-slide-up">
                   <h3 className="text-2xl font-serif text-white mb-2 font-bold">Nature is calling</h3>
                   <p className="text-primary-300 mb-6">You don't have any upcoming stays yet. Explore our cabins and find your perfect escape.</p>
                   <Link 
                     href="/cabins"
                     className="inline-flex bg-accent-500 text-primary-950 px-10 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-accent-400 transition-all active:scale-95"
                   >
                     Reserve a Cabin
                   </Link>
                </div>
              )}
           </div>
        </div>

        {/* RIGHT COLUMN: Quick Links */}
        <div className="space-y-6">
           <div className="bg-primary-900/40 backdrop-blur-md border border-accent-500/10 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary-400 mb-8 flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                 Guest Services
              </h3>
              
              <div className="space-y-5">
                 <QuickLink 
                   href="/account/reservations" 
                   icon={<ChatBubbleLeftEllipsisIcon />} 
                   title="Contact Host" 
                   subtitle="Forest Assistant" 
                 />
                 <QuickLink 
                   href="#" 
                   icon={<ArrowDownTrayIcon />} 
                   title="Welcome Guide" 
                   subtitle="Essential Info" 
                 />
                 <QuickLink 
                   href={upcomingBooking ? `/cabins/${upcomingBooking.cabinId}` : "/cabins"} 
                   icon={<CloudIcon />} 
                   title="Local Weather" 
                   subtitle="Dolomites Live" 
                 />
                 <QuickLink 
                   href="#" 
                   icon={<MapPinIcon />} 
                   title="Precision GPS" 
                   subtitle="Direct Pathway" 
                 />
              </div>
           </div>

           {/* Stats Card */}
           <Link 
             href="/account/reservations"
             className="bg-accent-500 p-8 rounded-3xl text-primary-950 flex justify-between items-center shadow-xl group hover:bg-accent-400 transition-all border border-accent-500/20"
           >
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Stays</p>
                 <p className="text-5xl font-serif font-bold">{activeBookings.length}</p>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-primary-950/10 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
                 <CalendarDaysIcon className="w-8 h-8" />
              </div>
           </Link>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ icon, title, subtitle, href = "#" }) {
  return (
    <Link href={href} className="flex items-center gap-5 w-full group p-2 rounded-2xl hover:bg-white/5 transition-all">
       <div className="h-12 w-12 rounded-xl bg-primary-800 border border-accent-500/10 flex items-center justify-center text-accent-500 group-hover:bg-accent-500 group-hover:text-primary-950 group-hover:shadow-lg group-hover:shadow-accent-500/20 transition-all duration-500">
          {cloneElement(icon, { className: "w-6 h-6" })}
       </div>
       <div>
          <p className="text-sm font-bold text-primary-100 group-hover:text-white transition-colors tracking-tight">{title}</p>
          <p className="text-[10px] uppercase font-black text-primary-500 tracking-widest opacity-80">{subtitle}</p>
       </div>
    </Link>
  );
}

import { cloneElement } from "react";
