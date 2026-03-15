import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";

const TABS = [
  { key: "liquid",  label: "Liquid Tanks",   icon: "🧪" },
  { key: "radial",  label: "Radial Charts",  icon: "🎯" },
  { key: "kanban",  label: "Kanban Board",   icon: "📋" },
  { key: "energy",  label: "Energy Bars",    icon: "⚡" },
];

const TASKS = [
  { title: "Setup project repository",    progress: 100 },
  { title: "Design system architecture",  progress: 85  },
  { title: "Implement authentication",    progress: 60  },
  { title: "Create responsive UI",        progress: 40  },
  { title: "Build REST API",              progress: 25  },
];

/* ── Radial Chart Card ───────────────────────────────────────────────────── */
function RadialCard({ title, progress }) {
  const [animated, setAnimated] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let c = 0;
    const step = () => {
      c += Math.max(1, (progress - c) * 0.06);
      if (c >= progress) { setAnimated(progress); return; }
      setAnimated(c);
      setTimeout(step, 16);
    };
    const t = setTimeout(step, 300);
    return () => clearTimeout(t);
  }, [progress]);

  const getColor = (p) => {
    if (p >= 80) return { from: "#10b981", to: "#34d399", glow: "rgba(16,185,129,.4)", light: "rgba(16,185,129,.1)", text: "#059669" };
    if (p >= 40) return { from: "#6366f1", to: "#818cf8", glow: "rgba(99,102,241,.4)", light: "rgba(99,102,241,.1)", text: "#6366f1" };
    return { from: "#f59e0b", to: "#fbbf24", glow: "rgba(245,158,11,.4)", light: "rgba(245,158,11,.1)", text: "#b45309" };
  };

  const c = getColor(progress);
  const r = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  const dash = (animated / 100) * circ;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-5 transition-all duration-300 overflow-hidden"
      style={{
        background: "rgba(255,255,255,.75)", backdropFilter: "blur(20px)",
        border: `1.5px solid ${hovered ? c.glow.replace(".4",".3") : "rgba(255,255,255,.9)"}`,
        boxShadow: hovered ? `0 20px 56px ${c.glow}, 0 4px 20px rgba(0,0,0,.06)` : "0 4px 20px rgba(0,0,0,.05)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <div className="absolute top-0 left-5 right-5 h-0.5 rounded-b-full transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg,transparent,${c.from},transparent)`, opacity: hovered ? 1 : 0 }} />
      <div className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
        style={{ background: `radial-gradient(ellipse at 50% 0%,${c.light},transparent 65%)`, opacity: hovered ? 1 : 0 }} />

      <p className="relative text-xs font-bold uppercase tracking-wider mb-1" style={{ color: c.text }}>Task Progress</p>
      <h3 className="relative font-extrabold text-gray-900 text-sm mb-4 leading-snug"
        style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}>{title}</h3>

      <div className="relative flex items-center justify-center mb-4">
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="10" />
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke={`url(#grad-${title.slice(0,4)})`} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray .05s linear", filter: `drop-shadow(0 0 8px ${c.from})` }}
          />
          <defs>
            <linearGradient id={`grad-${title.slice(0,4)}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c.from} />
              <stop offset="100%" stopColor={c.to} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black" style={{ color: c.text, fontFamily: "'Bricolage Grotesque',sans-serif" }}>
            {Math.round(animated)}%
          </span>
          <span className="text-xs text-gray-400">{100 - progress}% left</span>
        </div>
      </div>

      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,.07)" }}>
        <div className="h-full rounded-full" style={{ width: `${animated}%`, background: `linear-gradient(90deg,${c.from},${c.to})`, transition: "width .05s linear", boxShadow: `0 0 8px ${c.glow}` }} />
      </div>
    </div>
  );
}

/* ── Energy Bar Card ─────────────────────────────────────────────────────── */
function EnergyCard({ title, progress }) {
  const [animated, setAnimated] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let c = 0;
    const step = () => {
      c += Math.max(1, (progress - c) * 0.06);
      if (c >= progress) { setAnimated(progress); return; }
      setAnimated(c);
      setTimeout(step, 16);
    };
    const t = setTimeout(step, 300);
    return () => clearTimeout(t);
  }, [progress]);

  const getColor = (p) => {
    if (p >= 80) return { from: "#10b981", to: "#34d399", glow: "rgba(16,185,129,.4)", light: "rgba(16,185,129,.1)", text: "#059669" };
    if (p >= 40) return { from: "#6366f1", to: "#818cf8", glow: "rgba(99,102,241,.4)", light: "rgba(99,102,241,.1)", text: "#6366f1" };
    return { from: "#f59e0b", to: "#fbbf24", glow: "rgba(245,158,11,.4)", light: "rgba(245,158,11,.1)", text: "#b45309" };
  };

  const c = getColor(progress);
  const segments = 20;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-5 transition-all duration-300 overflow-hidden"
      style={{
        background: "rgba(255,255,255,.75)", backdropFilter: "blur(20px)",
        border: `1.5px solid ${hovered ? c.glow.replace(".4",".3") : "rgba(255,255,255,.9)"}`,
        boxShadow: hovered ? `0 20px 56px ${c.glow}, 0 4px 20px rgba(0,0,0,.06)` : "0 4px 20px rgba(0,0,0,.05)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <div className="absolute top-0 left-5 right-5 h-0.5 rounded-b-full transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg,transparent,${c.from},transparent)`, opacity: hovered ? 1 : 0 }} />
      <div className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
        style={{ background: `radial-gradient(ellipse at 50% 0%,${c.light},transparent 65%)`, opacity: hovered ? 1 : 0 }} />

      <div className="relative flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: c.text }}>Energy Level</p>
          <h3 className="font-extrabold text-gray-900 text-sm leading-snug"
            style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}>{title}</h3>
        </div>
        <span className="text-2xl font-black flex-shrink-0" style={{ color: c.text, fontFamily: "'Bricolage Grotesque',sans-serif" }}>
          {Math.round(animated)}%
        </span>
      </div>

      {/* Segmented energy bar */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: segments }).map((_, i) => {
          const threshold = ((i + 1) / segments) * 100;
          const active = animated >= threshold;
          const partial = !active && animated > (i / segments) * 100;
          return (
            <div key={i} className="flex-1 h-8 rounded-md overflow-hidden transition-all duration-100 relative"
              style={{
                background: active
                  ? `linear-gradient(180deg,${c.to},${c.from})`
                  : "rgba(0,0,0,.06)",
                boxShadow: active ? `0 0 8px ${c.glow}` : "none",
                transitionDelay: `${i * 20}ms`,
              }}>
              {active && <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(255,255,255,.2),transparent)" }} />}
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs" style={{ color: "rgba(0,0,0,.3)" }}>
        {["0%", "25%", "50%", "75%", "100%"].map(l => <span key={l} className="font-semibold">{l}</span>)}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,.05)" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.from, boxShadow: `0 0 6px ${c.from}` }} />
          <span className="text-xs font-semibold text-gray-400">
            {progress >= 80 ? "Full power!" : progress >= 40 ? "Good energy" : "Building up"}
          </span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: c.light, color: c.text }}>
          {100 - progress}% left
        </span>
      </div>
    </div>
  );
}

