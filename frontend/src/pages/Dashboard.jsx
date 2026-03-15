import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import TaskGrid from "../components/dashboard/TaskGrid";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* Top Header */}
      <Header />

      {/* Body */}
      <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <TaskGrid />
        </main>

      </div>
    </div>
  );
}