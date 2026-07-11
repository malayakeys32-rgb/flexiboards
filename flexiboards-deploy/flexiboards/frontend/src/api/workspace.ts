const API_URL = import.meta.env.VITE_API_URL;

export const getWorkspaces = async () => {
  const res = await fetch(`${API_URL}/api/workspaces`);
  return res.json();
};

export const createWorkspace = async (name: string) => {
  const res = await fetch(`${API_URL}/api/workspaces`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const updateWorkspace = async (id: string, name: string) => {
  const res = await fetch(`${API_URL}/api/workspaces/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const deleteWorkspace = async (id: string) => {
  const res = await fetch(`${API_URL}/api/workspaces/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
