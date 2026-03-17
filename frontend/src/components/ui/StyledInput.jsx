import React from 'react';

export default function StyledInput({ label, placeholder, value, onChange, type = "text", icon, error, ...props }) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-[11px] font-bold text-indigo-500 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none transition-transform group-focus-within:scale-110">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-3.5 rounded-2xl text-sm transition-all duration-200 outline-none
            ${icon ? 'pl-11 pr-5' : 'px-5'}
            ${error ? 'border-red-400 bg-red-50/30' : 'border-indigo-100 bg-white/60 focus:bg-white'}
          `}
          style={{
            border: `1.5px solid ${error ? 'rgba(239,68,68,.3)' : 'rgba(99,102,241,.12)'}`,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 12px rgba(0,0,0,.02)',
          }}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{error}</p>}
    </div>
  );
}
