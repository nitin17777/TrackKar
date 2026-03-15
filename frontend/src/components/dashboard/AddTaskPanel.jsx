import { useState } from "react";
import PrimaryBtn from "../ui/PrimaryBtn";

export default function AddTaskPanel({ onAdd }) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;

    onAdd({
      id: Date.now(),
      title,
      assignee,
      progress: 0,
    });

    setTitle("");
    setAssignee("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-8">

      <h3 className="font-bold text-lg mb-4">
        Add New Task
      </h3>

      <div className="flex flex-col md:flex-row gap-4">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task description..."
          className="flex-1 border rounded-lg px-4 py-2"
        />

        <input
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Assign to (optional)"
          className="border rounded-lg px-4 py-2"
        />

        <PrimaryBtn onClick={handleAdd}>
          ➕ Add Task
        </PrimaryBtn>

      </div>

    </div>
  );
}