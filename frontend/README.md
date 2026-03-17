         
                                <!-- Temporary README -->


# 🚀 TrackKar

**Track smarter. Build faster.**

Real-time team task tracker for hackathons and deadline-driven teams — no signups, no complexity.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

[**Live Demo →**](https://trackkar.vercel.app)

</div>

---

## What it does

One person creates a team → gets a **6-letter code** → teammates join instantly from any device. No accounts. Real-time sync via Firebase.

- 📋 Kanban board with live updates across all members
- 🕐 Deadline countdown with urgent mode
- 📊 4 visualization modes — Liquid Tanks, Radial Charts, Energy Bars, Kanban
- 👥 Role-based permissions (leader vs member)
- ⚡ Setup under 30 seconds

---

## Getting Started

```bash
git clone https://github.com/yourusername/trackkar.git
cd trackkar
npm install
```

Create a `.env` file:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

```bash
npm run dev
```

> Enable **Firestore** in your [Firebase Console](https://console.firebase.google.com/) before running.

---

## Project Structure

```
src/
├── firebase/        # config.js, firestore helpers
├── pages/           # Landing, GetStarted, CreateTeam, JoinTeam, TeamDashboard
├── components/      # TaskCard, TaskGrid, UI primitives
└── utils/           # generateCode.js
```

---

## Firestore Schema

```
teams/{teamCode}
 ├── name, leaderUid, createdAt
 ├── members/{uid}  →  name, role, joinedAt
 └── tasks/{taskId} →  title, assignedTo, progress, createdBy
```

---

## Deploy

```bash
npm run build
vercel   # or: firebase deploy
```

Add your `.env` variables in the hosting platform's dashboard.

---

## Stack

React · Vite · Tailwind CSS · React Router · Firebase (Auth + Firestore)

---

<div align="center">

Built with 💜 by **Nitin Punera** · [LinkedIn](#) · [Portfolio](#)

⭐ Star this repo if it helped you!

</div>
