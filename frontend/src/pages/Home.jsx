export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">

      {/* Decorative Glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 blur-[140px] rounded-full top-20 left-20"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[140px] rounded-full bottom-20 right-20"></div>

      {/* Main Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl px-12 py-16 text-center max-w-2xl w-full">

        {/* Logo / Title */}
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          TrackKar 🚀
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-slate-300 text-lg">
          Track smarter. Build faster.
        </p>

        {/* Description */}
        <p className="mt-2 text-slate-400 text-sm">
          Lightweight task management for teams, hackathons, and projects.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">

          {/* Start Project */}
          <button className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/40 hover:scale-105 hover:shadow-indigo-500/60 transition-all duration-300">
            👥 Start New Project
          </button>

          {/* Join Team */}
          <button className="px-8 py-4 rounded-xl font-semibold text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 hover:scale-105 transition-all duration-300">
            🔑 Join Existing Team
          </button>

        </div>

      </div>
    </div>
  )
}