import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTasks } from "../api/taskApi";
import TaskList from "../components/TaskList";
import ProgressVisualization from "../components/ProgressVisualization";

const Dashboard = () => {
  const { teamId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks(teamId);
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    };
    getTasks();
  }, [teamId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Team Dashboard</h1>
      <ProgressVisualization tasks={tasks} type="radial" />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default Dashboard;
