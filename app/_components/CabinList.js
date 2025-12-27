import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "../_lib/data-service";
import CabinGrid from "./CabinGrid";
import { auth } from "../_lib/auth";

async function CabinList({ filter, search, rating: searchParamsRating }) {
  const [cabins, session] = await Promise.all([
    getCabins(),
    auth()
  ]);

  if (!cabins.length) return null;

  const isLoggedIn = Boolean(session?.user);
  const isResident = Boolean(session?.user?.isResident);
  const isEthiopian = Boolean(session?.user?.isEthiopian);

  let displayedCabins;
  if (filter === "all") displayedCabins = cabins;
  if (filter === "small")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  if (filter === "medium")
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
    );
  if (filter === "large")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

  // Rapid Local Name Filter
  if (search) {
      const searchQuery = search.toLowerCase();
      displayedCabins = displayedCabins.filter(cabin => {
         return cabin.name.toLowerCase().includes(searchQuery);
      });
  }

  // Rating Filter
  const rating = Number(searchParamsRating) || 0;
  if (rating > 0) {
      displayedCabins = displayedCabins.filter(cabin => cabin.average_rating >= rating);
  }

  if (!displayedCabins.length) 
    return (
      <div className="text-center mt-20 col-span-full">
        <h3 className="text-3xl font-serif text-primary-200">No luxury cabins match your filters.</h3>
        <p className="text-primary-400 mt-2">Try adjusting your rating or guest requirements.</p>
      </div>
    );

  return <CabinGrid cabins={displayedCabins} isLoggedIn={isLoggedIn} isResident={isResident} isEthiopian={isEthiopian} />;
}

export default CabinList;
