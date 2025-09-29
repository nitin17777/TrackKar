import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam, joinTeam } from "../api/taskApi";

const LandingPage = () => {
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleCreateTeam = async () => {
    try {
      const data = await createTeam(teamName);
      navigate(`/dashboard/${data.teamId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinTeam = async () => {
    try {
      const data = await joinTeam(teamCode, username);
      navigate(`/dashboard/${data.teamId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to TrackKar</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleCreateTeam}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Team
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Team Code"
          value={teamCode}
          onChange={(e) => setTeamCode(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleJoinTeam}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Join Team
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
