import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import GetStarted from "../pages/GetStarted";
import CreateTeam from "../pages/CreateTeam";
import JoinTeam from "../pages/JoinTeam";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/start" element={<GetStarted />} />
        <Route path="/create" element={<CreateTeam />} />
        <Route path="/join" element={<JoinTeam />} />
        <Route path="/team/:code" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}