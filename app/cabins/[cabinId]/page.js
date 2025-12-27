import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import SeasonalGallery from "@/app/_components/SeasonalGallery";
import WeatherWidget from "@/app/_components/WeatherWidget";
import ReviewSection from "@/app/_components/ReviewSection";
import { 
  getCabin, 
  getCabins, 
  getReviews, 
  getAverageRating,
  hasGuestStayedInCabin 
} from "@/app/_lib/data-service";
import { auth } from "@/app/_lib/auth";
import { StarIcon } from "@heroicons/react/24/solid";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const cabin = await getCabin(params.cabinId);
  return { title: `Cabin ${cabin.name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  const ids = cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
  return ids;
}

export default async function Page({ params }) {
  const [cabin, reviews, averageRating, session] = await Promise.all([
    getCabin(params.cabinId),
    getReviews(params.cabinId),
    getAverageRating(params.cabinId),
    auth()
  ]);

  const canReview = session?.user?.guestId 
    ? await hasGuestStayedInCabin(session.user.guestId, params.cabinId) 
    : false;

  return (
    <div className="max-w-7xl mx-auto mt-0 mb-32">
      {/* 1. Full Width Immersive Hero */}
      <div className="mb-16 -mx-8 sm:mx-0 sm:rounded-3xl overflow-hidden shadow-2xl relative">
          <SeasonalGallery cabin={cabin} />
      </div>

      {/* 2. Main Layout - Single Column Flow */}
      <div className="max-w-5xl mx-auto px-4 sm:px-0">
          <div className="mb-12 flex items-baseline justify-between group">
            <div className="flex flex-col gap-2">
              <h2 className="text-5xl font-serif font-bold text-accent-100 drop-shadow-md">
                  About {cabin.name}
              </h2>
              {averageRating > 0 && (
                <div className="flex items-center gap-2 text-accent-500 bg-accent-500/10 px-4 py-1.5 rounded-full border border-accent-500/20 w-fit">
                   <StarIcon className="h-4 w-4" />
                   <span className="text-sm font-bold tracking-widest uppercase">{averageRating} Average Rating</span>
                </div>
              )}
            </div>
            <Suspense fallback={
              <div className="flex items-center gap-3 bg-primary-900/20 px-4 py-2 rounded-full border border-primary-800/50 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-primary-800" />
                <div className="w-12 h-4 bg-primary-800 rounded" />
              </div>
            }>
                <WeatherWidget lat={cabin.latitude} lng={cabin.longitude} />
            </Suspense>
          </div>
          
          <Cabin cabin={cabin} />

        <ReviewSection 
          cabinId={params.cabinId} 
          reviews={reviews} 
          averageRating={averageRating}
          canReview={canReview}
          user={session?.user}
        />

          {/* Reservation Section - Now Horizontal */}
          <div className="mt-24 pt-20 border-t border-primary-800">
              <div className="text-center mb-10">
                  <h3 className="font-serif text-3xl text-accent-100 mb-2">Reserve {cabin.name} today</h3>
                  <p className="text-primary-300">Experience luxury in the heart of nature. Pay on arrival.</p>
              </div>

              <Suspense fallback={<Spinner />}>
                <Reservation cabin={cabin} />
              </Suspense>
          </div>
      </div>
    </div>
  );
}
