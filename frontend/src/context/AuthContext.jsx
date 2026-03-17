import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, loginAnonymously } from '../services/firebase';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg,#f0effe 0%,#f5fff9 50%,#eef6ff 100%)',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        @keyframes tkSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes tkPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.93)} }
        @keyframes tkFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tkDot { 0%,80%,100%{transform:scale(0);opacity:0} 40%{transform:scale(1);opacity:1} }
        .tk-logo-pulse { animation: tkPulse 1.8s ease-in-out infinite; }
        .tk-fadeup { animation: tkFadeUp .6s cubic-bezier(.22,1,.36,1) both; }
        .tk-dot { animation: tkDot 1.4s ease-in-out infinite both; }
      `}</style>

      {/* Blobs */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-10rem', left:'-10rem', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,.18),transparent)', filter:'blur(80px)' }} />
        <div style={{ position:'absolute', top:'2rem', right:'-8rem', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,.14),transparent)', filter:'blur(80px)' }} />
      </div>

      {/* Logo */}
      <div className="tk-logo-pulse" style={{
        width: 72, height: 72, borderRadius: 20,
        background: 'linear-gradient(135deg,#6366f1,#818cf8)',
        boxShadow: '0 0 40px rgba(99,102,241,.45), 0 12px 32px rgba(99,102,241,.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
        </svg>
      </div>

      {/* Brand name */}
      <p className="tk-fadeup" style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontSize: 28, fontWeight: 800, color: '#1f2937',
        letterSpacing: '-.03em', marginBottom: 8,
        animationDelay: '.1s',
      }}>TrackKar</p>

      <p className="tk-fadeup" style={{
        fontSize: 13, color: '#9ca3af', marginBottom: 32,
        animationDelay: '.2s',
      }}>Getting things ready…</p>

      {/* Bouncing dots */}
      <div style={{ display:'flex', gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="tk-dot" style={{
            width: 8, height: 8, borderRadius: '50%',
            background: i === 0 ? '#6366f1' : i === 1 ? '#818cf8' : '#10b981',
            animationDelay: `${i * 0.16}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loginAnonymously();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}
