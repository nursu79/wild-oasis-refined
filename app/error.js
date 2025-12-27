"use client";

export default function Error({ error, reset }) {
  return (
    <main className="flex justify-center items-center flex-col gap-6 h-[80vh] relative">
      <h1 className="text-5xl font-serif text-accent-500 font-medium">
        Something went wrong!
      </h1>
      <p className="text-xl text-primary-200">{error.message}</p>

      <button
        onClick={reset}
        className="inline-block bg-accent-500 text-primary-950 px-6 py-3 text-lg font-semibold hover:bg-accent-600 transition-all font-sans rounded-sm hover:-translate-y-1 hover:shadow-lg"
      >
        Try again
      </button>
    </main>
  );
}
