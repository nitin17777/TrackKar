import React from 'react';

export default function PrimaryBtn({ children, onClick, className = "", disabled = false, type = "button", icon }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex items-center justify-center gap-2.5 font-bold rounded-2xl px-8 py-4 text-sm overflow-hidden text-white transition-all duration-300 ${className}`}
      style={{
        background: "linear-gradient(135deg,#6366f1 0%,#818cf8 100%)",
        boxShadow: "0 8px 28px rgba(99,102,241,.4)",
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(135deg,#818cf8,#a5b4fc)" }} />
      <span className="relative flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
}
