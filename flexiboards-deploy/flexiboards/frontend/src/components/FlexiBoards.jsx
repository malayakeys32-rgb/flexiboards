import React, { useState, useEffect, useRef } from "react";
import Settings from "./Settings";
import { useWorkspace } from "../App";

const PINK = "#d63384";
const CYAN = "#0dcaf0";
const DARK = "#0d0d1a";

const TAG_STYLES = {
  design:    { bg:"#FBEAF022", color:"#f472b6" },
  dev:       { bg:"#E6F1FB22", color:CYAN      },
  marketing: { bg:"#EAF3DE22", color:"#86efac" },
  data:      { bg:"#FAEEDA22", color:"#fcd34d" },
  research:  { bg:"#EEEDFE22", color:"#a78bfa" },
  ops:       { bg:"#E1F5EE22", color:"#6ee7b7" },
};

const PRIORITY_COLORS = { high:"#E24B4A", med:"#EF9F27", low:"#63991A" };
const PRIORITY_LABELS = { high:"High", med:"Medium", low:"Low" };

const COLUMNS = [
  { id:"backlog",    label:"Backlog",     color:"#888780" },
  { id:"todo",       label:"To Do",       color:CYAN      },
  { id:"inprogress", label:"In Progress", color:PINK      },
  { id:"review",     label:"Review",      color:"#EF9F27" },
  { id:"done",       label:"Done",        color:"#63991A" },
];

const AVATAR_COLORS = [PINK, CYAN, "#534AB7", "#1D9E75", "#D85A30", "#185FA5"];

const DEFAULT_TASKS = [
  { id:1,  col:"backlog",    title:"Redesign onboarding flow",    tag:"design",    due:"2026-06-20", priority:"high", assignees:["KL","MB"], checklist:[{text:"Wireframes",done:true},{text:"Hi-fi mockups",done:false},{text:"Prototype",done:false}] },
  { id:2,  col:"backlog",    title:"Keyword research for Q3",     tag:"marketing", due:"2026-06-25", priority:"med",  assignees:["SR"],       checklist:[{text:"Competitor audit",done:false},{text:"Seed keywords",done:false}] },
  { id:3,  col:"todo",       title:"Build component library",     tag:"dev",       due:"2026-06-18", priority:"high", assignees:["JD"],       checklist:[{text:"Buttons",done:true},{text:"Forms",done:true},{text:"Tables",done:false}] },
  { id:4,  col:"todo",       title:"Write API documentation",     tag:"dev",       due:"2026-06-22", priority:"med",  assignees:["MB"],       checklist:[{text:"Auth endpoints",done:true},{text:"Webhooks",done:false}] },
  { id:5,  col:"inprogress", title:"Dashboard analytics charts", tag:"data",      due:"2026-06-14", priority:"high", assignees:["TN"],       checklist:[{text:"Bar chart",done:true},{text:"Line chart",done:true},{text:"Export CSV",done:false}] },
  { id:6,  col:"inprogress", title:"Brand refresh assets",       tag:"design",    due:"2026-06-13", priority:"high", assignees:["KL"],       checklist:[{text:"Logo variants",done:true},{text:"Color system",done:true},{text:"Guidelines PDF",done:false}] },
  { id:7,  col:"review",     title:"SEO meta tag audit",         tag:"marketing", due:"2026-06-12", priority:"med",  assignees:["SR"],       checklist:[{text:"Crawl site",done:true},{text:"Fix duplicates",done:true},{text:"Sign-off",done:false}] },
  { id:8,  col:"done",       title:"Set up CI/CD pipeline",      tag:"dev",       due:"2026-06-05", priority:"med",  assignees:["JD"],       checklist:[{text:"GitHub Actions",done:true},{text:"Staging",done:true},{text:"Production",done:true}] },
  { id:9,  col:"done",       title:"Q2 performance report",      tag:"data",      due:"2026-06-08", priority:"low",  assignees:["MB","SR"],  checklist:[{text:"Data pull",done:true},{text:"Analysis",done:true},{text:"Slides",done:true}] },
];

const DEFAULT_PROJECTS = [
  { id:"p1", name:"Website Relaunch", color:PINK      },
  { id:"p2", name:"Mobile App v2",    color:CYAN      },
  { id:"p3", name:"Q3 Marketing",     color:"#534AB7" },
];

const DEFAULT_MEMBERS = [
  { id:"m1", initials:"JD", name:"Jane Doe",   role:"Admin",  email:"jane@example.com",  status:"online"  },
  { id:"m2", initials:"KL", name:"Kim Lee",     role:"Editor", email:"kim@example.com",   status:"online"  },
  { id:"m3", initials:"MB", name:"Marco Bruno", role:"Editor", email:"marco@example.com", status:"away"    },
  { id:"m4", initials:"SR", name:"Sara Rivera", role:"Viewer", email:"sara@example.com",  status:"offline" },
  { id:"m5", initials:"TN", name:"Tom Nguyen",  role:"Editor", email:"tom@example.com",   status:"online"  },
];

function useStorage(key, def) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

