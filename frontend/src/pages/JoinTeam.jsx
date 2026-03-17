import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../services/firebase";

import GlassCard from "../components/ui/GlassCard";
import PrimaryBtn from "../components/ui/PrimaryBtn";
import StyledInput from "../components/ui/StyledInput";

export default function JoinTeam() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp     { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
      @keyframes floatY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes shimmer    { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:.4} }
      @keyframes shake      { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
      @keyframes letterPop  { from{opacity:0;transform:translateY(8px) scale(.8)} to{opacity:1;transform:translateY(0) scale(1)} }

      .jt-fu    { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) both; }
      .jt-fly   { animation: floatY 5s ease-in-out infinite; }
      .jt-rot   { animation: rotateSlow 22s linear infinite; }
      .jt-blink { animation: blink 2s ease-in-out infinite; }
      .jt-shake { animation: shake .4s ease both; }

      .jt-shimmer {
        background: linear-gradient(90deg,#10b981 0%,#6366f1 30%,#10b981 60%,#6366f1 90%,#10b981 100%);
        background-size: 200% auto;
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }

      .jt-input {
        width:100%; padding:12px 16px; border-radius:14px; font-size:14px;
        background:rgba(255,255,255,.65); border:1.5px solid rgba(16,185,129,.15);
        color:#1f2937; transition:all .2s; font-family:'DM Sans',sans-serif;
        backdrop-filter:blur(12px);
      }
      .jt-input:focus {
        outline:none; border-color:#10b981;
        box-shadow:0 0 0 4px rgba(16,185,129,.12);
        background:rgba(255,255,255,.85);
      }
      .jt-input::placeholder { color:#9ca3af; }

      .jt-code-input {
        width:100%; padding:14px 16px; border-radius:14px; font-size:22px;
        font-weight:800; text-align:center; letter-spacing:.22em;
        text-transform:uppercase; font-family:'Bricolage Grotesque',sans-serif;
        background:rgba(255,255,255,.65); border:1.5px solid rgba(16,185,129,.2);
        color:#059669; transition:all .2s; backdrop-filter:blur(12px);
      }
      .jt-code-input:focus {
        outline:none; border-color:#10b981;
        box-shadow:0 0 0 4px rgba(16,185,129,.15), 0 0 24px rgba(16,185,129,.12);
        background:rgba(255,255,255,.88);
      }
      .jt-code-input::placeholder { color:#d1fae5; font-size:18px; letter-spacing:.15em; font-weight:600; }

      .jt-label {
        display:block; font-size:11px; font-weight:700;
        text-transform:uppercase; letter-spacing:.07em;
        color:#10b981; margin-bottom:6px;
        font-family:'DM Sans',sans-serif;
      }

      .jt-btn {
        width:100%; padding:14px; border-radius:16px; font-size:15px;
        font-weight:700; color:white; border:none; cursor:pointer;
        background:linear-gradient(135deg,#10b981 0%,#34d399 100%);
        box-shadow:0 8px 28px rgba(16,185,129,.4);
        transition:all .25s; font-family:'Bricolage Grotesque',sans-serif;
        letter-spacing:-.01em; position:relative; overflow:hidden;
      }
      .jt-btn:hover:not(:disabled) {
        box-shadow:0 0 40px rgba(16,185,129,.5),0 10px 36px rgba(16,185,129,.3);
        transform:translateY(-2px);
      }
      .jt-btn:active:not(:disabled) { transform:translateY(0); }
      .jt-btn:disabled { opacity:.7; cursor:not-allowed; }

      .jt-char {
        display:inline-block;
        animation: letterPop .3s cubic-bezier(.22,1,.36,1) both;
      }
    `;
    document.head.appendChild(style);
    document.title = 'TrackKar — Join Team';
    setTimeout(() => setReady(true), 40);
  }, []);

  /* Live code char preview */
  const codeChars = code.padEnd(6, "·").split("");

  const handleJoin = async () => {
    if (!code.trim() || !name.trim()) {
      setError("Please enter your team code and name.");
      return;
    }
    if (code.trim().length < 6) {
      setError("Team code must be exactly 6 characters.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const upperCode = code.toUpperCase();
      const docRef = doc(db, "projects", upperCode);

      // Timeout guard — if Firebase hangs for >10s, surface the error
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out. Check Firestore is created and rules allow reads.")), 10000)
      );

      const docSnap = await Promise.race([getDoc(docRef), timeout]);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          members: arrayUnion(name.trim())
        });
        localStorage.setItem("trackkar_currentUser", name.trim());
        navigate(`/team/${upperCode}`);
      } else {
        setError("Team not found. Please check the code.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      const msg = err?.code ? `Firebase error: ${err.code}` : err?.message || "Error joining team.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg,#f0fffe 0%,#f5fff9 50%,#eef6ff 100%)",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {/* ── Blobs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle,rgba(16,185,129,.22),transparent)" }}
        />
        <div
          className="absolute top-10 -left-32 w-[420px] h-[420px] rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,.16),transparent)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-[600px] h-[260px] rounded-full blur-[100px]"
          style={{
            background: "radial-gradient(circle,rgba(16,185,129,.1),transparent)",
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* ── Decorative rings ── */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div
          className="jt-rot absolute w-[700px] h-[700px] rounded-full"
          style={{ border: "1px solid rgba(16,185,129,.07)" }}
        />
        <div
          className="jt-rot absolute w-[480px] h-[480px] rounded-full"
          style={{
            border: "1px solid rgba(99,102,241,.07)",
            animationDirection: "reverse",
            animationDuration: "30s",
          }}
        />
      </div>

      {/* ── Card ── */}
      <div
        className={`jt-fu relative z-10 w-full max-w-md ${ready ? "" : "opacity-0"}`}
        style={{ animationDelay: ".08s" }}
      >
        {/* Back link */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm font-medium text-emerald-500 mb-6 hover:text-emerald-700 transition-colors"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </button>

        <div
          className="relative rounded-3xl p-8 overflow-hidden"
          style={{
            background: "rgba(255,255,255,.72)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255,255,255,.9)",
            boxShadow:
              "0 24px 64px rgba(16,185,129,.1), 0 4px 24px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.9)",
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse at 100% 0%,rgba(16,185,129,.08),transparent 55%)",
            }}
          />

          {/* Header */}
          <div className="relative flex items-center gap-4 mb-7">
            <div
              className="jt-fly w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#10b981,#34d399)",
                boxShadow: "0 8px 24px rgba(16,185,129,.45)",
              }}
            >
              🔑
            </div>
            <div>
              <h1
                className="text-2xl font-extrabold text-gray-900 leading-tight"
                style={{
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  letterSpacing: "-.03em",
                }}
              >
                Join{" "}
                <span className="jt-shimmer">Existing Team</span>
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Enter the code shared by your team lead
              </p>
            </div>
          </div>

          {/* Code boxes preview */}
          <div className="relative flex justify-center gap-2 mb-7">
            {codeChars.map((ch, i) => (
              <div
                key={i}
                className="w-10 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-all duration-200"
                style={{
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  background: ch !== "·"
                    ? "linear-gradient(135deg,rgba(16,185,129,.12),rgba(52,211,153,.08))"
                    : "rgba(255,255,255,.5)",
                  border: `1.5px solid ${ch !== "·" ? "rgba(16,185,129,.4)" : "rgba(0,0,0,.08)"}`,
                  color: ch !== "·" ? "#059669" : "#d1d5db",
                  boxShadow: ch !== "·" ? "0 0 12px rgba(16,185,129,.2)" : "none",
                  transform: ch !== "·" ? "scale(1.05)" : "scale(1)",
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {ch}
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="relative space-y-5">
            {/* Team Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="jt-label" style={{ marginBottom: 0 }}>Team Code</label>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(16,185,129,.1)", color: "#10b981" }}>
                  6 characters
                </span>
              </div>
              <input
                className="jt-code-input"
                placeholder="ABCDEF"
                maxLength={6}
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
              />
            </div>

            {/* Your Name */}
            <div>
              <label className="jt-label">Your Name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none">✌️</span>
                <input
                  className="jt-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="Enter your nickname"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="jt-shake mt-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
              style={{
                background: "rgba(239,68,68,.08)",
                border: "1px solid rgba(239,68,68,.25)",
                color: "#dc2626",
              }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Divider */}
          <div
            className="my-7"
            style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(16,185,129,.2),transparent)" }}
          />

          {/* CTA */}
          <div className="relative">
            <button className="jt-btn" onClick={handleJoin} disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Joining team…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🚀 Join Team →
                </span>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
              <span className="jt-blink w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              No signup · Instant access · Start collaborating now
            </p>
          </div>

          {/* Switch to create */}
          <p className="text-center text-sm text-gray-400 mt-5">
            Don't have a code?{" "}
            <button
              onClick={() => navigate("/start")}
              className="font-semibold transition-colors"
              style={{ color: "#6366f1" }}
              onMouseEnter={e => (e.target.style.color = "#4f46e5")}
              onMouseLeave={e => (e.target.style.color = "#6366f1")}
            >
              Create a new team →
            </button>
          </p>
        </div>

        {/* Bottom stat pills */}
        <div className="flex justify-center gap-3 mt-5">
          {[
            { icon: "⚡", text: "Instant join",  color: "#10b981" },
            { icon: "🔒", text: "No account",    color: "#6366f1" },
            { icon: "🤝", text: "Team-ready",    color: "#3b82f6" },
          ].map((p) => (
            <div
              key={p.text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md"
              style={{
                background: `${p.color}10`,
                border: `1px solid ${p.color}28`,
                color: p.color,
              }}
            >
              {p.icon} {p.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}