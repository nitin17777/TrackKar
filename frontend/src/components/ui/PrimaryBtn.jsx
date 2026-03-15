export default function PrimaryBtn({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 font-bold rounded-2xl px-7 py-3.5 text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${className}`}
      style={{
        background: "linear-gradient(135deg,#5B4FE8 0%,#7C6FF7 100%)",
        boxShadow: "0 8px 24px rgba(91,79,232,0.35)",
      }}
    >
      {children}
    </button>
  );
}