import React from 'react';

export default function GlassCard({ children, className = "", style = {} }) {
  return (
    <div
      className={`relative rounded-3xl p-8 overflow-hidden transition-all duration-300 ${className}`}
      style={{
        background: "rgba(255,255,255,.72)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1.5px solid rgba(255,255,255,.9)",
        boxShadow: "0 24px 64px rgba(99,102,241,.1), 0 4px 24px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.9)",
        ...style
      }}
    >
      <div className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{ background: "radial-gradient(ellipse at 100% 0%,rgba(99,102,241,.08),transparent 55%)" }} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
