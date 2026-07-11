import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import WorkspaceCard from "../../components/WorkspaceCard";
import { getWorkspaces, createWorkspace } from "../../api/workspaces";

export default function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getWorkspaces();
    setWorkspaces(data);
  };

  const addWorkspace = async () => {
    if (!newName.trim()) return;
    await createWorkspace(newName);
    setNewName("");
    load();
  };

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-white mb-6">Your Workspaces</h1>

      <div className="flex gap-3 mb-6">
        <input
          className="bg-[#1a1a2b] text-white p-2 rounded-lg"
          placeholder="New workspace name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          className="bg-purple-600 px-4 py-2 rounded-lg text-white"
          onClick={addWorkspace}
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workspaces.map((ws) => (
          <WorkspaceCard
            key={ws.id}
            workspace={ws}
            onSelect={() => window.location.href = `/workspace/${ws.id}`}
          />
        ))}
      </div>
    </AppLayout>
  );
}
