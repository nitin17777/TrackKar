import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "TrackKar — Page Not Found";
    setTimeout(() => setReady(true), 100);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        background: "linear-gradient(135deg,#f0effe 0%,#f5fff9 50%,#eef6ff 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @keyframes nfFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nfFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .nf-fu { animation: nfFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .nf-float { animation: nfFloat 4s ease-in-out infinite; }
      `}</style>

      {/* Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,.15),transparent)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle,rgba(16,185,129,.1),transparent)" }}
        />
      </div>

      <div className={`relative z-10 ${ready ? "nf-fu" : "opacity-0"}`}>
        <div className="nf-float text-8xl mb-6">🏜️</div>
        <h1
          className="text-5xl font-extrabold text-gray-900 mb-4"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-.04em" }}
        >
          404 — Lost in Space
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved to another dimension.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 font-bold rounded-2xl px-10 py-4 text-sm text-white transition-all duration-300"
          style={{
            background: "linear-gradient(135deg,#6366f1,#818cf8)",
            boxShadow: "0 8px 28px rgba(99,102,241,.35)",
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
}
