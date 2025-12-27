import SelectCountry from "@/app/_components/SelectCountry";
import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import { auth } from "@/app/_lib/auth";
import { getGuest } from "@/app/_lib/data-service";

export const metadata = {
  title: "Update profile",
};

export default async function Page() {
  const session = await auth();
  if (!session) return null;

  const guest = await getGuest(session.user.email);

  if (!guest) {
    return (
      <div className="bg-red-950/20 border border-red-500/20 p-8 rounded-3xl text-center">
        <h2 className="text-xl font-serif text-red-400 mb-4">Guest Data Unavailable</h2>
        <p className="text-primary-300 mb-6">We couldn&apos;t retrieve your guest profile. Please ensure you have run the database repair SQL in Supabase.</p>
        <p className="text-xs text-primary-500">Alternatively, try signing out and back in to re-sync your account.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-3xl text-accent-400 mb-4">
        Update your guest profile
      </h2>

      <p className="text-lg mb-8 text-primary-200 font-serif italic opacity-70">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>

      <UpdateProfileForm guest={guest}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-900/50 border border-primary-800 text-primary-100 w-full shadow-sm rounded-xl outline-none focus:ring-2 focus:ring-accent-500 transition-all"
          defaultCountry={guest?.nationality || ""}
        />
      </UpdateProfileForm>
    </div>
  );
}