/* ── Atoms ─────────────────────────────────────────────────────────────────── */
function Avatar({ initials, index = 0, size = 22 }) {
  const c = AVATAR_COLORS[Math.abs((initials.charCodeAt(0)||0)+(initials.charCodeAt(1)||0)) % AVATAR_COLORS.length];
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:c, display:"flex", alignItems:"center",
      justifyContent:"center", fontSize:size*0.38, fontWeight:700, color:"#fff",
      border:"2px solid rgba(0,0,0,0.6)", marginLeft:index>0?-6:0, flexShrink:0,
      boxShadow:`0 0 8px ${c}66` }}>
      {initials}
    </div>
  );
}

function NeonTag({ name }) {
  const s = TAG_STYLES[name] || TAG_STYLES.dev;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", fontSize:10, fontWeight:700,
      padding:"2px 8px", borderRadius:10, background:s.bg, color:s.color,
      textTransform:"uppercase", letterSpacing:"0.06em", border:`1px solid ${s.color}33` }}>
      {name}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, color:PRIORITY_COLORS[priority] }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:PRIORITY_COLORS[priority],
        boxShadow:`0 0 6px ${PRIORITY_COLORS[priority]}` }}/>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

function ChecklistProgress({ items }) {
  const done  = items.filter(i=>i.done).length;
  const total = items.length;
  const pct   = total ? Math.round((done/total)*100) : 0;
  const color = pct===100 ? "#63991A" : CYAN;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8, paddingTop:8,
      borderTop:"1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)", minWidth:28 }}>{done}/{total}</span>
      <div style={{ flex:1, height:3, background:"rgba(255,255,255,0.08)", borderRadius:2 }}>
        <div style={{ width:`${pct}%`, height:"100%", borderRadius:2, background:color,
          boxShadow:`0 0 6px ${color}`, transition:"width 0.3s" }}/>
      </div>
      <span style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>{pct}%</span>
    </div>
  );
}

/* ── Card ───────────────────────────────────────────────────────────────────── */
function Card({ task, onEdit, onDelete, isDragging }) {
  const isOverdue = task.col!=="done" && new Date(task.due)<new Date(new Date().toDateString());
  const dueLabel  = new Date(task.due).toLocaleDateString("en-US",{month:"short",day:"numeric"});
  return (
    <div draggable
      onDragStart={e=>{ e.dataTransfer.setData("taskId",String(task.id)); e.dataTransfer.effectAllowed="move"; }}
      style={{
        background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"12px 14px",
        border:`1px solid rgba(255,255,255,0.08)`, cursor:"grab",
        opacity:isDragging?0.3:1, transition:"all 0.15s",
        boxShadow:isDragging?"none":"0 2px 16px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${PINK}55`; e.currentTarget.style.boxShadow=`0 4px 24px ${PINK}22`;}}
      onMouseLeave={e=>{e.currentTarget.style.border="1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow="0 2px 16px rgba(0,0,0,0.3)";}}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
        <NeonTag name={task.tag}/>
        <div style={{ display:"flex", gap:2, marginLeft:4 }}>
          <button onClick={()=>onEdit(task)} style={{ background:"none",border:"none",cursor:"pointer",padding:3,color:"rgba(255,255,255,0.3)",fontSize:12,borderRadius:4 }} title="Edit">✏️</button>
          <button onClick={()=>onDelete(task.id)} style={{ background:"none",border:"none",cursor:"pointer",padding:3,color:"rgba(255,255,255,0.3)",fontSize:12,borderRadius:4 }} title="Delete">🗑</button>
        </div>
      </div>
      <div style={{ fontSize:13, fontWeight:600, color:task.col==="done"?"rgba(255,255,255,0.4)":"#fff",
        lineHeight:1.45, marginBottom:10, textDecoration:task.col==="done"?"line-through":"none" }}>
        {task.title}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontSize:11, color:isOverdue?"#ff7070":"rgba(255,255,255,0.4)", display:"flex", alignItems:"center", gap:3 }}>
          {isOverdue?"⚠️":"📅"} {dueLabel}
        </span>
        <div style={{ display:"flex" }}>
          {task.assignees.slice(0,3).map((a,i)=><Avatar key={a} initials={a} index={i}/>)}
        </div>
      </div>
      <PriorityBadge priority={task.priority}/>
      {task.checklist?.length>0 && <ChecklistProgress items={task.checklist}/>}
    </div>
  );
}

/* ── Column ─────────────────────────────────────────────────────────────────── */
function Column({ col, tasks, onEdit, onDelete, onAddTask, draggingId, onDrop }) {
  const [over, setOver] = useState(false);
  return (
    <div style={{ minWidth:230, maxWidth:230, display:"flex", flexDirection:"column", gap:8,
      background:"rgba(255,255,255,0.03)", borderRadius:14, padding:12,
      border:`1px solid rgba(255,255,255,0.06)`, borderTop:`3px solid ${col.color}` }}
      onDragOver={e=>{e.preventDefault();setOver(true);}}
      onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOver(false);}}
      onDrop={e=>{e.preventDefault();setOver(false);onDrop(parseInt(e.dataTransfer.getData("taskId")),col.id);}}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:8 }}>
        <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)", display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:col.color, boxShadow:`0 0 8px ${col.color}` }}/>
          {col.label}
        </span>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ fontSize:11, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:10, padding:"1px 8px", color:"rgba(255,255,255,0.4)" }}>{tasks.length}</span>
          <button onClick={()=>onAddTask(col.id)} style={{ background:"none",border:"none",cursor:"pointer",
            color:"rgba(255,255,255,0.4)",fontSize:18,lineHeight:1,padding:"0 2px" }}>+</button>
        </div>
      </div>
      <div style={{ minHeight:over?60:4, borderRadius:8, transition:"all 0.15s",
        background:over?`${CYAN}15`:"transparent", border:over?`1.5px dashed ${CYAN}66`:"1.5px dashed transparent" }}/>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {tasks.map(t=><Card key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} isDragging={draggingId===t.id}/>)}
      </div>
    </div>
  );
}

