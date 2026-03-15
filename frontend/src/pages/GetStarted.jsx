import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp     { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
      @keyframes floatY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes shimmer    { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:.4} }
      @keyframes orbitDot   { from{transform:rotate(0deg) translateX(54px) rotate(0deg)} to{transform:rotate(360deg) translateX(54px) rotate(-360deg)} }
      @keyframes orbitDot2  { from{transform:rotate(180deg) translateX(54px) rotate(-180deg)} to{transform:rotate(540deg) translateX(54px) rotate(-540deg)} }

      .gs-fu    { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) both; }
      .gs-fly   { animation: floatY 5s ease-in-out infinite; }
      .gs-rot   { animation: rotateSlow 22s linear infinite; }
      .gs-blink { animation: blink 2s ease-in-out infinite; }

      .gs-shimmer {
        background: linear-gradient(90deg,#6366f1 0%,#10b981 30%,#6366f1 60%,#10b981 90%,#6366f1 100%);
        background-size: 200% auto;
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }

      .gs-card-purple:hover { box-shadow: 0 0 48px rgba(99,102,241,.28), 0 20px 60px rgba(99,102,241,.14) !important; transform: translateY(-5px) !important; }
      .gs-card-green:hover  { box-shadow: 0 0 48px rgba(16,185,129,.24), 0 20px 60px rgba(16,185,129,.12) !important; transform: translateY(-5px) !important; }

      .orbit-dot  { position:absolute; width:8px; height:8px; border-radius:50%; top:50%; left:50%; margin:-4px; animation: orbitDot  8s linear infinite; }
      .orbit-dot2 { position:absolute; width:6px; height:6px; border-radius:50%; top:50%; left:50%; margin:-3px; animation: orbitDot2 8s linear infinite; }
    `;
    document.head.appendChild(style);
    setTimeout(() => setReady(true), 40);
  }, []);

  const options = [
    {
      key: "create",
      icon: "👥",
      label: "Create New Team",
      sub: "Start a project, get a shareable team code",
      path: "/create",
      accent: "#6366f1",
      accentLight: "rgba(99,102,241,.1)",
      accentBorder: "rgba(99,102,241,.25)",
      gradient: "linear-gradient(135deg,#6366f1 0%,#818cf8 100%)",
      glow: "rgba(99,102,241,.4)",
      hoverClass: "gs-card-purple",
      steps: ["Name your project", "Set deadline", "Get team code"],
    },
    {
      key: "join",
      icon: "🔑",
      label: "Join Existing Team",
      sub: "Enter the code shared by your team lead",
      path: "/join",
      accent: "#10b981",
      accentLight: "rgba(16,185,129,.08)",
      accentBorder: "rgba(16,185,129,.25)",
      gradient: "linear-gradient(135deg,#10b981 0%,#34d399 100%)",
      glow: "rgba(16,185,129,.35)",
      hoverClass: "gs-card-green",
      steps: ["Enter 6-letter code", "Set your name", "Start collaborating"],
    },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg,#f0effe 0%,#f5fff9 50%,#eef6ff 100%)",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {/* ── Blobs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,.22),transparent)" }} />
        <div className="absolute top-10 -right-32 w-[420px] h-[420px] rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle,rgba(16,185,129,.18),transparent)" }} />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[260px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,.12),transparent)", transform: "translateX(-50%)" }} />
      </div>

      {/* ── Rings ── */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="gs-rot absolute w-[700px] h-[700px] rounded-full"
          style={{ border: "1px solid rgba(99,102,241,.07)" }} />
        <div className="gs-rot absolute w-[480px] h-[480px] rounded-full"
          style={{ border: "1px solid rgba(16,185,129,.07)", animationDirection: "reverse", animationDuration: "30s" }} />
      </div>

      {/* ── Back button ── */}
      <button
        onClick={() => navigate("/")}
        className={`gs-fu absolute top-8 left-8 flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:text-indigo-700 transition-colors z-10 ${ready ? "" : "opacity-0"}`}
        style={{ animationDelay: ".02s" }}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Home
      </button>

      <div className={`relative z-10 w-full max-w-lg ${ready ? "" : "opacity-0"}`}>

        {/* ── Hero icon ── */}
        <div className={`gs-fu flex justify-center mb-6`} style={{ animationDelay: ".05s" }}>
          <div className="relative">
            {/* Orbit dots */}
            <div className="orbit-dot" style={{ background: "#6366f1", boxShadow: "0 0 8px #6366f1" }} />
            <div className="orbit-dot2" style={{ background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
            <div className="gs-fly w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)", boxShadow: "0 8px 28px rgba(99,102,241,.45)" }}>
              🚀
            </div>
          </div>
        </div>

        {/* ── Heading ── */}
        <div className={`gs-fu text-center mb-8`} style={{ animationDelay: ".1s" }}>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque',sans-serif", letterSpacing: "-.03em" }}>
            Let's Get <span className="gs-shimmer">Started!</span>
          </h1>
          <p className="text-gray-400 text-sm">Choose how you'd like to proceed</p>
        </div>

        {/* ── Option cards ── */}
        <div className="flex flex-col gap-4 mb-8">
          {options.map((opt, i) => (
            <button
              key={opt.key}
              onClick={() => navigate(opt.path)}
              onMouseEnter={() => setHovered(opt.key)}
              onMouseLeave={() => setHovered(null)}
              className={`gs-fu w-full text-left rounded-2xl p-6 transition-all duration-300 overflow-hidden relative ${opt.hoverClass}`}
              style={{
                animationDelay: `${.18 + i * .1}s`,
                background: "rgba(255,255,255,.72)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: `1.5px solid ${hovered === opt.key ? opt.accentBorder : "rgba(255,255,255,.9)"}`,
                boxShadow: "0 4px 24px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.9)",
              }}
            >
              {/* Inner radial glow on hover */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
                style={{
                  background: `radial-gradient(ellipse at 0% 0%, ${opt.accentLight.replace(",.1",",.18").replace(",.08",",.14")}, transparent 65%)`,
                  opacity: hovered === opt.key ? 1 : 0,
                }} />

              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full transition-all duration-300"
                style={{
                  background: `linear-gradient(90deg,transparent,${opt.accent},transparent)`,
                  opacity: hovered === opt.key ? 1 : 0,
                }} />

              <div className="relative flex items-center gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-300"
                  style={{
                    background: hovered === opt.key ? opt.gradient : opt.accentLight,
                    border: `1.5px solid ${opt.accentBorder}`,
                    boxShadow: hovered === opt.key ? `0 8px 24px ${opt.glow}` : "none",
                    transform: hovered === opt.key ? "scale(1.08) rotate(-3deg)" : "scale(1) rotate(0deg)",
                  }}>
                  {opt.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-gray-900 text-base leading-tight mb-1"
                    style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">{opt.sub}</p>

                  {/* Steps */}
                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                    {opt.steps.map((s, si) => (
                      <span key={s} className="flex items-center gap-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: opt.accentLight, color: opt.accent, border: `1px solid ${opt.accentBorder}` }}>
                          {si + 1}. {s}
                        </span>
                        {si < opt.steps.length - 1 && (
                          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke={opt.accent} strokeWidth="2.5" opacity="0.4">
                            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: hovered === opt.key ? opt.gradient : opt.accentLight,
                    boxShadow: hovered === opt.key ? `0 4px 14px ${opt.glow}` : "none",
                    transform: hovered === opt.key ? "translateX(2px)" : "translateX(0)",
                  }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
                    stroke={hovered === opt.key ? "white" : opt.accent} strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className={`gs-fu flex items-center gap-3 mb-6`} style={{ animationDelay: ".38s" }}>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,.15))" }} />
          <span className="text-xs font-semibold text-gray-400">or</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(99,102,241,.15),transparent)" }} />
        </div>

        {/* ── Trust note ── */}
        <p className={`gs-fu text-center text-xs text-gray-400 flex items-center justify-center gap-1.5`} style={{ animationDelay: ".42s" }}>
          <span className="gs-blink w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          No signup needed · Free forever · Works offline
        </p>

        {/* ── Bottom pills ── */}
        <div className={`gs-fu flex justify-center gap-3 mt-6`} style={{ animationDelay: ".48s" }}>
          {[
            { icon: "⚡", text: "30s setup",  color: "#6366f1" },
            { icon: "🔒", text: "No account", color: "#10b981" },
            { icon: "🎯", text: "Team-ready", color: "#3b82f6" },
          ].map((p) => (
            <div key={p.text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md"
              style={{ background: `${p.color}10`, border: `1px solid ${p.color}28`, color: p.color }}>
              {p.icon} {p.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}