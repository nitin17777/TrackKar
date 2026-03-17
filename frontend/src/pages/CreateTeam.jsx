import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function CreateTeam() {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [userName, setUserName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Add same styling logic as JoinTeam
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
      @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
      
      .ct-fu { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) both; }
      .ct-fly { animation: floatY 5s ease-in-out infinite; }
      .ct-rot { animation: rotateSlow 22s linear infinite; }
      .ct-shake { animation: shake .4s ease both; }

      .ct-shimmer {
        background: linear-gradient(90deg,#6366f1 0%,#818cf8 30%,#6366f1 60%,#818cf8 90%,#6366f1 100%);
        background-size: 200% auto;
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }

      .ct-input {
        width:100%; padding:12px 16px; border-radius:14px; font-size:14px;
        background:rgba(255,255,255,.65); border:1.5px solid rgba(99,102,241,.15);
        color:#1f2937; transition:all .2s; font-family:'DM Sans',sans-serif;
        backdrop-filter:blur(12px);
      }
      .ct-input:focus {
        outline:none; border-color:#6366f1;
        box-shadow:0 0 0 4px rgba(99,102,241,.12);
        background:rgba(255,255,255,.85);
      }
      .ct-input::placeholder { color:#9ca3af; }

      .ct-label {
        display:block; font-size:11px; font-weight:700;
        text-transform:uppercase; letter-spacing:.07em;
        color:#6366f1; margin-bottom:6px;
        font-family:'DM Sans',sans-serif;
      }

      .ct-btn {
        width:100%; padding:14px; border-radius:16px; font-size:15px;
        font-weight:700; color:white; border:none; cursor:pointer;
        background:linear-gradient(135deg,#6366f1 0%,#818cf8 100%);
        box-shadow:0 8px 28px rgba(99,102,241,.4);
        transition:all .25s; font-family:'Bricolage Grotesque',sans-serif;
        letter-spacing:-.01em; position:relative; overflow:hidden;
      }
      .ct-btn:hover:not(:disabled) {
        box-shadow:0 0 40px rgba(99,102,241,.5),0 10px 36px rgba(99,102,241,.3);
        transform:translateY(-2px);
      }
      .ct-btn:active:not(:disabled) { transform:translateY(0); }
      .ct-btn:disabled { opacity:.7; cursor:not-allowed; }
    `;
    document.head.appendChild(style);
    document.title = 'TrackKar — Create Team';
    setTimeout(() => setReady(true), 40);
  }, []);

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };

  const handleCreate = async () => {
    if (!projectName.trim() || !userName.trim()) {
      setError("Please provide a project name and your name.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const code = generateCode();
      const projectRef = doc(db, "projects", code);
      
      const newProject = {
        name: projectName.trim(),
        owner: userName.trim(),
        members: [userName.trim()],
        deadline: deadline || null,
        createdAt: new Date().toISOString(),
      };

      // Timeout guard — if Firebase hangs for >10s, surface the error
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out. Check Firestore is created and rules allow writes.")), 10000)
      );

      await Promise.race([setDoc(projectRef, newProject), timeout]);
      
      localStorage.setItem("trackkar_currentUser", userName.trim());
      navigate(`/team/${code}`);
    } catch (err) {
      console.error(err);
      const msg = err?.code ? `Firebase error: ${err.code}` : err?.message || "Failed to create project.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg,#f0fffe 0%,#f5fff9 50%,#eef6ff 100%)", fontFamily: "'DM Sans',sans-serif" }}
    >
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,.22),transparent)" }} />
        <div className="absolute top-10 -right-32 w-[420px] h-[420px] rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle,rgba(16,185,129,.18),transparent)" }} />
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="ct-rot absolute w-[700px] h-[700px] rounded-full" style={{ border: "1px solid rgba(99,102,241,.07)" }} />
      </div>

      <div className={`ct-fu relative z-10 w-full max-w-md ${ready ? "" : "opacity-0"}`} style={{ animationDelay: ".08s" }}>
        <button onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-500 mb-6 hover:text-indigo-700 transition-colors">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </button>

        <div className="relative rounded-3xl p-8 overflow-hidden"
          style={{
            background: "rgba(255,255,255,.72)", backdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255,255,255,.9)",
            boxShadow: "0 24px 64px rgba(99,102,241,.1), 0 4px 24px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.9)",
          }}>
          
          <div className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{ background: "radial-gradient(ellipse at 100% 0%,rgba(99,102,241,.08),transparent 55%)" }} />

          <div className="relative flex items-center gap-4 mb-7">
            <div className="ct-fly w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)", boxShadow: "0 8px 24px rgba(99,102,241,.45)" }}>
              🚀
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight"
                style={{ fontFamily: "'Bricolage Grotesque',sans-serif", letterSpacing: "-.03em" }}>
                Create <span className="ct-shimmer">New Team</span>
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">Start a fresh project workspace</p>
            </div>
          </div>

          <div className="relative space-y-5">
            <div>
              <label className="ct-label">Project Name</label>
              <input className="ct-input" placeholder="e.g. Website Redesign" value={projectName}
                onChange={(e) => { setProjectName(e.target.value); setError(""); }} />
            </div>

            <div>
              <label className="ct-label">Your Name</label>
              <input className="ct-input" placeholder="Enter your nickname" value={userName}
                onChange={(e) => { setUserName(e.target.value); setError(""); }} />
            </div>
            
            <div>
              <label className="ct-label">Deadline (Optional)</label>
              <input type="datetime-local" className="ct-input" value={deadline}
                onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>

          {error && (
            <div className="ct-shake mt-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
              style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", color: "#dc2626" }}>
              ⚠️ {error}
            </div>
          )}

          <div className="my-7" style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(99,102,241,.2),transparent)" }} />

          <div className="relative">
            <button className="ct-btn" onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "✨ Create Team →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}