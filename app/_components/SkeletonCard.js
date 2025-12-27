import { PhotoIcon } from "@heroicons/react/24/outline";

function SkeletonCard() {
  return (
    <div className="flex flex-col border border-primary-800 rounded-md bg-primary-950/50 overflow-hidden animate-pulse">
      <div className="aspect-[3/4] w-full bg-primary-900 flex items-center justify-center relative">
         <PhotoIcon className="w-12 h-12 text-primary-800" />
      </div>
      
      <div className="flex flex-col flex-grow px-6 py-5 gap-4">
        <div className="h-8 bg-primary-900 rounded w-3/4"></div>
        <div className="flex gap-2">
           <div className="h-4 bg-primary-900 rounded w-4"></div>
           <div className="h-4 bg-primary-900 rounded w-1/2"></div>
        </div>
        <div className="mt-auto h-6 bg-primary-900 rounded w-1/3 self-end"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
