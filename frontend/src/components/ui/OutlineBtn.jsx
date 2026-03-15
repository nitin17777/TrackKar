export default function OutlineBtn({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 font-bold rounded-2xl px-7 py-3.5 border-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${className}`}
      style={{ borderColor: "#00C48C", color: "#00C48C" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#00C48C";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#00C48C";
      }}
    >
      {children}
    </button>
  );
}