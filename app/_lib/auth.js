import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest)
          await createGuest({ email: user.email, name: user.name });

        return true;
      } catch (err) {
        console.error("Sign in error:", err);
        return false;
      }
    },
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      if (guest) {
        session.user.guestId = guest.id;

        // East African Residency Detection
        const eastAfricanCountries = [
          "Ethiopia", "Kenya", "Tanzania", "Uganda", "Rwanda", 
          "Burundi", "South Sudan", "Djibouti", "Eritrea", "Somalia"
        ];
        session.user.isResident = eastAfricanCountries.includes(guest.nationality);
        session.user.isEthiopian = guest.nationality === "Ethiopia";
        session.user.nationality = guest.nationality;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
