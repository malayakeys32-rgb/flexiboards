import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WorkspaceList from "./pages/Workspace/WorkspaceList";
import WorkspacePage from "./pages/Workspace/WorkspacePage";
import SettingsPage from "./pages/Settings/SettingsPage";
import PricingPage from "./pages/Pricing/PricingPage";
import LoginPage from "./pages/auth/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/workspace" element={<WorkspaceList />} />
        <Route path="/workspace/:id" element={<WorkspacePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
