import React, { useContext, useEffect, useState } from 'react';
import { TeamContext } from '../context/TeamContext';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { addTask } from '../services/taskService';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Dashboard = () => {
  const { team, tasks, setTasks } = useContext(TeamContext);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (!team) return;

    // Join the Socket.io room for real-time updates
    socket.emit('joinTeam', team.teamCode);

    socket.on('updateTasks', (updatedTasks) => {
      setTasks(updatedTasks);
    });

    return () => socket.disconnect();
  }, [team]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const task = await addTask(team.teamCode, {
      title: newTask,
      assignedTo: [team.leader],
      progress: 0,
    });

    const updated = [...tasks, task];
    setTasks(updated);

    socket.emit('taskUpdated', { teamCode: team.teamCode, tasks: updated });
    setNewTask('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar team={team} />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Tasks Dashboard</h1>

        {/* Add Task Input */}
        <div className="flex mb-6">
          <input
            type="text"
            placeholder="New Task Title..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-600 text-white px-6 rounded-r-md hover:bg-blue-700 transition-all duration-200"
          >
            Add Task
          </button>
        </div>

        {/* Tasks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length ? (
            tasks.map((task) => <ProjectCard key={task._id} task={task} />)
          ) : (
            <p className="text-gray-500">No tasks yet. Add one above!</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
