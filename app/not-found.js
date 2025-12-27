import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex justify-center items-center flex-col gap-6 h-[80vh] relative">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-serif text-accent-400 font-medium">
          This page could not be found :(
        </h1>
        <Link
          href="/"
          className="inline-block bg-accent-500 text-primary-950 px-6 py-3 text-lg font-semibold hover:bg-accent-600 transition-all font-sans rounded-sm hover:-translate-y-1 hover:shadow-lg"
        >
          Return to Oasis
        </Link>
      </div>
    </main>
  );
}

