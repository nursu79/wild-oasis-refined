import SignInButton from "../_components/SignInButton";
import Image from "next/image";
import MountainWisdom from "../_components/MountainWisdom";

export const metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <div className="relative min-h-[calc(100vh-120px)] w-full flex items-center justify-center overflow-hidden -mt-8">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Gemini_Generated_Image_rdr0g2rdr0g2rdr0.png"
          fill
          className="object-cover scale-105 blur-[8px]"
          alt="Luxury Wilderness Entrance"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-primary-950/60 backdrop-brightness-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/40 via-transparent to-primary-950 shadow-[inset_0_0_300px_rgba(0,0,0,0.8)]" />
      </div>

      {/* Cinematic Login Card */}
      <div className="relative z-10 w-full max-w-xl px-4">
        <div className="bg-primary-950/60 backdrop-blur-xl border border-accent-500/30 rounded-3xl p-12 text-center shadow-2xl flex flex-col items-center">
            <div className="w-16 h-1 w-accent-500 bg-accent-500 mb-10 rounded-full shadow-[0_0_15px_rgba(194,163,120,0.5)]" />
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-accent-100 mb-6 leading-tight max-w-sm">
                Your sanctuary in the wilderness awaits.
            </h2>
            
            <MountainWisdom />
            
            <p className="text-primary-300 mb-12 text-lg font-light tracking-wide italic">
                Please sign in to continue.
            </p>

            <SignInButton />

            <div className="mt-16 pt-8 border-t border-primary-800/50 w-full">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-accent-500 opacity-80 mb-2">
                    Priority Membership
                </p>
                <p className="text-xs text-primary-400 font-light max-w-xs mx-auto leading-relaxed">
                    Members from East Africa automatically qualify for our exclusive <span className="text-accent-400 font-bold italic">Resident Rates</span>.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