/* ── List Row ───────────────────────────────────────────────────────────────── */
function ListRow({ task, onEdit, onDelete }) {
  const col      = COLUMNS.find(c=>c.id===task.col);
  const dueLabel = new Date(task.due).toLocaleDateString("en-US",{month:"short",day:"numeric"});
  const isOver   = task.col!=="done" && new Date(task.due)<new Date(new Date().toDateString());
  const done     = task.checklist?.filter(i=>i.done).length||0;
  const total    = task.checklist?.length||0;
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 110px 76px 86px 68px 54px 56px",
      gap:8, padding:"10px 14px", borderRadius:8, alignItems:"center", fontSize:13, cursor:"pointer",
      borderBottom:"1px solid rgba(255,255,255,0.04)", transition:"background 0.15s" }}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
      onClick={()=>onEdit(task)}>
      <span style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ width:14,height:14,borderRadius:4,
          border:`1.5px solid ${task.col==="done"?"#63991A":"rgba(255,255,255,0.2)"}`,
          background:task.col==="done"?"#63991A":"transparent",
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
          boxShadow:task.col==="done"?"0 0 8px #63991A":""  }}>
          {task.col==="done"&&<span style={{color:"#fff",fontSize:9,lineHeight:1}}>✓</span>}
        </span>
        <span style={{ fontWeight:500, color:task.col==="done"?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.9)",
          textDecoration:task.col==="done"?"line-through":"none" }}>{task.title}</span>
      </span>
      <span><span style={{ fontSize:11,padding:"2px 8px",borderRadius:10,
        background:`${col?.color}22`,color:col?.color,fontWeight:600,
        boxShadow:`0 0 8px ${col?.color}33` }}>{col?.label}</span></span>
      <span style={{ fontSize:12,color:isOver?"#ff7070":"rgba(255,255,255,0.4)" }}>{dueLabel}</span>
      <PriorityBadge priority={task.priority}/>
      <div style={{ display:"flex" }}>{task.assignees.slice(0,3).map((a,i)=><Avatar key={a} initials={a} index={i} size={20}/>)}</div>
      <span style={{ fontSize:11,color:"rgba(255,255,255,0.3)" }}>{done}/{total}</span>
      <div style={{ display:"flex",gap:3 }}>
        <button onClick={e=>{e.stopPropagation();onEdit(task);}} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.3)",fontSize:12,padding:2}}>✏️</button>
        <button onClick={e=>{e.stopPropagation();onDelete(task.id);}} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.3)",fontSize:12,padding:2}}>🗑</button>
      </div>
    </div>
  );
}

