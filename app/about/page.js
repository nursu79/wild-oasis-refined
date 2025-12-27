import Link from "next/link";
import Image from "next/image";
import image1 from "@/public/about-1.jpg";
import image2 from "@/public/about-2.jpg";
import { getCabins } from "../_lib/data-service";

export const revalidate = 86400;

export const metadata = {
  title: "About",
};


import { auth } from "../_lib/auth";
import LegacyNarration from "../_components/LegacyNarration";

export default async function Page() {
  const cabins = await getCabins();
  const session = await auth();

  return (
    <div className="flex flex-col gap-32 mb-24 relative">
      <LegacyNarration nationality={session?.user?.nationality} />
      {/* Section 1: The Wilderness Sanctuary */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-12 relative h-[70vh] rounded-3xl overflow-hidden shadow-2xl mb-8">
           <Image
             src={image1}
             alt="Luxury Cabin in Dolomites"
             fill
             className="object-cover transition-transform duration-[10s] hover:scale-110"
             placeholder="blur"
             quality={90}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
           <div className="absolute bottom-12 left-12 max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-accent-100 mb-8 leading-tight drop-shadow-2xl">
                The Heritage of <br/> <span className="text-accent-500 italic">Wilderness.</span>
              </h1>
           </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-1 text-xl font-light leading-relaxed space-y-8 text-primary-200">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-4 first-letter:text-accent-500">
            Where nature&apos;s raw beauty meets the peak of architectural elegance.
            Hidden deep within the cradle of the Italian Dolomites, The Wild Oasis 
            is more than a destination—it is a sanctuary for the soul. Here, time 
            dissolves into the mountain mist.
          </p>
          <p>
            Our {cabins.length} hand-crafted luxury cabins serve as quiet outposts 
            of tranquility. Whether you are wandering through ancient cedar forests 
            or gazing at the cosmic theatre of the night sky, every moment here 
            is an invitation to reconnect with the essential rhythms of the world.
          </p>
        </div>

        <div className="lg:col-span-4 lg:col-start-9 bg-primary-900/20 backdrop-blur-3xl p-8 rounded-3xl border border-accent-500/10 shadow-2xl">
           <div className="flex flex-col gap-6">
              <div className="w-12 h-1 bg-accent-500 rounded-full" />
              <h3 className="text-2xl font-serif font-bold text-accent-100">Our Essence</h3>
              <p className="text-sm text-primary-400 italic">&quot;Slow down, breathe deep, and rediscover the joy of being together.&quot;</p>
              <Link
                href="/cabins"
                className="w-full text-center bg-accent-500 py-4 text-primary-950 font-black tracking-widest uppercase text-xs rounded-xl hover:bg-accent-400 transition-all shadow-[0_0_20px_rgba(194,163,120,0.3)]"
              >
                Experience Now
              </Link>
           </div>
        </div>
      </section>

      {/* Section 2: Family Legacy */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
        <div className="lg:col-span-5 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
          <Image
            src="/about-2.jpg"
            fill
            className="object-cover"
            alt="The family behind The Wild Oasis"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>

        <div className="lg:col-span-7 space-y-12 order-1 lg:order-2">
          <div className="space-y-4">
             <p className="text-accent-500 font-black uppercase tracking-[0.4em] text-xs">Since 1962</p>
             <h2 className="text-5xl font-serif font-bold text-accent-100 italic">A Legacy Carved in Stone.</h2>
          </div>

          <div className="text-lg leading-relaxed text-primary-300 space-y-8">
            <p>
              Since 1962, The Wild Oasis has been a cherished family-run retreat.
              What started as a modest Alpine hut built by our grandparents has 
              ascended into a testament of our family&apos;s dedication to the art 
              of luxury hospitality.
            </p>
            <p>
              Over sixty years later, we remain fiercely committed to the personal 
              touch that only a family business can provide. Here, you are not 
              merely a guest; you are an honored member of our Alpine lineage.
            </p>
          </div>

          <div className="pt-8 border-t border-primary-800 flex flex-col items-start gap-4">
              <p className="text-accent-100 font-serif text-3xl italic">The Management Family</p>
              {/* Signature Component */}
              <div className="relative">
                 <span className="font-['Cursive'] text-5xl text-accent-500 opacity-80 select-none transform -rotate-3 block">
                    The Wild Oasis Team
                 </span>
                 <div className="absolute -bottom-2 right-0 w-24 h-[1px] bg-accent-500/50" />
              </div>
          </div>
        </div>
      </section>
    </div>
  );
}
