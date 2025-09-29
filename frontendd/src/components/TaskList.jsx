import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-500">No tasks available. Add some!</p>;
  }

  return (
    <div className="mt-6">
      {tasks.map((task) => (
        <TaskItem key={task.id || task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
