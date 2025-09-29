import React from "react";

const TaskItem = ({ task }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Todo":
        return "bg-gray-200 text-gray-800";
      case "In Progress":
        return "bg-yellow-200 text-yellow-800";
      case "Done":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="border p-4 rounded shadow mb-3 bg-white flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <p className="text-sm text-gray-500">Assigned to: {task.assignee || "Unassigned"}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
        {task.status}
      </span>
    </div>
  );
};

export default TaskItem;
