import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import PrimaryBtn from "../components/ui/PrimaryBtn";
import OutlineBtn from "../components/ui/OutlineBtn";

/* ── Particle canvas ─────────────────────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.4 + 0.1,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.a})`;
        ctx.fill();
      });
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(99,102,241,${0.1 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        })
      );
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ── Floating badge ──────────────────────────────────────────────────────── */
function FloatBadge({ icon, text, color, delay }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-default"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}30`,
        color: color,
        animationDelay: delay,
        boxShadow: `0 4px 20px ${color}15`,
      }}
    >
      <span style={{ filter: `drop-shadow(0 0 5px ${color})` }}>{icon}</span>
      {text}
    </div>
  );
}

/* ── Animated counter ────────────────────────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = () => {
      v += Math.ceil(to / 35);
      if (v >= to) { setVal(to); return; }
      setVal(v);
      setTimeout(step, 28);
    };
    const t = setTimeout(step, 600);
    return () => clearTimeout(t);
  }, [to]);
  return <>{val}{suffix}</>;
}

/* ── Feature card ────────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, accent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-5 transition-all duration-300 cursor-default"
      style={{
        background: hovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)",
        border: `1px solid ${hovered ? accent + "55" : "rgba(255,255,255,0.7)"}`,
        boxShadow: hovered ? `0 16px 48px ${accent}18, 0 2px 12px rgba(0,0,0,0.06)` : "0 2px 12px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        backdropFilter: "blur(16px)",
      }}
    >
      {hovered && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle at 20% 20%, ${accent}10, transparent 60%)` }} />
      )}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 transition-transform duration-300"
        style={{
          background: `${accent}15`,
          border: `1px solid ${accent}25`,
          transform: hovered ? "scale(1.1)" : "scale(1)",
          boxShadow: hovered ? `0 0 16px ${accent}30` : "none",
        }}>
        {icon}
      </div>
      <p className="font-bold text-gray-800 text-sm mb-1">{title}</p>
      <p className="text-xs leading-relaxed text-gray-400">{desc}</p>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /* Inject fonts */
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)}  to{opacity:1;transform:translateY(0)} }
      @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
      @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes rotateSlow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:.4} }

      .fu  { animation: fadeUp  .65s cubic-bezier(.22,1,.36,1) both; }
      .fi  { animation: fadeIn  .5s  ease both; }
      .fly { animation: floatY  5s   ease-in-out infinite; }
      .rot { animation: rotateSlow 22s linear infinite; }

      .shimmer-text {
        background: linear-gradient(90deg, #6366f1 0%, #10b981 30%, #6366f1 60%, #10b981 90%, #6366f1 100%);
        background-size: 200% auto;
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }

      .glow-purple { box-shadow: 0 8px 28px rgba(99,102,241,.4); }
      .glow-purple:hover { box-shadow: 0 0 40px rgba(99,102,241,.55), 0 10px 36px rgba(99,102,241,.35) !important; transform: translateY(-2px) !important; }
      .glow-green  { box-shadow: 0 4px 20px rgba(16,185,129,.25); }
      .glow-green:hover  { box-shadow: 0 0 32px rgba(16,185,129,.45), 0 8px 28px rgba(16,185,129,.28) !important; transform: translateY(-2px) !important; }

      .live-dot { animation: blink 2s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
    document.title = 'TrackKar — Track Smarter, Build Faster';
    setTimeout(() => setReady(true), 40);
  }, []);

  const features = [
    { icon: "⚡", title: "Setup in 30 sec",  desc: "Zero config. Name it, share the code, ship.",   accent: "#f59e0b" },
    { icon: "🎯", title: "Kanban Board",      desc: "To Do → In Progress → Done. Clean & fast.",    accent: "#6366f1" },
    { icon: "🔗", title: "Instant Invite",    desc: "6-letter code. No accounts. No friction.",     accent: "#10b981" },
    { icon: "🕐", title: "Live Countdown",    desc: "Deadline clock always visible. Stay sharp.",   accent: "#3b82f6" },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#f0effe 0%,#f5fff9 50%,#eef6ff 100%)", fontFamily: "'DM Sans',sans-serif" }}
    >
      <ParticleCanvas />

      {/* ── decorative rings ── */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="rot absolute w-[820px] h-[820px] rounded-full" style={{ border: "1px solid rgba(99,102,241,.07)" }} />
        <div className="rot absolute w-[560px] h-[560px] rounded-full" style={{ border: "1px solid rgba(16,185,129,.07)", animationDirection: "reverse", animationDuration: "30s" }} />
      </div>

      {/* ── blobs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]"  style={{ background: "radial-gradient(circle,rgba(99,102,241,.22),transparent)" }} />
        <div className="absolute top-10  -right-32 w-[420px] h-[420px] rounded-full blur-[90px]"  style={{ background: "radial-gradient(circle,rgba(16,185,129,.18),transparent)" }} />
        <div className="absolute bottom-0 left-1/2  w-[600px] h-[260px] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle,rgba(99,102,241,.12),transparent)", transform: "translateX(-50%)" }} />
      </div>

      {/* ── NAV ── */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 pt-7 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center fly"
            style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)", boxShadow: "0 0 18px rgba(99,102,241,.45)" }}>
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
            </svg>
          </div>
          <span className="text-lg font-extrabold text-indigo-600" style={{ fontFamily: "'Bricolage Grotesque',sans-serif", letterSpacing: "-.02em" }}>
            TrackKar
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(16,185,129,.1)", color: "#059669", border: "1px solid rgba(16,185,129,.25)" }}>
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Live
          </span>
          <button onClick={() => navigate("/start")}
            className="hidden sm:block text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all duration-200 glow-purple"
            style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>
            Launch →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main className="relative z-10 flex flex-col items-center text-center px-5 pt-14 pb-8 max-w-5xl mx-auto">

        {/* eyebrow */}
        <div className={`fu flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 ${ready ? "" : "opacity-0"}`}
          style={{ animationDelay: ".05s", background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.25)", color: "#6366f1" }}>
          <span className="live-dot w-2 h-2 rounded-full bg-indigo-500 inline-block" />
          Built for hackathons &amp; deadline warriors
        </div>

        {/* headline */}
        <h1 className={`fu font-extrabold leading-[1.05] mb-5 text-gray-900 ${ready ? "" : "opacity-0"}`}
          style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(2.8rem,7.5vw,5.5rem)", letterSpacing: "-.04em", animationDelay: ".12s" }}>
          Track smarter.<br />
          <span className="shimmer-text">Build faster.</span>
        </h1>

        {/* sub */}
        <p className={`fu text-lg leading-relaxed max-w-lg mb-10 text-gray-500 ${ready ? "" : "opacity-0"}`}
          style={{ animationDelay: ".22s" }}>
          The stress-free task tracker built for hackathons and deadline-driven teams.{" "}
          <strong className="text-gray-700 font-semibold">No signups. No complexity.</strong> Just execution.
        </p>

        {/* CTA row */}
        <div className={`fu flex flex-col sm:flex-row gap-4 mb-12 ${ready ? "" : "opacity-0"}`} style={{ animationDelay: ".32s" }}>
          <button
            onClick={() => navigate("/start")}
            className="group relative flex items-center justify-center gap-2.5 font-bold rounded-2xl px-8 py-4 text-sm overflow-hidden text-white transition-all duration-300 glow-purple"
            style={{ background: "linear-gradient(135deg,#6366f1 0%,#818cf8 100%)" }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg,#818cf8,#a5b4fc)" }} />
            <span className="relative flex items-center gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Start New Project
            </span>
            <span className="relative text-indigo-200 text-xs font-normal">→ get team code</span>
          </button>

          <button
            onClick={() => navigate("/join")}
            className="group flex items-center justify-center gap-2.5 font-bold rounded-2xl px-8 py-4 text-sm transition-all duration-300 glow-green"
            style={{ background: "rgba(16,185,129,.07)", color: "#059669", border: "1.5px solid rgba(16,185,129,.3)" }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Join Existing Team
            <span className="text-emerald-400 text-xs font-normal opacity-70">→ enter code</span>
          </button>
        </div>

        {/* badges row */}
        <div className={`fu flex flex-wrap justify-center gap-3 mb-16 ${ready ? "" : "opacity-0"}`} style={{ animationDelay: ".42s" }}>
          <FloatBadge icon="⚡" text="Setup in 30 seconds"      color="#6366f1" delay=".1s" />
          <FloatBadge icon="🤝" text="Real-time collaboration"  color="#10b981" delay=".2s" />
          <FloatBadge icon="🎯" text="Built for small teams"    color="#3b82f6" delay=".3s" />
        </div>

        {/* stats */}
        <div className={`fu grid grid-cols-3 gap-4 w-full max-w-md mb-20 ${ready ? "" : "opacity-0"}`} style={{ animationDelay: ".5s" }}>
          {[
            { to: 30, suffix: "s",  label: "to launch",  color: "#818cf8" },
            { to: 100, suffix: "%", label: "no signups", color: "#34d399" },
            { to: 24, suffix: "h",  label: "hackathon ✓",color: "#60a5fa" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 text-center backdrop-blur-md"
              style={{ background: "rgba(255,255,255,.55)", border: "1px solid rgba(255,255,255,.8)", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
              <div className="text-2xl font-black" style={{ color: s.color, fontFamily: "'Bricolage Grotesque',sans-serif", textShadow: `0 0 16px ${s.color}55` }}>
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <div className="text-xs mt-0.5 text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* ── FEATURE CARDS ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 pb-24">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-indigo-400 mb-2">Everything you need</p>
          <h2 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "'Bricolage Grotesque',sans-serif", letterSpacing: "-.03em" }}>
            Ruthlessly <span className="shimmer-text">focused</span>
          </h2>
          <p className="text-sm text-gray-400 mt-2">No bloat — just the tools that matter under pressure.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 pb-24">
        <div className="relative rounded-3xl p-10 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg,rgba(99,102,241,.12) 0%,rgba(16,185,129,.08) 100%)", border: "1px solid rgba(99,102,241,.18)", boxShadow: "0 20px 60px rgba(99,102,241,.1)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(99,102,241,.15),transparent 65%)" }} />
          <div className="fly text-4xl mb-4">🚀</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}>
            Ready to ship something <span className="shimmer-text">great?</span>
          </h2>
          <p className="text-gray-500 text-sm mb-7">No friction. No excuses. Your next win starts in 30 seconds.</p>
          <button onClick={() => navigate("/start")}
            className="inline-flex items-center gap-2 font-bold rounded-2xl px-9 py-3.5 text-sm text-white transition-all duration-300 glow-purple"
            style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>
            Start for free — it's instant ⚡
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 text-center pb-8 text-xs text-gray-400">
        Built with 💜 for builders who ship — TrackKar © 2026
      </footer>
    </div>
  );
}