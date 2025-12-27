import { Suspense } from "react";
import CabinList from "../_components/CabinList";
import CabinListSkeleton from "../_components/CabinListSkeleton";
import Counter from "../_components/Counter";
import Filter from "../_components/Filter";
import ReservationReminder from "../_components/ReservationReminder";

import RatingFilter from "../_components/RatingFilter";

export const revalidate = 0;

export default function Page({ searchParams }) {
  const filter = searchParams?.capacity ?? "all";
  const search = searchParams?.search ?? "";
  const rating = searchParams?.rating ?? "";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium font-serif animate-slide-up">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10 font-light animate-slide-up [animation-delay:0.2s]">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-6 mb-8 animate-fade-in [animation-delay:0.4s]">
        <RatingFilter />
        <Filter />
      </div>

      <Suspense fallback={<CabinListSkeleton />} key={filter + search + rating}>
        <CabinList filter={filter} search={search} rating={rating} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