/* ── Kanban Mini Card ────────────────────────────────────────────────────── */
function KanbanMini({ tasks }) {
  const cols = {
    done:       tasks.filter(t => t.progress === 100),
    inprogress: tasks.filter(t => t.progress >= 40 && t.progress < 100),
    todo:       tasks.filter(t => t.progress < 40),
  };
  const meta = {
    done:       { label: "Done",        color: "#10b981", bg: "rgba(16,185,129,.08)",  border: "rgba(16,185,129,.2)"  },
    inprogress: { label: "In Progress", color: "#6366f1", bg: "rgba(99,102,241,.08)",  border: "rgba(99,102,241,.2)"  },
    todo:       { label: "To Do",       color: "#f59e0b", bg: "rgba(245,158,11,.08)",  border: "rgba(245,158,11,.2)"  },
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(cols).map(([key, items]) => {
        const m = meta[key];
        return (
          <div key={key}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}88` }} />
              <span className="text-xs font-bold text-gray-600">{m.label}</span>
              <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                style={{ background: m.color }}>{items.length}</span>
            </div>
            <div className="min-h-[180px] rounded-2xl p-3 space-y-2"
              style={{ background: m.bg, border: `1.5px dashed ${m.border}` }}>
              {items.length === 0 ? (
                <p className="text-center text-xs py-8 font-medium" style={{ color: m.color, opacity: .4 }}>Empty</p>
              ) : items.map(t => (
                <div key={t.title} className="rounded-xl p-3 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,.8)", border: "1px solid rgba(255,255,255,.9)", boxShadow: "0 2px 8px rgba(0,0,0,.04)", backdropFilter: "blur(12px)" }}>
                  <p className="text-xs font-semibold text-gray-800 leading-snug mb-2">{t.title}</p>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,.07)" }}>
                    <div className="h-full rounded-full" style={{ width: `${t.progress}%`, background: `linear-gradient(90deg,${m.color},${m.color}bb)`, boxShadow: `0 0 6px ${m.color}88` }} />
                  </div>
                  <p className="text-right text-xs font-bold mt-1" style={{ color: m.color }}>{t.progress}%</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main TaskGrid ────────────────────────────────────────────────────────── */
export default function TaskGrid() {
  const [activeTab, setActiveTab] = useState("liquid");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes tabSlide{ from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      .tg-fu  { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
      .tg-tab { animation: tabSlide .35s cubic-bezier(.22,1,.36,1) both; }
      .tg-shimmer {
        background: linear-gradient(90deg,#6366f1 0%,#10b981 30%,#6366f1 60%,#10b981 90%,#6366f1 100%);
        background-size: 200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        background-clip:text; animation: shimmer 4s linear infinite;
      }
    `;
    document.head.appendChild(style);
    setTimeout(() => setReady(true), 40);
  }, []);

  const overallAvg = Math.round(TASKS.reduce((s, t) => s + t.progress, 0) / TASKS.length);
  const done = TASKS.filter(t => t.progress === 100).length;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>

      {/* ── Header ── */}
      <div className={`tg-fu flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 ${ready ? "" : "opacity-0"}`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#6366f1" }}>Project Overview</p>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque',sans-serif", letterSpacing: "-.03em" }}>
            Task <span className="tg-shimmer">Progress</span>
          </h2>
        </div>

        {/* Overall stat pills */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: "Overall", value: `${overallAvg}%`, color: "#6366f1", bg: "rgba(99,102,241,.08)", border: "rgba(99,102,241,.2)" },
            { label: "Completed", value: `${done}/${TASKS.length}`, color: "#10b981", bg: "rgba(16,185,129,.08)", border: "rgba(16,185,129,.2)" },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <span className="text-xs font-semibold text-gray-400">{s.label}</span>
              <span className="text-sm font-extrabold" style={{ color: s.color, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className={`tg-fu mb-6 ${ready ? "" : "opacity-0"}`} style={{ animationDelay: ".08s" }}>
        <div className="inline-flex p-1.5 rounded-2xl gap-1"
          style={{ background: "rgba(255,255,255,.75)", backdropFilter: "blur(16px)", border: "1.5px solid rgba(255,255,255,.9)", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: active ? "linear-gradient(135deg,#6366f1,#818cf8)" : "transparent",
                  color: active ? "white" : "#6b7280",
                  boxShadow: active ? "0 4px 16px rgba(99,102,241,.4)" : "none",
                  transform: active ? "scale(1.02)" : "scale(1)",
                }}
              >
                <span style={{ filter: active ? "none" : "grayscale(1)", fontSize: 15 }}>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grid content ── */}
      <div key={activeTab} className="tg-tab">
        {activeTab === "liquid" && (
          <div className="grid md:grid-cols-3 gap-5">
            {TASKS.map((t, i) => (
              <div key={t.title} style={{ animationDelay: `${i * .07}s` }} className="tg-fu">
                <TaskCard title={t.title} progress={t.progress} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "radial" && (
          <div className="grid md:grid-cols-3 gap-5">
            {TASKS.map((t, i) => (
              <div key={t.title} style={{ animationDelay: `${i * .07}s` }} className="tg-fu">
                <RadialCard title={t.title} progress={t.progress} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "energy" && (
          <div className="grid md:grid-cols-3 gap-5">
            {TASKS.map((t, i) => (
              <div key={t.title} style={{ animationDelay: `${i * .07}s` }} className="tg-fu">
                <EnergyCard title={t.title} progress={t.progress} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "kanban" && (
          <div className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,.72)", backdropFilter: "blur(20px)", border: "1.5px solid rgba(255,255,255,.9)", boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
            <KanbanMini tasks={TASKS} />
          </div>
        )}
      </div>

      {/* ── Progress overview strip ── */}
      <div className={`tg-fu mt-6 rounded-2xl p-5 ${ready ? "" : "opacity-0"}`}
        style={{ animationDelay: ".25s", background: "rgba(255,255,255,.72)", backdropFilter: "blur(20px)", border: "1.5px solid rgba(255,255,255,.9)", boxShadow: "0 4px 20px rgba(0,0,0,.05)" }}>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">All Tasks at a Glance</p>
        <div className="space-y-3">
          {TASKS.map((t) => {
            const getC = (p) => p >= 80 ? ["#10b981","#34d399","rgba(16,185,129,.4)"] : p >= 40 ? ["#6366f1","#818cf8","rgba(99,102,241,.35)"] : ["#f59e0b","#fbbf24","rgba(245,158,11,.35)"];
            const [from, to, glow] = getC(t.progress);
            return (
              <div key={t.title} className="flex items-center gap-3">
                <p className="text-xs font-semibold text-gray-600 w-44 truncate flex-shrink-0">{t.title}</p>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,.07)" }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${t.progress}%`, background: `linear-gradient(90deg,${from},${to})`, boxShadow: `0 0 8px ${glow}` }} />
                </div>
                <span className="text-xs font-extrabold w-9 text-right flex-shrink-0"
                  style={{ color: from, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t.progress}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}