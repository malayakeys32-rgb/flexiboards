const express  = require("express");
const cors     = require("cors");
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");
const { v4: uuid } = require("uuid");

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React build in production
const BUILD = path.join(__dirname, "../frontend/build");
if (fs.existsSync(BUILD)) {
  app.use(express.static(BUILD));
}

// ── In-memory state (persisted to data.json) ─────────────────────────────────
const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return { workspace: { name: "FlexiBoards", logoUrl: null }, tasks: [], projects: [], members: [], settings: {} }; }
}
function saveData(d) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2));
}

let db = loadData();

// ── Multer — logo upload ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename:    (req, file, cb) => cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpeg|jpg|png|gif|svg\+xml|webp)/.test(file.mimetype);
    cb(ok ? null : new Error("Images only"), ok);
  },
});

// ── AUTH ─────────────────────────────────────────────────────────────────────
const ADMIN = { email: "admin@flexiboards.com", password: "Admin@2026!", name: "Jane Doe", initials: "JD", role: "Admin" };

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN.email && password === ADMIN.password) {
    return res.json({ ok: true, user: { email: ADMIN.email, name: ADMIN.name, initials: ADMIN.initials, role: ADMIN.role } });
  }
  res.status(401).json({ ok: false, error: "Invalid email or password." });
});

// ── WORKSPACE ────────────────────────────────────────────────────────────────
app.get("/api/workspace", (req, res) => res.json(db.workspace));

app.put("/api/workspace", (req, res) => {
  const { name } = req.body;
  if (name && name.trim()) db.workspace.name = name.trim();
  saveData(db);
  res.json(db.workspace);
});

app.post("/api/workspace/logo", upload.single("logo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // Remove old logo file if it exists
  if (db.workspace.logoUrl) {
    const old = path.join(__dirname, db.workspace.logoUrl.replace(/^\//, ""));
    try { if (fs.existsSync(old)) fs.unlinkSync(old); } catch {}
  }
  db.workspace.logoUrl = `/uploads/${req.file.filename}`;
  saveData(db);
  res.json({ logoUrl: db.workspace.logoUrl });
});

app.delete("/api/workspace/logo", (req, res) => {
  if (db.workspace.logoUrl) {
    const old = path.join(__dirname, db.workspace.logoUrl.replace(/^\//, ""));
    try { if (fs.existsSync(old)) fs.unlinkSync(old); } catch {}
    db.workspace.logoUrl = null;
    saveData(db);
  }
  res.json({ ok: true });
});

// ── TASKS ────────────────────────────────────────────────────────────────────
app.get("/api/tasks", (req, res) => res.json(db.tasks));
app.post("/api/tasks", (req, res) => {
  const task = { ...req.body, id: uuid() };
  db.tasks.push(task);
  saveData(db);
  res.status(201).json(task);
});
app.put("/api/tasks/:id", (req, res) => {
  db.tasks = db.tasks.map(t => t.id === req.params.id ? { ...t, ...req.body } : t);
  saveData(db);
  res.json(db.tasks.find(t => t.id === req.params.id));
});
app.delete("/api/tasks/:id", (req, res) => {
  db.tasks = db.tasks.filter(t => t.id !== req.params.id);
  saveData(db);
  res.json({ ok: true });
});

// ── PROJECTS ─────────────────────────────────────────────────────────────────
app.get("/api/projects", (req, res) => res.json(db.projects));
app.post("/api/projects", (req, res) => {
  const project = { ...req.body, id: uuid() };
  db.projects.push(project);
  saveData(db);
  res.status(201).json(project);
});
app.delete("/api/projects/:id", (req, res) => {
  db.projects = db.projects.filter(p => p.id !== req.params.id);
  saveData(db);
  res.json({ ok: true });
});

// ── MEMBERS ──────────────────────────────────────────────────────────────────
app.get("/api/members", (req, res) => res.json(db.members));
app.put("/api/members/:id", (req, res) => {
  db.members = db.members.map(m => m.id === req.params.id ? { ...m, ...req.body } : m);
  saveData(db);
  res.json(db.members.find(m => m.id === req.params.id));
});
app.delete("/api/members/:id", (req, res) => {
  db.members = db.members.filter(m => m.id !== req.params.id);
  saveData(db);
  res.json({ ok: true });
});

// ── Catch-all → React ────────────────────────────────────────────────────────
if (fs.existsSync(BUILD)) {
  app.get("*", (req, res) => res.sendFile(path.join(BUILD, "index.html")));
}

app.listen(PORT, () => console.log(`FlexiBoards API running on :${PORT}`));
