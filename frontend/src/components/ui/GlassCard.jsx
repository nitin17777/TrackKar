export default function GlassCard({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(255,255,255,0.85)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}