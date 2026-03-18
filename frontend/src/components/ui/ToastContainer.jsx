const ICONS = {
  success: (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  error: (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

const STYLES = {
  success: { bg: 'rgba(16,185,129,.12)', border: 'rgba(16,185,129,.35)', color: '#059669' },
  error:   { bg: 'rgba(239,68,68,.1)',   border: 'rgba(239,68,68,.3)',   color: '#dc2626' },
  info:    { bg: 'rgba(99,102,241,.1)',  border: 'rgba(99,102,241,.3)',  color: '#6366f1' },
};

export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <>
      <style>{`
        @keyframes toastIn { from{opacity:0;transform:translateY(16px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        .tktoast { animation: toastIn .28s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
      <div style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const s = STYLES[t.type] || STYLES.info;
          return (
            <div key={t.id} className="tktoast" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 14,
              background: s.bg, border: `1.5px solid ${s.border}`, color: s.color,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
              backdropFilter: 'blur(16px)',
              boxShadow: `0 8px 24px ${s.border.replace('.35',',.15').replace('.3',',.12')}`,
              whiteSpace: 'nowrap',
            }}>
              {ICONS[t.type]}
              {t.message}
            </div>
          );
        })}
      </div>
    </>
  );
}
