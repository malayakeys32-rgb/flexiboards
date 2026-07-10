# FlexiBoards — Full Stack Deployment

Cyberpunk-themed visual task manager (Kanban + List) with admin portal, company branding, and REST API.

---

## 📁 Project Structure

```
flexiboards-deploy/
├── frontend/          ← React app (CRA)
│   ├── src/
│   │   ├── App.jsx            ← Auth gate + WorkspaceContext
│   │   ├── api.js             ← All API calls centralised
│   │   └── components/
│   │       ├── Login.jsx      ← Dynamic logo/name from API
│   │       ├── FlexiBoards.jsx ← Main app shell
│   │       └── Settings.jsx   ← Workspace, profile, security, etc.
│   └── public/index.html
├── backend/           ← Express API
│   ├── server.js      ← All routes + file serving
│   ├── uploads/       ← Logo uploads stored here
│   └── data.json      ← Auto-created on first run
├── render.yaml        ← Deploy both services on Render
└── README.md
```

---

## 🔐 Admin Login

| Field    | Value                      |
|----------|----------------------------|
| Email    | `admin@flexiboards.com`    |
| Password | `Admin@2026!`              |

---

## 🚀 Deploy on Render (Recommended)

### Option A — render.yaml (auto-deploy both services)

1. Push this folder to a GitHub repo
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint**
3. Connect your repo — Render reads `render.yaml` and creates both services automatically
4. Set the frontend env var `REACT_APP_API_URL` to your backend URL:
   e.g. `https://flexiboards-api.onrender.com`

### Option B — Manual (two separate services)

**Backend:**
- New → Web Service → root dir: `backend`
- Build: `npm install`
- Start: `npm start`
- Add env var: `PORT=4000`

**Frontend:**
- New → Web Service → root dir: `frontend`
- Build: `npm install && npm run build`
- Start: `npx serve -s build -l 3000`
- Add env var: `REACT_APP_API_URL=https://YOUR-BACKEND.onrender.com`

---

## 💻 Local Development

### Backend
```bash
cd backend
npm install
npm start          # Runs on :4000
```

### Frontend
```bash
cd frontend
npm install
npm start          # Runs on :3000, proxies /api → :4000
```

The `"proxy": "http://localhost:4000"` in `frontend/package.json` handles local API routing automatically.

---

## ⚙️ Settings → Workspace

- **Company Name** — changes the name in sidebar, login page, and browser tab in real time
- **Logo Upload** — drag & drop or click to upload PNG/JPG/SVG/WebP (max 5MB)
  - Logo appears in: sidebar header, login screen avatar, and browser favicon area
  - Stored in `backend/uploads/` and served at `/uploads/<filename>`
  - Old logo is automatically deleted when a new one is uploaded

---

## 🔌 API Endpoints

| Method | Path                    | Description              |
|--------|-------------------------|--------------------------|
| POST   | /api/auth/login         | Admin login              |
| GET    | /api/workspace          | Get company name + logo  |
| PUT    | /api/workspace          | Update company name      |
| POST   | /api/workspace/logo     | Upload logo (multipart)  |
| DELETE | /api/workspace/logo     | Remove logo              |
| GET    | /api/tasks              | List all tasks           |
| POST   | /api/tasks              | Create task              |
| PUT    | /api/tasks/:id          | Update task              |
| DELETE | /api/tasks/:id          | Delete task              |
| GET    | /api/projects           | List projects            |
| POST   | /api/projects           | Create project           |
| DELETE | /api/projects/:id       | Delete project           |
| GET    | /api/members            | List members             |
| PUT    | /api/members/:id        | Update member role       |
| DELETE | /api/members/:id        | Remove member            |

---

## 🎨 Tech Stack

- **Frontend:** React 18, CRA, localStorage fallback, WorkspaceContext
- **Backend:** Node.js, Express, Multer (file uploads), data.json persistence
- **Styling:** Pure inline CSS, Inter font, neon cyberpunk theme
- **Deploy:** Render (free tier compatible)
