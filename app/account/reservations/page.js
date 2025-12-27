import ReservationList from "@/app/_components/ReservationList";
import { auth } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";

export const metadata = {
  title: "Reservations",
};

export default async function Page() {
  const session = await auth();
  const bookings = await getBookings(session.user.guestId);

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="font-serif text-3xl text-accent-400">
        Your Managed Stays
      </h2>

      {bookings.length === 0 ? (
        <div className="bg-primary-900/40 backdrop-blur-md rounded-3xl p-12 border border-accent-500/10 text-center shadow-xl">
          <p className="text-xl text-primary-300 font-serif italic mb-6">
            You have no active or past reservations yet.
          </p>
          <a 
            className="inline-block bg-accent-500 text-primary-950 px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-accent-400 transition-all shadow-xl shadow-accent-500/10" 
            href="/cabins"
          >
            Explore Luxury Cabins &rarr;
          </a>
        </div>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
