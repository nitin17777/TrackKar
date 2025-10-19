import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTeam, joinTeam } from '../services/teamService';
import { TeamContext } from '../context/TeamContext';

const Landing = () => {
  const [nickname, setNickname] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const { setTeam } = useContext(TeamContext);
  const navigate = useNavigate();

  const handleCreate = async () => {
    const team = await createTeam(nickname, 'liquidFilling');
    setTeam(team);
    navigate('/dashboard');
  };

  const handleJoin = async () => {
    const team = await joinTeam(nickname, teamCode);
    setTeam(team);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">TrackKar</h1>
      <input
        type="text"
        placeholder="Your Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="border p-2 mb-4"
      />
      <div className="mb-4">
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white p-2 mr-2 rounded"
        >
          Create Team
        </button>
      </div>
      <input
        type="text"
        placeholder="Team Code"
        value={teamCode}
        onChange={(e) => setTeamCode(e.target.value)}
        className="border p-2 mb-4"
      />
      <div>
        <button
          onClick={handleJoin}
          className="bg-green-600 text-white p-2 rounded"
        >
          Join Team
        </button>
      </div>
    </div>
  );
};

export default Landing;
