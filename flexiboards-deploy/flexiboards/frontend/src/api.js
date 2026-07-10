const BASE = process.env.REACT_APP_API_URL || "";

export const api = {
  login: (email, password) =>
    fetch(`${BASE}/api/auth/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email,password}) }).then(r=>r.json()),

  getWorkspace: () =>
    fetch(`${BASE}/api/workspace`).then(r=>r.json()),

  updateWorkspaceName: (name) =>
    fetch(`${BASE}/api/workspace`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name}) }).then(r=>r.json()),

  uploadLogo: (file) => {
    const fd = new FormData(); fd.append("logo", file);
    return fetch(`${BASE}/api/workspace/logo`, { method:"POST", body:fd }).then(r=>r.json());
  },

  deleteLogo: () =>
    fetch(`${BASE}/api/workspace/logo`, { method:"DELETE" }).then(r=>r.json()),

  getTasks:    () => fetch(`${BASE}/api/tasks`).then(r=>r.json()),
  createTask:  (t) => fetch(`${BASE}/api/tasks`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(t) }).then(r=>r.json()),
  updateTask:  (id,t) => fetch(`${BASE}/api/tasks/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(t) }).then(r=>r.json()),
  deleteTask:  (id) => fetch(`${BASE}/api/tasks/${id}`, { method:"DELETE" }).then(r=>r.json()),

  getProjects:   () => fetch(`${BASE}/api/projects`).then(r=>r.json()),
  createProject: (p) => fetch(`${BASE}/api/projects`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(p) }).then(r=>r.json()),
  deleteProject: (id) => fetch(`${BASE}/api/projects/${id}`, { method:"DELETE" }).then(r=>r.json()),

  getMembers:   () => fetch(`${BASE}/api/members`).then(r=>r.json()),
  updateMember: (id,m) => fetch(`${BASE}/api/members/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(m) }).then(r=>r.json()),
  deleteMember: (id) => fetch(`${BASE}/api/members/${id}`, { method:"DELETE" }).then(r=>r.json()),
};
