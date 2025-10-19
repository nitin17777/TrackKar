import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import TeamPage from './pages/TeamPage';
import ProjectView from './pages/ProjectView';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/team/:teamCode" element={<TeamPage />} />
        <Route path="/project/:projectId" element={<ProjectView />} />
      </Routes>
    </Router>
  );
};

export default App;
