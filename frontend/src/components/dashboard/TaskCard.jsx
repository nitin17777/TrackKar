import { useEffect, useRef, useState } from "react";

export default function TaskCard({ title, progress }) {
  const [animated, setAnimated] = useState(0);
  const [waveOffset, setWaveOffset] = useState(0);
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef(null);
  const countRef = useRef(null);

  /* ── Animate liquid fill on mount ── */
  useEffect(() => {
    let current = 0;
    const step = () => {
      current += Math.max(1, (progress - current) * 0.06);
      if (current >= progress) { setAnimated(progress); return; }
      setAnimated(current);
      countRef.current = setTimeout(step, 16);
    };
    const t = setTimeout(step, 300);
    return () => { clearTimeout(t); clearTimeout(countRef.current); };
  }, [progress]);

  /* ── Animate wave ── */
  useEffect(() => {
    const tick = () => {
      setWaveOffset(p => (p + 1.2) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const getColor = (p) => {
    if (p >= 80) return { from: "#10b981", to: "#34d399", glow: "rgba(16,185,129,.4)", text: "#059669", light: "rgba(16,185,129,.1)" };
    if (p >= 40) return { from: "#6366f1", to: "#818cf8", glow: "rgba(99,102,241,.4)", text: "#6366f1", light: "rgba(99,102,241,.1)" };
    return { from: "#f59e0b", to: "#fbbf24", glow: "rgba(245,158,11,.4)", text: "#b45309", light: "rgba(245,158,11,.1)" };
  };

  const getLabel = (p) => {
    if (p >= 80) return { text: "On Track 🚀", color: "#059669", bg: "rgba(16,185,129,.1)", border: "rgba(16,185,129,.2)" };
    if (p >= 40) return { text: "In Progress ⚡", color: "#6366f1", bg: "rgba(99,102,241,.1)", border: "rgba(99,102,241,.2)" };
    return { text: "Just Started 🌱", color: "#b45309", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.2)" };
  };

  const c = getColor(progress);
  const lbl = getLabel(progress);

  /* SVG wave path */
  const wave = (offset, amp = 5, freq = 0.04) => {
    const pts = [];
    for (let x = 0; x <= 200; x += 4) {
      const y = amp * Math.sin((x + offset) * freq * Math.PI);
      pts.push(`${x},${y}`);
    }
    return `M0,${amp} L${pts.join(" L")} L200,${amp} L200,60 L0,60 Z`;
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-5 transition-all duration-350 overflow-hidden"
      style={{
        background: "rgba(255,255,255,.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1.5px solid ${hovered ? c.glow.replace(".4", ".35") : "rgba(255,255,255,.9)"}`,
        boxShadow: hovered
          ? `0 20px 56px ${c.glow}, 0 4px 20px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.9)`
          : "0 4px 20px rgba(0,0,0,.05), inset 0 1px 0 rgba(255,255,255,.9)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-5 right-5 h-0.5 rounded-b-full transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg,transparent,${c.from},transparent)`, opacity: hovered ? 1 : 0 }} />

      {/* Inner glow */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
        style={{ background: `radial-gradient(ellipse at 50% 0%,${c.light},transparent 65%)`, opacity: hovered ? 1 : 0 }} />

      {/* ── Header ── */}
      <div className="relative flex items-start justify-between gap-3 mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: c.text }}>Task Progress</p>
          <h3 className="font-extrabold text-gray-900 text-base leading-snug"
            style={{ fontFamily: "'Bricolage Grotesque',sans-serif", letterSpacing: "-.02em" }}>
            {title}
          </h3>
        </div>
        <span className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: lbl.bg, color: lbl.color, border: `1px solid ${lbl.border}` }}>
          {lbl.text}
        </span>
      </div>

      {/* ── Liquid Tank ── */}
      <div className="relative mb-5 rounded-2xl overflow-hidden"
        style={{
          height: 140,
          background: "rgba(0,0,0,.03)",
          border: `1.5px solid ${c.from}22`,
          boxShadow: `inset 0 2px 12px rgba(0,0,0,.06)`,
        }}
      >
        {/* Tick marks */}
        {[25, 50, 75].map(t => (
          <div key={t} className="absolute left-0 right-0 flex items-center"
            style={{ bottom: `${t}%`, zIndex: 2 }}>
            <div className="w-full h-px" style={{ background: "rgba(0,0,0,.06)" }} />
            <span className="absolute right-2 text-[9px] font-bold" style={{ color: "rgba(0,0,0,.22)" }}>{t}%</span>
          </div>
        ))}

        {/* Liquid fill */}
        <div className="absolute bottom-0 left-0 right-0 transition-none"
          style={{ height: `${animated}%`, background: `linear-gradient(180deg,${c.to}cc,${c.from})` }}>

          {/* Wave SVG on top of fill */}
          <div className="absolute -top-[14px] left-0 right-0 overflow-hidden" style={{ height: 20 }}>
            <svg viewBox="0 0 200 20" preserveAspectRatio="none"
              style={{ width: "100%", height: "100%", display: "block" }}>
              {/* Back wave */}
              <path d={wave(waveOffset * 0.7, 4, 0.05)}
                fill={`${c.to}88`} />
              {/* Front wave */}
              <path d={wave(waveOffset, 5, 0.04)}
                fill={c.to} />
            </svg>
          </div>

          {/* Bubble particles */}
          {[15, 40, 65, 85].map((x, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                width: i % 2 === 0 ? 5 : 3,
                height: i % 2 === 0 ? 5 : 3,
                left: `${x}%`,
                bottom: `${10 + (i * 18) % 60}%`,
                background: "rgba(255,255,255,.35)",
                animation: `floatBubble ${2.5 + i * 0.6}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}

          {/* Shine */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(90deg,rgba(255,255,255,.18) 0%,transparent 50%,rgba(255,255,255,.06) 100%)" }} />
        </div>

        {/* Percentage badge in center */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="px-4 py-2 rounded-xl font-black text-2xl"
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              color: animated > 55 ? "rgba(255,255,255,.95)" : c.text,
              textShadow: animated > 55 ? `0 2px 12px ${c.from}88` : "none",
              letterSpacing: "-.03em",
            }}>
            {Math.round(animated)}%
          </div>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="relative mb-3">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-gray-500">Progress</span>
          <span style={{ color: c.text }}>{progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(0,0,0,.07)" }}>
          <div className="h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
            style={{
              width: `${animated}%`,
              background: `linear-gradient(90deg,${c.from},${c.to})`,
              boxShadow: `0 0 10px ${c.glow}`,
            }}>
            {/* Shimmer sweep */}
            <div className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,.4) 50%,transparent 100%)",
                animation: "shimmerBar 2s ease-in-out infinite",
              }} />
          </div>
        </div>
      </div>

      {/* ── Footer stats ── */}
      <div className="relative flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid rgba(0,0,0,.05)" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full"
            style={{ background: c.from, boxShadow: `0 0 6px ${c.from}` }} />
          <span className="text-xs font-semibold text-gray-400">
            {progress >= 80 ? "Almost there!" : progress >= 40 ? "Keep going!" : "Just getting started"}
          </span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: c.light, color: c.text }}>
          {100 - progress}% left
        </span>
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes floatBubble { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.2)} }
        @keyframes shimmerBar  { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
      `}</style>
    </div>
  );
}