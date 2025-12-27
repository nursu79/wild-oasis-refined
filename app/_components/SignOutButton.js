import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { signOutAction } from "../_lib/actions";

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button className="group py-3 px-5 transition-all duration-300 flex items-center gap-4 font-semibold rounded-xl text-primary-300 hover:text-red-400 w-full hover:bg-red-500/10 active:scale-95">
        <ArrowRightOnRectangleIcon className="h-5 w-5 text-accent-500 group-hover:text-red-400 transition-colors" />
        <span className="tracking-tight">Personal Sign-out</span>
      </button>
    </form>
  );
}

export default SignOutButton;
