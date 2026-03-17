import React from 'react';

export default function OutlineBtn({ children, onClick, className = "", disabled = false, type = "button", icon }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group flex items-center justify-center gap-2.5 font-bold rounded-2xl px-8 py-4 text-sm transition-all duration-300 ${className}`}
      style={{
        background: "rgba(16,185,129,.07)",
        color: "#059669",
        border: "1.5px solid rgba(16,185,129,.3)",
        boxShadow: "0 4px 20px rgba(16,185,129,.15)",
      }}
    >
      <span className="relative flex items-center gap-2 transition-transform group-hover:scale-105">
        {icon}
        {children}
      </span>
    </button>
  );
}
