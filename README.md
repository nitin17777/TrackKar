<div align="center">

# TrackKar

### **Track Smarter. Build Faster.**

Real-time, zero-friction task tracker crafted specifically for hackathons, sprints, and fast-moving teams.  
*No lengthy signups. No complex onboarding. Instant team sync with a 6-letter code.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-trackkar.vercel.app-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://trackkar.vercel.app)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase%2012-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

---

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Database Architecture](#-database-architecture) • [Getting Started](#-getting-started) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 💡 Overview

Traditional project management tools are heavy, require every teammate to create an account, verify emails, and navigate complicated configuration menus wasting precious time during hackathons and tight deadlines.

**TrackKar** eliminates all friction:
1. **Create a project in 10 seconds** and set a deadline.
2. Get a shareable **6-character room code** or one-click invite link.
3. Teammates join instantly from desktop or mobile with zero account creation.
4. Collaborate in **real-time** across Kanban boards, priority badges, and live comment threads.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| ⚡ **Zero-Friction Access** | No passwords, email verification, or signups. Jump straight into building. |
| 📋 **Real-Time Kanban Board** | Live columns (`To Do`, `In Progress`, `Done`) synced instantly via Firestore listeners across all active members. |
| 🕐 **Live Deadline Countdown** | Always-visible countdown timer with intelligent urgent alerts when deadline is near. |
| 💬 **Threaded Task Comments** | Interactive sliding drawer for real-time discussion and updates on individual tasks. |
| 📊 **Live Analytics & Progress** | Visual stats cards (Total, In Progress, Done, Members) and reactive completion progress bar. |
| 🎯 **Priority & Assignee System** | Color-coded priorities (`High`, `Medium`, `Low`) and quick assignee tagging. |
| 🔗 **1-Click Team Invites** | Copy 6-character room codes or full shareable direct join links with one click. |
| 🎨 **Modern Glassmorphic UI** | Ambient glowing gradients, particle canvas effects, and responsive micro-interactions. |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Custom Glassmorphism UI tokens
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Real-Time Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore Realtime listeners & Anonymous Auth)
- **Deployment**: [Vercel](https://vercel.com/) / Firebase Hosting

---

## 📁 Project Structure

```text
TrackKar/
├── frontend/
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/             # Reusable UI primitives (GlassCard, Buttons, ToastContainer, etc.)
│   │   ├── hooks/              # Custom hooks (useCountdown, useToast)
│   │   ├── pages/              # Application views
│   │   │   ├── Landing.jsx     # Hero landing page with animated particles & features
│   │   │   ├── GetStarted.jsx  # Route choice (Create vs Join)
│   │   │   ├── CreateTeam.jsx   # Project initialization form & code generator
│   │   │   ├── JoinTeam.jsx    # Room code entry & URL parameter auto-join
│   │   │   ├── Dashboard.jsx   # Realtime Kanban dashboard, stats, timer & comments drawer
│   │   │   └── NotFound.jsx    # 404 handler
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx   # Client-side router configuration
│   │   ├── services/
│   │   │   └── firebase.js     # Firebase app initialization & helpers
│   │   ├── utils/              # Helper utilities (generateCode, etc.)
│   │   ├── App.jsx             # Root React component
│   │   ├── main.jsx            # React DOM entrypoint
│   │   └── index.css           # Global Tailwind and font styles
│   ├── .env.example            # Environment variable template
│   ├── package.json            # Project dependencies & scripts
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── vite.config.js          # Vite configuration
│   └── vercel.json             # SPA routing rewrite rules for Vercel
└── README.md                   # Repository documentation
```

---

## 🗄️ Database Architecture

TrackKar leverages a clean, high-performance Firestore hierarchical structure:

```
projects/{projectCode}                     [Document]
  ├── name: string                         (e.g., "AI Hackathon Project")
  ├── owner: string                        (e.g., "Nitin")
  ├── members: string[]                    (e.g., ["Nitin", "Aman", "Rohan"])
  ├── deadline: string (ISO datetime)      (e.g., "2026-10-15T18:00:00.000Z")
  ├── createdAt: string (ISO datetime)
  │
  └── tasks/{taskId}                       [Subcollection Document]
        ├── text: string                   (e.g., "Implement OpenAI API streaming")
        ├── assign: string                 (e.g., "Aman")
        ├── priority: "high"|"medium"|"low"
        ├── status: "todo"|"inprogress"|"done"
        ├── createdAt: string (ISO datetime)
        │
        └── comments/{commentId}           [Subcollection Document]
              ├── text: string             (e.g., "Added error handling wrapper!")
              ├── author: string           (e.g., "Nitin")
              └── createdAt: string (ISO datetime)
```

---

## 🚀 Getting Started

Follow these steps to set up TrackKar locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version `18.0.0` or later recommended)
- `npm` or `yarn` / `pnpm`
- A free [Firebase Project](https://console.firebase.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/nitin17777/TrackKar.git
cd TrackKar/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Head over to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In the project dashboard, add a new **Web App** (`</>`) and copy the Firebase configuration credentials.
3. Under **Build > Firestore Database**, click **Create database** (Start in *test mode* or use the rules below).
4. Under **Build > Authentication**, enable **Anonymous** sign-in (optional, supported by default).

### 4. Setup Environment Variables

Duplicate `.env.example` to create a `.env` file in the `frontend` folder:

```bash
cp .env.example .env
```

Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Start the Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:5173` to see TrackKar in action!

---

## 🔒 Firestore Security Rules

For testing and development, you can apply the following rules in your **Firebase Console > Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectCode} {
      allow read, write: if true;

      match /tasks/{taskId} {
        allow read, write: if true;

        match /comments/{commentId} {
          allow read, write: if true;
        }
      }
    }
  }
}
```

---

## 🚢 Deployment

### Deploying to Vercel (Recommended)

1. Push your code to GitHub.
2. Import your repository into [Vercel](https://vercel.com/).
3. Set the **Root Directory** to `frontend`.
4. Add all `VITE_FIREBASE_*` environment variables in the Vercel Project Settings.
5. Deploy! Vercel will automatically read `vercel.json` for client-side routing.

### Production Build

To test the production build locally:

```bash
npm run build
npm run preview
```

---

## 🗺️ Roadmap

- [x] Instant team creation & 6-letter room code generation
- [x] Real-time Kanban board with Firestore listeners
- [x] Deadline countdown timer with urgent mode
- [x] Real-time task commenting system
- [x] Responsive glassmorphic UI with animated feedback
- [ ] Task drag-and-drop reordering
- [ ] Role permissions (Leader delete privileges / Member restrictions)
- [ ] Dark mode toggle
- [ ] Export board summary to Markdown / PDF

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**.

---

<div align="center">

Crafted with 💜 by **[Nitin Punera](https://github.com/nitin17777)**

⭐ **Star this repository if you find it helpful!**

</div>
