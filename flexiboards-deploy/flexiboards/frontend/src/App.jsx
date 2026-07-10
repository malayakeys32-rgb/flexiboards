import React, { useState, useEffect, createContext, useContext } from "react";
import Login from "./components/Login";
import FlexiBoards from "./components/FlexiBoards";
import { api } from "./api";

// ── Workspace context shared across all components ───────────────────────────
export const WorkspaceContext = createContext({
  workspace: { name: "FlexiBoards", logoUrl: null },
  setWorkspace: () => {},
  refreshWorkspace: () => {},
});
export const useWorkspace = () => useContext(WorkspaceContext);

function useStorage(key, def) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

export default function App() {
  const [session, setSession]     = useStorage("fb-session", null);
  const [workspace, setWorkspace] = useState({ name: "FlexiBoards", logoUrl: null });

  const refreshWorkspace = async () => {
    try { const w = await api.getWorkspace(); setWorkspace(w); } catch {}
  };

  useEffect(() => { refreshWorkspace(); }, []);

  const handleLogin = async (email, password) => {
    try {
      const result = await api.login(email, password);
      if (result.ok) { setSession(result.user); return { ok: true }; }
      return { ok: false, error: result.error };
    } catch {
      // Fallback for local dev without backend
      if (email === "admin@flexiboards.com" && password === "Admin@2026!") {
        const user = { email, name: "Jane Doe", initials: "JD", role: "Admin" };
        setSession(user);
        return { ok: true };
      }
      return { ok: false, error: "Invalid email or password." };
    }
  };

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace, refreshWorkspace }}>
      {!session
        ? <Login onLogin={handleLogin} workspace={workspace} />
        : <FlexiBoards session={session} onLogout={() => setSession(null)} />}
    </WorkspaceContext.Provider>
  );
}