/* ── Task Modal ─────────────────────────────────────────────────────────────── */
function TaskModal({ task, onSave, onClose }) {
  const isNew = !task.id;
  const [form, setForm] = useState(task||{col:"todo",title:"",tag:"dev",due:new Date().toISOString().split("T")[0],priority:"med",assignees:[],checklist:[]});
  const [newItem, setNewItem] = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const addItem = () => { if(!newItem.trim()) return; set("checklist",[...form.checklist,{text:newItem.trim(),done:false}]); setNewItem(""); };

  const fld = (label,key,type="text",placeholder="") => (
    <div style={{marginBottom:16}}>
      <label style={{display:"block",fontSize:11,fontWeight:700,color:CYAN,marginBottom:6,letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</label>
      <input type={type} value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={placeholder}
        style={{width:"100%",padding:"11px 13px",borderRadius:9,boxSizing:"border-box",
          border:`1px solid rgba(255,255,255,0.12)`,background:"rgba(0,0,0,0.5)",
          color:"#fff",fontSize:13,outline:"none"}}/>
    </div>
  );

  const sel = (label,key,opts) => (
    <div style={{marginBottom:16}}>
      <label style={{display:"block",fontSize:11,fontWeight:700,color:CYAN,marginBottom:6,letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</label>
      <select value={form[key]} onChange={e=>set(key,e.target.value)}
        style={{width:"100%",padding:"11px 13px",borderRadius:9,background:"rgba(0,0,0,0.5)",
          border:`1px solid rgba(255,255,255,0.12)`,color:"#fff",fontSize:13,outline:"none"}}>
        {opts.map(o=><option key={o.v} value={o.v} style={{background:"#111"}}>{o.l}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div style={{background:"#0d0d1a",borderRadius:16,padding:"28px 32px",width:500,maxHeight:"90vh",
        overflowY:"auto",boxShadow:`0 0 60px ${PINK}33,0 0 120px ${CYAN}11`,
        border:`1px solid rgba(255,255,255,0.12)`}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <h2 style={{fontSize:18,fontWeight:800,color:CYAN,textShadow:`0 0 14px ${CYAN}`,margin:0}}>{isNew?"New Task":"Edit Task"}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"rgba(255,255,255,0.4)"}}>✕</button>
        </div>
        {fld("Title","title","text","Task title…")}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {sel("Column","col",COLUMNS.map(c=>({v:c.id,l:c.label})))}
          {sel("Tag","tag",Object.keys(TAG_STYLES).map(t=>({v:t,l:t})))}
          {sel("Priority","priority",[{v:"high",l:"High"},{v:"med",l:"Medium"},{v:"low",l:"Low"}])}
          {fld("Due Date","due","date")}
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:CYAN,marginBottom:6,letterSpacing:"0.06em",textTransform:"uppercase"}}>Assignees</label>
          <input value={form.assignees.join(", ")} onChange={e=>set("assignees",e.target.value.split(",").map(s=>s.trim().toUpperCase().slice(0,2)).filter(Boolean))}
            placeholder="JD, KL, MB"
            style={{width:"100%",padding:"11px 13px",borderRadius:9,boxSizing:"border-box",border:`1px solid rgba(255,255,255,0.12)`,background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:13,outline:"none"}}/>
        </div>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:CYAN,marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>Checklist</label>
        {form.checklist.map((item,idx)=>(
          <div key={idx} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7,fontSize:13}}>
            <input type="checkbox" checked={item.done} onChange={()=>set("checklist",form.checklist.map((x,i)=>i===idx?{...x,done:!x.done}:x))} style={{accentColor:PINK}}/>
            <span style={{flex:1,color:item.done?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.8)",textDecoration:item.done?"line-through":"none"}}>{item.text}</span>
            <button onClick={()=>set("checklist",form.checklist.filter((_,i)=>i!==idx))} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.3)",fontSize:14}}>✕</button>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginBottom:24}}>
          <input value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()} placeholder="Add checklist item…"
            style={{flex:1,padding:"10px 12px",borderRadius:9,border:`1px solid rgba(255,255,255,0.12)`,background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:13,outline:"none"}}/>
          <button onClick={addItem} style={{background:PINK,color:"#fff",border:"none",borderRadius:9,padding:"10px 16px",cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:`0 0 12px ${PINK}55`}}>Add</button>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{background:"none",border:"1px solid rgba(255,255,255,0.15)",borderRadius:9,padding:"10px 20px",cursor:"pointer",fontSize:13,color:"rgba(255,255,255,0.5)"}}>Cancel</button>
          <button onClick={()=>{if(!form.title.trim())return;onSave(form);}} style={{background:`linear-gradient(135deg,${PINK},${CYAN})`,color:"#fff",border:"none",borderRadius:9,padding:"10px 24px",cursor:"pointer",fontSize:13,fontWeight:800,boxShadow:`0 0 24px ${PINK}55`}}>
            {isNew?"Create Task":"Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard ──────────────────────────────────────────────────────────────── */
function Dashboard({ tasks, projects, members }) {
  const total   = tasks.length;
  const done    = tasks.filter(t=>t.col==="done").length;
  const overdue = tasks.filter(t=>t.col!=="done"&&new Date(t.due)<new Date(new Date().toDateString())).length;
  const high    = tasks.filter(t=>t.priority==="high"&&t.col!=="done").length;

  return (
    <div style={{padding:"28px 28px",overflowY:"auto",flex:1}}>
      <h2 style={{fontSize:22,fontWeight:800,color:CYAN,textShadow:`0 0 18px ${CYAN}`,marginBottom:6}}>Dashboard</h2>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:28}}>High-level overview of your workspace activity.</p>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {[[total,"Total Tasks","#fff"],[done,"Completed","#63991A"],[overdue,"Overdue","#E24B4A"],[high,"High Priority",PINK]].map(([val,label,color])=>(
          <div key={label} style={{padding:"18px 20px",borderRadius:14,
            background:"rgba(255,255,255,0.04)",border:`1px solid ${color}33`,
            boxShadow:`0 0 20px ${color}11`}}>
            <div style={{fontSize:28,fontWeight:900,color,textShadow:`0 0 14px ${color}`}}>{val}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:4}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <h3 style={{color:PINK,fontSize:15,fontWeight:700,marginBottom:14}}>Projects</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>
        {projects.map(p=>{
          const ptasks = tasks.filter(()=>true);
          return (
            <div key={p.id} style={{padding:"14px 16px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:`1px solid ${p.color}33`,boxShadow:`0 0 16px ${p.color}11`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{width:10,height:10,borderRadius:"50%",background:p.color,boxShadow:`0 0 8px ${p.color}`}}/>
                <span style={{fontWeight:700,fontSize:13}}>{p.name}</span>
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Active project</div>
            </div>
          );
        })}
      </div>

      {/* Recent activity */}
      <h3 style={{color:PINK,fontSize:15,fontWeight:700,marginBottom:14}}>Recent Activity</h3>
      {[
        "Jane moved 'Landing Page' to In Progress.",
        "Alex created board 'Q3 Ops Planning'.",
        "Team completed 8 tasks today.",
        "Sara was invited to the workspace.",
        "Tom updated 'Dashboard analytics charts'.",
      ].map(text=>(
        <div key={text} style={{padding:"11px 14px",marginBottom:8,borderRadius:10,
          background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",
          fontSize:13,color:"rgba(255,255,255,0.6)",display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:CYAN}}>↗</span> {text}
        </div>
      ))}
    </div>
  );
}

/* ── Members Page ───────────────────────────────────────────────────────────── */
function MembersPage({ members, setMembers }) {
  const statusColor = { online:"#63991A", away:"#EF9F27", offline:"#888780" };
  return (
    <div style={{padding:"28px 28px",overflowY:"auto",flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,color:CYAN,textShadow:`0 0 18px ${CYAN}`,marginBottom:4}}>Members</h2>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Manage your workspace team.</p>
        </div>
        <button style={{background:`linear-gradient(135deg,${PINK},${CYAN})`,color:"#fff",border:"none",borderRadius:10,padding:"10px 18px",cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:`0 0 20px ${PINK}55`}}>+ Invite Member</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {members.map(m=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",boxShadow:`0 0 14px ${CYAN}08`}}>
            <Avatar initials={m.initials} index={0} size={40}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14}}>{m.name}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2,display:"flex",alignItems:"center",gap:6}}>
                {m.email}
                <span style={{width:6,height:6,borderRadius:"50%",background:statusColor[m.status],boxShadow:`0 0 6px ${statusColor[m.status]}`}}/>
                <span style={{color:statusColor[m.status]}}>{m.status}</span>
              </div>
            </div>
            <select value={m.role} onChange={e=>setMembers(ms=>ms.map(x=>x.id===m.id?{...x,role:e.target.value}:x))}
              style={{padding:"7px 10px",borderRadius:8,background:"rgba(255,255,255,0.08)",border:`1px solid rgba(255,255,255,0.12)`,color:"#fff",fontSize:12,outline:"none",cursor:"pointer"}}>
              <option style={{background:"#111"}}>Admin</option>
              <option style={{background:"#111"}}>Editor</option>
              <option style={{background:"#111"}}>Viewer</option>
            </select>
            <button onClick={()=>{if(window.confirm(`Remove ${m.name}?`))setMembers(ms=>ms.filter(x=>x.id!==m.id));}}
              style={{padding:"7px 12px",borderRadius:8,border:"1px solid rgba(226,75,74,0.4)",background:"rgba(226,75,74,0.1)",color:"#ff7070",cursor:"pointer",fontSize:12,fontWeight:600}}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Integrations Page ──────────────────────────────────────────────────────── */
function IntegrationsPage() {
  const [connected, setConnected] = useState({ slack:true, github:false, google:false, zapier:false, notion:false });
  const items = [
    { key:"slack",  name:"Slack",           icon:"🟣", desc:"Get task notifications in Slack channels." },
    { key:"github", name:"GitHub",          icon:"🐙", desc:"Link pull requests and issues to tasks."   },
    { key:"google", name:"Google Calendar", icon:"🔵", desc:"Sync task due dates to your calendar."     },
    { key:"zapier", name:"Zapier",          icon:"🟠", desc:"Automate workflows with 5000+ apps."       },
    { key:"notion", name:"Notion",          icon:"⬜", desc:"Import and export pages as tasks."          },
  ];
  return (
    <div style={{padding:"28px 28px",overflowY:"auto",flex:1}}>
      <h2 style={{fontSize:22,fontWeight:800,color:CYAN,textShadow:`0 0 18px ${CYAN}`,marginBottom:6}}>Integrations</h2>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:28}}>Connect FlexiBoards to your existing tools.</p>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {items.map(({key,name,icon,desc})=>(
          <div key={key} style={{display:"flex",alignItems:"center",gap:14,padding:"18px 20px",borderRadius:14,
            background:"rgba(255,255,255,0.04)",border:`1px solid ${connected[key]?CYAN+"33":"rgba(255,255,255,0.08)"}`,
            boxShadow:connected[key]?`0 0 20px ${CYAN}11`:"none",transition:"all 0.2s"}}>
            <span style={{fontSize:26,flexShrink:0}}>{icon}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14}}>{name}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:3}}>{desc}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              {connected[key]&&<span style={{fontSize:11,color:CYAN}}>✓ Connected</span>}
              <button onClick={()=>setConnected(c=>({...c,[key]:!c[key]}))} style={{
                padding:"8px 16px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
                background:connected[key]?"rgba(226,75,74,0.15)":`linear-gradient(135deg,${PINK},${CYAN})`,
                color:connected[key]?"#ff7070":"#fff",
                border:connected[key]?"1px solid rgba(226,75,74,0.4)":"none",
                boxShadow:connected[key]?"none":`0 0 14px ${PINK}44`,
              }}>{connected[key]?"Disconnect":"Connect"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────────────────── */
function Sidebar({ projects, activeProject, onSelectProject, onAddProject, page, onNav }) {
  const [collapsed, setCollapsed] = useState(false);
  const { workspace } = useWorkspace();
  const API_BASE = process.env.REACT_APP_API_URL || "";
  const wsName = workspace?.name || "FlexiBoards";
  const logoSrc = workspace?.logoUrl ? `${API_BASE}${workspace.logoUrl}` : null;
  const w = collapsed ? 58 : 210;
  const NAV = [
    { id:"dashboard",    icon:"🏠", label:"Dashboard"   },
    { id:"board",        icon:"⬛", label:"My Board"    },
    { id:"members",      icon:"👥", label:"Members"     },
    { id:"integrations", icon:"🔌", label:"Integrations"},
  ];
  return (
    <div style={{ width:w, background:"rgba(0,0,0,0.6)", display:"flex", flexDirection:"column",
      padding:"14px 8px", gap:2, flexShrink:0, transition:"width 0.2s", overflow:"hidden",
      borderRight:"1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:collapsed?"center":"space-between",
        padding:"2px 4px 14px", gap:8 }}>
        {!collapsed && (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30,height:30,borderRadius:9,flexShrink:0,overflow:"hidden",
              background:logoSrc?"rgba(255,255,255,0.06)":`linear-gradient(135deg,${CYAN},${PINK})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontWeight:900,fontSize:11,color:"#fff",boxShadow:`0 0 16px ${PINK}66` }}>
              {logoSrc ? <img src={logoSrc} alt="logo" style={{width:"100%",height:"100%",objectFit:"contain"}}/> : wsName.substring(0,2).toUpperCase()}
            </div>
            <span style={{ fontWeight:900,fontSize:14,color:"#fff",letterSpacing:"-0.03em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:130 }}>{wsName}</span>
          </div>
        )}
        <button onClick={()=>setCollapsed(s=>!s)} style={{ background:"none",border:"none",cursor:"pointer",
          color:"rgba(255,255,255,0.3)",fontSize:14,padding:4,borderRadius:6,flexShrink:0 }}
          title={collapsed?"Expand":"Collapse"}>{collapsed?"▶":"◀"}</button>
      </div>

      {NAV.map(n=>(
        <button key={n.id} onClick={()=>onNav(n.id)} style={{
          background:page===n.id?`${PINK}22`:"transparent",
          border:"none",borderRadius:9,padding:"9px 10px",cursor:"pointer",
          display:"flex",alignItems:"center",gap:8,width:"100%",
          boxShadow:page===n.id?`inset 3px 0 0 ${PINK}`:"none",
        }}>
          <span style={{ fontSize:15,flexShrink:0 }}>{n.icon}</span>
          {!collapsed && <span style={{ fontSize:13,color:page===n.id?CYAN:"rgba(255,255,255,0.5)",
            fontWeight:page===n.id?700:400,whiteSpace:"nowrap",
            textShadow:page===n.id?`0 0 10px ${CYAN}`:"none" }}>{n.label}</span>}
        </button>
      ))}

      {!collapsed && (
        <div style={{ marginTop:16 }}>
          <div style={{ fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.2)",
            padding:"0 8px 8px",textTransform:"uppercase",letterSpacing:"0.1em" }}>Projects</div>
          {projects.map(p=>(
            <button key={p.id} onClick={()=>{onNav("board");onSelectProject(p.id);}} style={{
              background:activeProject===p.id&&page==="board"?`${p.color}18`:"transparent",
              border:"none",borderRadius:9,padding:"8px 10px",cursor:"pointer",
              display:"flex",alignItems:"center",gap:8,width:"100%",
            }}>
              <span style={{ width:8,height:8,borderRadius:"50%",background:p.color,flexShrink:0,boxShadow:`0 0 6px ${p.color}` }}/>
              <span style={{ fontSize:13,color:activeProject===p.id&&page==="board"?p.color:"rgba(255,255,255,0.5)",
                fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{p.name}</span>
            </button>
          ))}
          <button onClick={onAddProject} style={{ background:"transparent",border:"1px dashed rgba(255,255,255,0.12)",
            borderRadius:9,padding:"7px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,marginTop:4,width:"100%" }}>
            <span style={{ fontSize:15,color:"rgba(255,255,255,0.3)" }}>+</span>
            <span style={{ fontSize:12,color:"rgba(255,255,255,0.3)" }}>New project</span>
          </button>
        </div>
      )}

      <div style={{ flex:1 }}/>
      <button onClick={()=>onNav("settings")} style={{ background:page==="settings"?`${PINK}22`:"transparent",
        border:"none",borderRadius:9,padding:"9px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,width:"100%",
        boxShadow:page==="settings"?`inset 3px 0 0 ${PINK}`:"none" }}>
        <span style={{ fontSize:15,flexShrink:0 }}>⚙️</span>
        {!collapsed && <span style={{ fontSize:13,color:page==="settings"?CYAN:"rgba(255,255,255,0.5)",fontWeight:page==="settings"?700:400 }}>Settings</span>}
      </button>
    </div>
  );
}

/* ── Top Bar ────────────────────────────────────────────────────────────────── */
function TopBar({ session, onLogout, page, projects, activeProject }) {
  const proj = projects.find(p=>p.id===activeProject);
  const titles = { dashboard:"Dashboard", board:proj?.name||"Board", members:"Members", integrations:"Integrations", settings:"Settings" };
  return (
    <div style={{ height:58,display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"0 22px",background:"rgba(0,0,0,0.7)",borderBottom:"1px solid rgba(255,255,255,0.07)",
      flexShrink:0,boxShadow:`0 1px 0 ${PINK}22` }}>
      <div>
        <span style={{ fontWeight:800,fontSize:16,color:"#fff" }}>{titles[page]||"FlexiBoards"}</span>
        {proj && page==="board" && <span style={{ marginLeft:8,fontSize:11,color:proj.color,padding:"2px 8px",
          borderRadius:10,background:`${proj.color}22`,border:`1px solid ${proj.color}44` }}>{proj.color}</span>}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:12 }}>
        <span style={{ fontSize:12,color:"rgba(255,255,255,0.3)" }}>
          {new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
        </span>
        <div style={{ width:1,height:22,background:"rgba(255,255,255,0.1)" }}/>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${PINK},${CYAN})`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",
            boxShadow:`0 0 12px ${PINK}66` }}>{session.initials}</div>
          <div>
            <div style={{ fontSize:12,fontWeight:700,color:"#fff" }}>{session.name}</div>
            <div style={{ fontSize:10,color:CYAN }}>{session.role}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ padding:"7px 14px",borderRadius:9,
          border:"1px solid rgba(255,255,255,0.12)",background:"transparent",
          color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:12,fontWeight:600,
          transition:"all 0.15s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=PINK;e.currentTarget.style.color=PINK;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";e.currentTarget.style.color="rgba(255,255,255,0.5)";}}>
          Logout
        </button>
      </div>
    </div>
  );
}

/* ── Board View ─────────────────────────────────────────────────────────────── */
function BoardView({ tasks, setTasks, projects, activeProject }) {
  const [view, setView]         = useState("board");
  const [search, setSearch]     = useState("");
  const [filterPri, setPri]     = useState("all");
  const [filterTag, setTag]     = useState("all");
  const [modal, setModal]       = useState(null);
  const [draggingId, setDrag]   = useState(null);
  const nextId = useRef(Math.max(...tasks.map(t=>t.id),0)+1);

  const filtered = tasks.filter(t=>
    (!search||t.title.toLowerCase().includes(search.toLowerCase()))&&
    (filterPri==="all"||t.priority===filterPri)&&
    (filterTag==="all"||t.tag===filterTag)
  );

  const handleDrop  = (id,col) => { setTasks(ts=>ts.map(t=>t.id===id?{...t,col}:t)); setDrag(null); };
  const handleSave  = form => {
    if(!form.title.trim()) return;
    if(form.id) setTasks(ts=>ts.map(t=>t.id===form.id?{...form}:t));
    else        setTasks(ts=>[...ts,{...form,id:nextId.current++}]);
    setModal(null);
  };
  const handleDelete = id => { if(window.confirm("Delete this task?")) setTasks(ts=>ts.filter(t=>t.id!==id)); };
  const openAdd      = (col="todo") => setModal({col,title:"",tag:"dev",due:new Date().toISOString().split("T")[0],priority:"med",assignees:[],checklist:[]});

  const total   = filtered.length;
  const done    = filtered.filter(t=>t.col==="done").length;
  const overdue = filtered.filter(t=>t.col!=="done"&&new Date(t.due)<new Date(new Date().toDateString())).length;
  const high    = filtered.filter(t=>t.priority==="high"&&t.col!=="done").length;

  return (
    <div style={{ display:"flex",flexDirection:"column",flex:1,overflow:"hidden" }}>
      {/* Toolbar */}
      <div style={{ padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",
        background:"rgba(0,0,0,0.3)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10 }}>
        <div style={{ display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" }}>
          <div style={{ display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"7px 12px",width:190 }}>
            <span style={{ color:"rgba(255,255,255,0.3)",fontSize:13 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks…"
              style={{ border:"none",background:"transparent",fontSize:13,color:"#fff",outline:"none",width:"100%" }}/>
          </div>
          {[["Priority",filterPri,setPri,["all","high","med","low"],["All","High","Medium","Low"]],
            ["Tag",filterTag,setTag,["all",...Object.keys(TAG_STYLES)],["All",...Object.keys(TAG_STYLES)]]].map(([name,val,setter,vals,labels])=>(
            <select key={name} value={val} onChange={e=>setter(e.target.value)}
              style={{ border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"7px 10px",
                fontSize:12,color:"rgba(255,255,255,0.6)",background:"rgba(0,0,0,0.5)",cursor:"pointer",outline:"none" }}>
              {vals.map((v,i)=><option key={v} value={v} style={{background:"#111"}}>{labels[i]}</option>)}
            </select>
          ))}
          <button onClick={()=>{setSearch("");setPri("all");setTag("all");}} style={{ background:"transparent",
            border:"1px solid rgba(255,255,255,0.08)",borderRadius:9,padding:"7px 12px",fontSize:12,
            color:"rgba(255,255,255,0.3)",cursor:"pointer" }}>Clear</button>
        </div>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          {["board","list"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{ background:view===v?`${PINK}22`:"transparent",
              border:`1px solid ${view===v?PINK+"55":"rgba(255,255,255,0.1)"}`,borderRadius:9,padding:"7px 14px",
              fontSize:13,cursor:"pointer",color:view===v?CYAN:"rgba(255,255,255,0.4)",fontWeight:view===v?700:400,
              boxShadow:view===v?`0 0 12px ${PINK}33`:"none" }}>
              {v==="board"?"⬛ Board":"≡ List"}
            </button>
          ))}
          <button onClick={()=>openAdd()} style={{ background:`linear-gradient(135deg,${PINK},${CYAN})`,
            color:"#fff",border:"none",borderRadius:9,padding:"8px 18px",fontSize:13,fontWeight:800,
            cursor:"pointer",boxShadow:`0 0 22px ${PINK}55`,display:"flex",alignItems:"center",gap:5 }}>+ Add Task</button>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display:"flex",gap:12,padding:"10px 20px",background:"rgba(0,0,0,0.2)",
        borderBottom:"1px solid rgba(255,255,255,0.04)",flexShrink:0,flexWrap:"wrap" }}>
        {[[total,"Tasks","#fff"],[done,"Done","#63991A"],[overdue,"Overdue","#E24B4A"],[high,"High Pri",PINK]].map(([val,label,color])=>(
          <div key={label} style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 12px",
            borderRadius:8,background:`${color}11`,border:`1px solid ${color}22` }}>
            <span style={{ fontSize:15,fontWeight:800,color }}>{val}</span>
            <span style={{ fontSize:11,color:"rgba(255,255,255,0.3)" }}>{label}</span>
          </div>
        ))}
        <span style={{ marginLeft:"auto",fontSize:11,color:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center" }}>{filtered.length} task{filtered.length!==1?"s":""}</span>
      </div>

      {/* Board */}
      {view==="board" && (
        <div style={{ display:"flex",gap:12,padding:20,overflowX:"auto",flex:1,alignItems:"flex-start" }}>
          {COLUMNS.map(col=>(
            <Column key={col.id} col={col} tasks={filtered.filter(t=>t.col===col.id)}
              onEdit={setModal} onDelete={handleDelete} onAddTask={openAdd}
              draggingId={draggingId} onDrop={handleDrop}/>
          ))}
        </div>
      )}

      {/* List */}
      {view==="list" && (
        <div style={{ flex:1,overflowY:"auto" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 110px 76px 86px 68px 54px 56px",
            gap:8,padding:"9px 14px",fontSize:11,color:"rgba(255,255,255,0.3)",fontWeight:700,
            borderBottom:"1px solid rgba(255,255,255,0.06)",textTransform:"uppercase",letterSpacing:"0.05em" }}>
            <span>Task</span><span>Status</span><span>Due</span><span>Priority</span><span>Assignee</span><span>Progress</span><span>Actions</span>
          </div>
          {COLUMNS.map(col=>{
            const colTasks = filtered.filter(t=>t.col===col.id);
            if(!colTasks.length) return null;
            return (
              <div key={col.id}>
                <div style={{ padding:"10px 14px 4px",fontSize:11,fontWeight:800,color:col.color,
                  display:"flex",alignItems:"center",gap:6,textTransform:"uppercase",letterSpacing:"0.08em",
                  textShadow:`0 0 10px ${col.color}` }}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:col.color,boxShadow:`0 0 6px ${col.color}`}}/>{col.label} ({colTasks.length})
                </div>
                {colTasks.map(t=><ListRow key={t.id} task={t} onEdit={setModal} onDelete={handleDelete}/>)}
              </div>
            );
          })}
        </div>
      )}

      {modal && <TaskModal task={modal} onSave={handleSave} onClose={()=>setModal(null)}/>}
    </div>
  );
}

/* ── Main FlexiBoards export ────────────────────────────────────────────────── */
export default function FlexiBoards({ session, onLogout }) {
  const [tasks,      setTasks]      = useStorage("fb-tasks",    DEFAULT_TASKS);
  const [projects,   setProjects]   = useStorage("fb-projects", DEFAULT_PROJECTS);
  const [members,    setMembers]    = useStorage("fb-members",  DEFAULT_MEMBERS);
  const [activeProj, setActiveProj] = useStorage("fb-project",  "p1");
  const [page,       setPage]       = useState("dashboard");

  const handleAddProject = () => {
    const name = window.prompt("Project name:");
    if(!name) return;
    const colors = [PINK,CYAN,"#534AB7","#1D9E75","#EF9F27"];
    const color  = colors[projects.length%colors.length];
    const id     = "p"+Date.now();
    setProjects(ps=>[...ps,{id,name,color}]);
    setActiveProj(id);
    setPage("board");
  };

  return (
    <div style={{ display:"flex",height:"100vh",fontFamily:"'Inter',sans-serif",
      background:`radial-gradient(ellipse at 20% 20%,#1a002e 0%,#000 60%)`,overflow:"hidden",color:"#fff" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        select option{background:#0d0d1a}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,0.03)}
        ::-webkit-scrollbar-thumb{background:${PINK}88;border-radius:3px}
      `}</style>

      <Sidebar projects={projects} activeProject={activeProj} onSelectProject={setActiveProj}
        onAddProject={handleAddProject} page={page} onNav={setPage}/>

      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        <TopBar session={session} onLogout={onLogout} page={page} projects={projects} activeProject={activeProj}/>

        <div style={{ flex:1,display:"flex",overflow:"hidden",animation:"fadeIn 0.3s ease" }}>
          {page==="dashboard"    && <Dashboard tasks={tasks} projects={projects} members={members}/>}
          {page==="board"        && <BoardView tasks={tasks} setTasks={setTasks} projects={projects} activeProject={activeProj}/>}
          {page==="members"      && <MembersPage members={members} setMembers={setMembers}/>}
          {page==="integrations" && <IntegrationsPage/>}
          {page==="settings"     && <Settings/>}
        </div>
      </div>
    </div>
  );
}
