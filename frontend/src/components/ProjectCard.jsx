import React from 'react';
import ProgressBar from './ProgressBar';

const ProjectCard = ({ task }) => {
  const progressColor =
    task.progress === 100
      ? 'bg-green-500'
      : task.progress >= 50
      ? 'bg-yellow-400'
      : 'bg-red-500';

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white hover:shadow-xl transition-all duration-300">
      <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
      <p className="mb-2 text-gray-600">
        Assigned: {task.assignedTo.join(', ')}
      </p>

      <div className="mb-2 flex items-center justify-between">
        <span className="text-gray-700 font-medium">{task.progress}%</span>
      </div>

      <ProgressBar progress={task.progress} color={progressColor} />
    </div>
  );
};

export default ProjectCard;
