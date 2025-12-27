import Logo from "@/app/_components/Logo";
import Navigation from "@/app/_components/Navigation";

import { Cormorant_Garamond, Inter } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["300", "400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

import "@/app/_styles/globals.css";
import Header from "@/app/_components/Header";
import { ReservationProvider } from "@/app/_components/ReservationContext";
import { auth } from "@/app/_lib/auth";
import ConciergeFAB from "@/app/_components/ConciergeFAB";

export const metadata = {
  title: {
    template: "%s / The Wild Oasis",
    default: "Welcome / The Wild Oasis",
  },
  description:
    "Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${inter.variable} font-sans antialiased bg-[#050505] text-primary-100 min-h-screen flex flex-col relative selection:bg-accent-500 selection:text-primary-950`}
      >
        <div className="bg-noise" />
        <Header />

        <div className="flex-1 px-8 pt-48 pb-12 grid">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
        <ConciergeFAB user={session?.user} />
      </body>
    </html>
  );
}
