import Link from "next/link";

export default function Navigation({ session }) {
  return (
    <nav className="z-10 text-xl font-serif hidden md:block transition-all duration-500">
      <ul className="flex gap-12 items-center text-primary-100 glass-obsidian px-8 py-2 rounded-full">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-all hover:tracking-wider"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-all hover:tracking-wider"
          >
            About
          </Link>
        </li>
        <li>
          {session?.user?.image ? (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex items-center gap-4 py-2 px-4 rounded-full hover:bg-white/5"
            >
              <img
                className="h-8 rounded-full border border-primary-800"
                src={session.user.image}
                alt={session.user.name}
                referrerPolicy="no-referrer"
              />
              <span>Guest area</span>
            </Link>
          ) : (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-all hover:tracking-wider"
            >
              Guest area
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
