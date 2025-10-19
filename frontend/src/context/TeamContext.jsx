import React, { createContext, useState } from 'react';

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);

  return (
    <TeamContext.Provider value={{ team, setTeam, tasks, setTasks }}>
      {children}
    </TeamContext.Provider>
  );
};
