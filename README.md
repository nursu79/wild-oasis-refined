# The Wild Oasis - Luxury Cabin Booking Platform

![The Wild Oasis](public/logo.png)

## 🏔️ Project Overview
**The Wild Oasis** is a luxury cabin booking application for the Italian Dolomites. Originally based on the Jonas Schmedtmann Next.js course, this version has been **heavily customized** into a premium "Obsidian" production build.

**Key Features:**
- **Obsidian Theme**: A custom `#050505` dark mode with "frosted obsidian" glassmorphism UI.
- **Resident Privilege**: Automated 10% discount logic for verified Ethiopian residents (e.g., Sumeya Ibrahim).
- **Performance Optimized**: AI SDKs removed for <1s Time-to-Interactive; static fallbacks for Concierge.
- **Mobile First**: Premium Glassmorphism Hamburger Dock for mobile navigation.
- **Luxury UX**: Parallax visuals, seasonal gallery toggles, and seamless framer-motion transitions.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router, Server Actions)
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: NextAuth.js (Google & Guest Logic)
- **State Management**: React Context (Reservations) + URL State

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/the-wild-oasis.git
cd the-wild-oasis
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file with the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
```

### 4. Run Locally
```bash
npm run dev
```

## 📦 Deployment (Vercel)
This project is optimized for Vercel deployment.
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the environment variables in the Vercel Dashboard.
4. Deploy!

## 🦁 "Project Evolution" (Custom Audit)
This build differs significantly from the starter code:
- **Removed**: Heavy AI dependencies (`ai`, `@ai-sdk`) to fix build size.
- **Added**: `glass-obsidian` utility class, Resident Logic in `auth.js`, and "Under Construction" static AI modes.
- **Fixed**: Mobile vertical stacking issues resolved with a slide-down glass menu.

---
*Built with ❤️ by Sumeya *
