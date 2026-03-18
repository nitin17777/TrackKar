import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, onSnapshot, collection, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useToast, ToastContainer } from "../hooks/useToast";

const COLS = {
  todo:       { label: "To Do",       color: "#6366f1", bg: "rgba(255,255,255,0.85)",  border: "rgba(99,102,241,.5)"  },
  inprogress: { label: "In Progress", color: "#f59e0b", bg: "rgba(255,255,255,0.85)",  border: "rgba(245,158,11,.5)" },
  done:       { label: "Done",        color: "#10b981", bg: "rgba(255,255,255,0.85)",  border: "rgba(16,185,129,.5)" },
};

const PRIORITY = {
  high:   { label: "High",   bg: "rgba(239,68,68,.1)",    color: "#dc2626", dot: "#ef4444" },
  medium: { label: "Medium", bg: "rgba(245,158,11,.1)",   color: "#b45309", dot: "#f59e0b" },
  low:    { label: "Low",    bg: "rgba(16,185,129,.1)",   color: "#059669", dot: "#10b981" },
};

/* ── Helper ──────────────────────────────────────────────────────────────── */
const normalizeStatus = (s) => {
  const l = (s || "").toLowerCase().replace(/[^a-z]/g, "");
  if (l.includes("progress") || l === "wip") return "inprogress";
  if (l.includes("done") || l.includes("complete")) return "done";
  return "todo"; // Default everything else to 'todo'
};

/* ── Countdown hook ──────────────────────────────────────────────────────── */
function useCountdown(deadline) {
  const [t, setT] = useState("");
  const [urgent, setUrgent] = useState(false);
  useEffect(() => {
    if (!deadline) return;
    const tick = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) { setT("⚠️ Deadline passed!"); setUrgent(true); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setUrgent(h < 2);
      setT(`${h}h ${m}m ${s}s remaining`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);
  return { t, urgent };
}

/* ── Task Card ───────────────────────────────────────────────────────────── */
function TaskCard({ task, onMove, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const p = PRIORITY[task.priority] || PRIORITY.medium;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-4 transition-all duration-250 group"
      style={{
        background: hovered ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.7)",
        border: `1.5px solid ${hovered ? "rgba(99,102,241,.25)" : "rgba(255,255,255,.85)"}`,
        boxShadow: hovered ? "0 12px 32px rgba(99,102,241,.1), 0 2px 8px rgba(0,0,0,.04)" : "0 2px 8px rgba(0,0,0,.04)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Priority bar */}
      <div className="absolute top-0 left-4 right-4 h-0.5 rounded-b-full transition-all duration-300"
        style={{ background: hovered ? p.dot : "transparent", boxShadow: hovered ? `0 0 8px ${p.dot}` : "none" }} />

      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-semibold text-gray-800 leading-snug flex-1">{task.text}</p>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-50"
          style={{ color: "#f87171", flexShrink: 0 }}
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority badge */}
        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: p.bg, color: p.color }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: p.dot }} />
          {p.label}
        </span>

        {/* Assignee */}
        {task.assign && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(99,102,241,.08)", color: "#6366f1" }}>
            👤 {task.assign}
          </span>
        )}

        {/* Move buttons */}
        <div className="ml-auto flex gap-1">
          {normalizeStatus(task.status) !== "todo" && (
            <button onClick={() => onMove(task.id, "todo")}
              className="text-xs px-2 py-1 rounded-lg font-medium transition-all hover:scale-105"
              style={{ background: "rgba(99,102,241,.1)", color: "#6366f1" }}>← Todo</button>
          )}
          {normalizeStatus(task.status) !== "inprogress" && (
            <button onClick={() => onMove(task.id, "inprogress")}
              className="text-xs px-2 py-1 rounded-lg font-medium transition-all hover:scale-105"
              style={{ background: "rgba(245,158,11,.1)", color: "#b45309" }}>
              {normalizeStatus(task.status) === "done" ? "← WIP" : "WIP →"}
            </button>
          )}
          {normalizeStatus(task.status) !== "done" && (
            <button onClick={() => onMove(task.id, "done")}
              className="text-xs px-2 py-1 rounded-lg font-medium transition-all hover:scale-105"
              style={{ background: "rgba(16,185,129,.1)", color: "#059669" }}>Done ✓</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Kanban Column ───────────────────────────────────────────────────────── */
function KanbanCol({ colKey, tasks, onMove, onDelete }) {
  const { label, color, bg, border } = COLS[colKey];
  const colTasks = tasks.filter(t => normalizeStatus(t.status) === colKey);
  return (
    <div className="flex flex-col gap-3">
      {/* Column header */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}88` }} />
        <h3 className="font-bold text-gray-700 text-sm" style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}>{label}</h3>
        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: color, boxShadow: `0 2px 8px ${color}55` }}>
          {colTasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        className="flex-1 min-h-[220px] rounded-2xl p-3 space-y-3 transition-all duration-200 shadow-sm"
        style={{ 
          background: bg, 
          border: `2px solid ${border}`,
          backdropFilter: 'blur(16px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.04), inset 0 2px 20px rgba(255,255,255,0.5)`
        }}
      >
        {colTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-10 gap-2 opacity-40">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <p className="text-xs font-medium" style={{ color }}>No tasks yet</p>
          </div>
        ) : (
          colTasks.map(t => <TaskCard key={t.id} task={t} onMove={onMove} onDelete={onDelete} />)
        )}
      </div>
    </div>
  );
}

