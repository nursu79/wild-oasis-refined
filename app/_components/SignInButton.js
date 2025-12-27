"use client";

import { useFormStatus } from "react-dom";
import { signInAction } from "../_lib/actions";

function SignInButton() {
  return (
    <form action={signInAction}>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium disabled:cursor-not-allowed"
      disabled={pending}
    >
      <img
        src="https://authjs.dev/img/providers/google.svg"
        alt="Google logo"
        height="24"
        width="24"
      />
      <span>{pending ? "Continuing..." : "Continue with Google"}</span>
    </button>
  );
}

export default SignInButton;