/* ── Main Dashboard ──────────────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { code } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  const [taskText, setTaskText] = useState("");
  const [taskAssign, setTaskAssign] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const inputRef = useRef(null);

  const currentUser = localStorage.getItem("trackkar_currentUser") || "You";
  const { toasts, toast } = useToast();

  useEffect(() => {
    // Styling
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp     { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      @keyframes floatY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes shimmer    { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:.4} }
      @keyframes slideDown  { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
      @keyframes countPop   { 0%{transform:scale(1.4)} 100%{transform:scale(1)} }
      @keyframes urgentPulse{ 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }

      .td-fu   { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) both; }
      .td-fly  { animation: floatY 5s ease-in-out infinite; }
      .td-rot  { animation: rotateSlow 22s linear infinite; }
      .td-blink{ animation: blink 2s ease-in-out infinite; }
      .td-slide{ animation: slideDown .3s cubic-bezier(.22,1,.36,1) both; }
      .td-urgent{ animation: urgentPulse 1.5s ease-in-out infinite; }

      .td-shimmer {
        background: linear-gradient(90deg,#6366f1 0%,#10b981 30%,#6366f1 60%,#10b981 90%,#6366f1 100%);
        background-size: 200% auto;
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }
      .td-input {
        width:100%; padding:10px 14px; border-radius:12px; font-size:13px;
        background:rgba(255,255,255,.65); border:1.5px solid rgba(99,102,241,.15);
        color:#1f2937; transition:all .2s; font-family:'DM Sans',sans-serif;
        backdrop-filter:blur(12px);
      }
      .td-input:focus {
        outline:none; border-color:#6366f1;
        box-shadow:0 0 0 4px rgba(99,102,241,.1);
        background:rgba(255,255,255,.88);
      }
      .td-input::placeholder { color:#9ca3af; }
      .td-select {
        padding:10px 14px; border-radius:12px; font-size:13px;
        background:rgba(255,255,255,.65); border:1.5px solid rgba(99,102,241,.15);
        color:#1f2937; transition:all .2s; font-family:'DM Sans',sans-serif;
        backdrop-filter:blur(12px); cursor:pointer;
      }
      .td-select:focus { outline:none; border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,.1); }
      .td-add-btn {
        padding:10px 20px; border-radius:12px; font-size:13px; font-weight:700;
        color:white; border:none; cursor:pointer;
        background:linear-gradient(135deg,#6366f1,#818cf8);
        box-shadow:0 4px 16px rgba(99,102,241,.35);
        transition:all .2s; font-family:'DM Sans',sans-serif; white-space:nowrap;
      }
      .td-add-btn:hover { transform:translateY(-1px); box-shadow:0 6px 24px rgba(99,102,241,.45); }
      .td-add-btn:active { transform:translateY(0); }
    `;
    document.head.appendChild(style);
    document.title = 'TrackKar — Dashboard';
    setTimeout(() => setReady(true), 40);

    // Firestore Integration
    if (!code) return;

    // Listen to Project details
    const projRef = doc(db, "projects", code.toUpperCase());
    const unsubProj = onSnapshot(projRef, (docSnap) => {
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate("/");
      }
    });

    // Listen to Tasks
    const tasksRef = collection(db, "projects", code.toUpperCase(), "tasks");
    const unsubTasks = onSnapshot(tasksRef, (snapshot) => {
      const liveTasks = [];
      snapshot.forEach(doc => {
        liveTasks.push({ id: doc.id, ...doc.data() });
      });
      // Sort tasks by creation time (ascending) effectively
      liveTasks.sort((a,b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
      setTasks(liveTasks);
    });

    return () => {
      unsubProj();
      unsubTasks();
    };
  }, [code, navigate]);

  const { t: countdown, urgent } = useCountdown(project?.deadline);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (!project) return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f0effe 0%,#f5fff9 50%,#eef6ff 100%)', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @keyframes shimmerBg { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sk { background:linear-gradient(90deg,rgba(255,255,255,.4) 0%,rgba(255,255,255,.85) 50%,rgba(255,255,255,.4) 100%); background-size:200% 100%; animation:shimmerBg 1.6s ease-in-out infinite; border-radius:12px; }
      `}</style>
      {/* Skeleton header */}
      <div style={{ height:70, background:'rgba(255,255,255,.7)', borderBottom:'1px solid rgba(255,255,255,.85)', display:'flex', alignItems:'center', padding:'0 24px', gap:12, backdropFilter:'blur(24px)' }}>
        <div className="sk" style={{ width:36, height:36, borderRadius:10 }} />
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <div className="sk" style={{ width:60, height:10 }} />
          <div className="sk" style={{ width:120, height:14 }} />
        </div>
        <div className="sk" style={{ margin:'0 auto', width:100, height:32, borderRadius:10 }} />
      </div>
      {/* Skeleton body */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px 16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
          {[0,1,2,3].map(i => <div key={i} className="sk" style={{ height:90, borderRadius:16 }} />)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div className="sk" style={{ height:24, width:100, borderRadius:8 }} />
              {[0,1,2].map(j => <div key={j} className="sk" style={{ height:80, borderRadius:14 }} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const addTask = async () => {
    if (!taskText.trim()) return;
    try {
      const tasksRef = collection(db, "projects", project.id, "tasks");
      await addDoc(tasksRef, {
        text: taskText.trim(),
        assign: taskAssign,
        priority: taskPriority,
        status: "todo",
        createdAt: new Date().toISOString()
      });
      setTaskText(""); setTaskAssign(""); setTaskPriority("medium");
      setAddOpen(false);
      toast({ message: '✅ Task added!', type: 'success' });
    } catch (err) {
      console.error("Failed to add task", err);
      toast({ message: 'Failed to add task', type: 'error' });
    }
  };

  const moveTask = async (id, status) => {
    try {
      const taskRef = doc(db, "projects", project.id, "tasks", id);
      await updateDoc(taskRef, { status });
      const label = status === 'done' ? '🎉 Marked done!' : status === 'inprogress' ? '⚡ In progress!' : '↩️ Moved to Todo';
      toast({ message: label, type: 'success' });
    } catch (err) {
      console.error("Failed to move task", err);
      toast({ message: 'Failed to move task', type: 'error' });
    }
  };

  const deleteTask = async (id) => {
    try {
      const taskRef = doc(db, "projects", project.id, "tasks", id);
      await deleteDoc(taskRef);
      toast({ message: '🗑️ Task deleted', type: 'info' });
    } catch (err) {
      console.error("Failed to delete task", err);
      toast({ message: 'Failed to delete task', type: 'error' });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(project.id).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: "Total",       value: tasks.length, color: "#6366f1" },
    { label: "Done",        value: tasks.filter(t => normalizeStatus(t.status) === "done").length, color: "#10b981" },
    { label: "In Progress", value: tasks.filter(t => normalizeStatus(t.status) === "inprogress").length, color: "#f59e0b" },
    { label: "Members",     value: (project.members || []).length, color: "#3b82f6" },
  ];

  const doneCount = tasks.filter(t => normalizeStatus(t.status) === "done").length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const deadlineStr = project.deadline
    ? new Date(project.deadline).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
    : null;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: "linear-gradient(135deg,#f0effe 0%,#f5fff9 50%,#eef6ff 100%)", fontFamily: "'DM Sans',sans-serif" }}
    >
      {/* ── Blobs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,.2),transparent)" }} />
        <div className="absolute top-10 -right-32 w-[420px] h-[420px] rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle,rgba(16,185,129,.16),transparent)" }} />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[260px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,.1),transparent)", transform: "translateX(-50%)" }} />
      </div>

      {/* ── Rings ── */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="td-rot absolute w-[900px] h-[900px] rounded-full"
          style={{ border: "1px solid rgba(99,102,241,.05)" }} />
        <div className="td-rot absolute w-[620px] h-[620px] rounded-full"
          style={{ border: "1px solid rgba(16,185,129,.05)", animationDirection: "reverse", animationDuration: "30s" }} />
      </div>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,.72)", backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,.85)",
          boxShadow: "0 2px 20px rgba(99,102,241,.06)",
        }}
      >
        {/* Left: logo + project */}
        <div className="flex items-center gap-3">
          <div className="td-fly w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)", boxShadow: "0 0 16px rgba(99,102,241,.4)" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 leading-none mb-0.5">TrackKar</p>
            <p className="font-extrabold text-gray-900 leading-none text-sm"
              style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}>
              {project.name}
            </p>
          </div>
        </div>

        {/* Center: code copy pill */}
        <button
          onClick={copyCode}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: copied ? "rgba(16,185,129,.1)" : "rgba(99,102,241,.08)",
            border: `1px solid ${copied ? "rgba(16,185,129,.3)" : "rgba(99,102,241,.2)"}`,
          }}
        >
          <span className="font-black text-sm tracking-widest"
            style={{ fontFamily: "'Bricolage Grotesque',sans-serif", color: copied ? "#059669" : "#6366f1" }}>
            {project.id}
          </span>
          {copied ? (
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          )}
          <span className="text-xs font-medium" style={{ color: copied ? "#059669" : "#9ca3af" }}>
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>

        {/* Right: user avatar + back */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-indigo-500 transition-colors">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Home
          </button>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg,#6366f1,#10b981)", boxShadow: "0 0 12px rgba(99,102,241,.35)" }}>
            {currentUser[0]?.toUpperCase()}
          </div>
        </div>
      </header>

      <main className={`relative z-10 max-w-7xl mx-auto px-4 py-8 ${ready ? "" : "opacity-0"} td-fu`}>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label}
              className="relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,.7)", backdropFilter: "blur(16px)",
                border: "1.5px solid rgba(255,255,255,.88)",
                boxShadow: "0 4px 20px rgba(0,0,0,.05)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg,transparent,${s.color},transparent)` }} />
              <p className="text-xs font-semibold text-gray-400 mb-1">{s.label}</p>
              <p className="font-extrabold text-3xl" style={{ color: s.color, fontFamily: "'Bricolage Grotesque',sans-serif", textShadow: `0 0 20px ${s.color}44` }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="rounded-2xl px-5 py-4 mb-6"
            style={{
              background: "rgba(255,255,255,.65)", backdropFilter: "blur(16px)",
              border: "1.5px solid rgba(255,255,255,.88)",
              boxShadow: "0 2px 12px rgba(0,0,0,.04)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-500">Project Completion</p>
              <p className="text-xs font-black" style={{ color: progress === 100 ? '#10b981' : '#6366f1', fontFamily: "'Bricolage Grotesque',sans-serif" }}>
                {progress}%
              </p>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(99,102,241,.1)' }}>
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: progress === 100
                    ? 'linear-gradient(90deg,#10b981,#34d399)'
                    : 'linear-gradient(90deg,#6366f1,#818cf8)',
                  boxShadow: `0 0 8px ${progress === 100 ? 'rgba(16,185,129,.5)' : 'rgba(99,102,241,.4)'}`,
                }}
              />
            </div>
            {progress === 100 && tasks.length > 0 && (
              <p className="text-xs font-semibold text-center mt-2" style={{ color: '#10b981' }}>🎉 All tasks completed!</p>
            )}
          </div>
        {/* ── DEADLINE BANNER ── */}
        {deadlineStr && (
          <div
            className={`td-slide rounded-2xl px-5 py-4 mb-6 flex items-center gap-4 ${urgent ? "td-urgent" : ""}`}
            style={{
              background: urgent ? "rgba(239,68,68,.06)" : "rgba(255,255,255,.65)",
              backdropFilter: "blur(16px)",
              border: `1.5px solid ${urgent ? "rgba(239,68,68,.3)" : "rgba(99,102,241,.15)"}`,
              boxShadow: urgent ? "0 0 0 0 rgba(239,68,68,.4)" : "0 2px 12px rgba(0,0,0,.04)",
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: urgent ? "rgba(239,68,68,.1)" : "rgba(99,102,241,.08)" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                stroke={urgent ? "#ef4444" : "#6366f1"} strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold mb-0.5" style={{ color: urgent ? "#dc2626" : "#6366f1" }}>
                {urgent ? "⚠️ Running out of time!" : "Project Deadline"}
              </p>
              <p className="text-sm font-bold text-gray-700">{deadlineStr}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400 mb-0.5">Remaining</p>
              <p className="text-sm font-black tabular-nums" style={{ color: urgent ? "#ef4444" : "#6366f1", fontFamily: "'Bricolage Grotesque',sans-serif" }}>
                {countdown}
              </p>
            </div>
          </div>
        )}

        {/* ── ADD TASK PANEL ── */}
        <div
          className="rounded-2xl p-5 mb-6 transition-all duration-300"
          style={{
            background: "rgba(255,255,255,.7)", backdropFilter: "blur(16px)",
            border: "1.5px solid rgba(255,255,255,.88)",
            boxShadow: "0 2px 16px rgba(99,102,241,.06)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2"
              style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}>
              <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                style={{ background: "rgba(99,102,241,.1)", color: "#6366f1" }}>+</span>
              Add New Task
            </h3>
            <button
              onClick={() => { setAddOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{ background: addOpen ? "rgba(239,68,68,.08)" : "rgba(99,102,241,.08)", color: addOpen ? "#dc2626" : "#6366f1" }}
            >
              {addOpen ? "✕ Cancel" : "＋ New"}
            </button>
          </div>

          {addOpen && (
            <div className="td-slide flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1.5">Task</label>
                <input ref={inputRef} className="td-input" placeholder="What needs to be done?" value={taskText}
                  onChange={e => setTaskText(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1.5">Assign</label>
                <select className="td-select" value={taskAssign} onChange={e => setTaskAssign(e.target.value)}>
                  <option value="">Unassigned</option>
                  {(project.members || []).map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1.5">Priority</label>
                <select className="td-select" value={taskPriority} onChange={e => setTaskPriority(e.target.value)}>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <button className="td-add-btn" onClick={addTask}>Add Task →</button>
            </div>
          )}
        </div>

        {/* ── KANBAN BOARD ── */}
        <div className="grid md:grid-cols-3 gap-5">
          {Object.keys(COLS).map(col => (
            <KanbanCol key={col} colKey={col} tasks={tasks} onMove={moveTask} onDelete={deleteTask} />
          ))}
        </div>

        {/* ── TEAM MEMBERS ── */}
        <div
          className="rounded-2xl p-5 mt-6"
          style={{
            background: "rgba(255,255,255,.7)", backdropFilter: "blur(16px)",
            border: "1.5px solid rgba(255,255,255,.88)",
            boxShadow: "0 2px 16px rgba(99,102,241,.06)",
          }}
        >
          <h3 className="font-extrabold text-gray-800 text-sm mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}>
            <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
              style={{ background: "rgba(99,102,241,.1)", color: "#6366f1" }}>👥</span>
            Team Members
            <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ background: "#6366f1" }}>{(project.members || []).length}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {(project.members || []).map((m, i) => (
              <div key={m} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.15)" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: `linear-gradient(135deg,${["#6366f1","#10b981","#f59e0b","#3b82f6","#ec4899"][i % 5]},${["#818cf8","#34d399","#fbbf24","#60a5fa","#f472b6"][i % 5]})` }}>
                  {m[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-700">{m}</span>
                {m === project.owner && (
                  <span className="text-xs px-1.5 py-0.5 rounded-md font-bold"
                    style={{ background: "rgba(99,102,241,.1)", color: "#6366f1" }}>Lead</span>
                )}
                {m === currentUser && m !== project.owner && (
                  <span className="text-xs px-1.5 py-0.5 rounded-md font-bold"
                    style={{ background: "rgba(16,185,129,.1)", color: "#059669" }}>You</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom pills */}
        <div className="flex justify-center gap-3 mt-8 pb-8">
          {[
            { icon: "⚡", text: "Live updates", color: "#6366f1" },
            { icon: "🔒", text: "No account",   color: "#10b981" },
            { icon: "🎯", text: "Stay focused",  color: "#3b82f6" },
          ].map(p => (
            <div key={p.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md"
              style={{ background: `${p.color}10`, border: `1px solid ${p.color}28`, color: p.color }}>
              {p.icon} {p.text}
            </div>
          ))}
        </div>
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}