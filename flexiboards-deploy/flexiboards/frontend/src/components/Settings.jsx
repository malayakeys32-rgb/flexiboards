import React, { useState, useRef } from "react";
import { useWorkspace } from "../App";
import { api } from "../api";

const PINK = "#d63384";
const CYAN = "#0dcaf0";
const API_BASE = process.env.REACT_APP_API_URL || "";

/* ── Atoms ──────────────────────────────────────────────────────────────────── */
function Field({ label, value = "", type = "text", placeholder = "", onChange }) {
  const [v, setV] = useState(value);
  const handle = e => { setV(e.target.value); onChange && onChange(e.target.value); };
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:"block", marginBottom:6, fontSize:11, fontWeight:700, color:CYAN, letterSpacing:"0.07em", textTransform:"uppercase" }}>{label}</label>
      <input type={type} value={v} onChange={handle} placeholder={placeholder}
        style={{ width:"100%", padding:"11px 13px", borderRadius:10, boxSizing:"border-box",
          border:`1px solid ${v?CYAN+"55":"rgba(255,255,255,0.12)"}`,
          background:"rgba(0,0,0,0.55)", color:"#fff", fontSize:13, outline:"none",
          boxShadow:v?`0 0 12px ${CYAN}18`:"none", transition:"all 0.2s" }}/>
    </div>
  );
}

function Toggle({ label, desc, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
      <div>
        <div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>{label}</div>
        {desc && <div style={{ fontSize:11, color:"rgba(255,255,255,0.38)", marginTop:2 }}>{desc}</div>}
      </div>
      <div onClick={()=>setOn(s=>!s)} style={{ width:40, height:22, borderRadius:11, cursor:"pointer", background:on?PINK:"rgba(255,255,255,0.12)", position:"relative", transition:"background 0.2s", flexShrink:0, boxShadow:on?`0 0 10px ${PINK}55`:"none" }}>
        <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:on?21:3, transition:"left 0.2s" }}/>
      </div>
    </div>
  );
}

function SaveBtn({ label="Save Changes", onClick, saving, saved }) {
  return (
    <button onClick={onClick} disabled={saving} style={{ padding:"12px 26px", marginTop:20, borderRadius:11, border:"none", cursor:saving?"wait":"pointer", background:saved?"rgba(30,90,30,0.9)":`linear-gradient(135deg,${PINK},${CYAN})`, color:"#fff", fontSize:13, fontWeight:800, boxShadow:saved?"0 0 14px rgba(30,180,30,0.5)":`0 0 22px ${PINK}44`, transition:"all 0.3s", display:"flex", alignItems:"center", gap:8 }}>
      {saving ? <><div style={{ width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",animation:"spin 0.7s linear infinite" }}/> Saving…</> : saved ? "✓ Saved!" : label}
    </button>
  );
}

/* ── Workspace / Company Settings ─────────────────────────────────────────── */
function WorkspaceSection() {
  const { workspace, setWorkspace } = useWorkspace();
  const [name, setName]         = useState(workspace?.name || "FlexiBoards");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [logoSaving, setLogoSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef                 = useRef();

  const logoSrc = workspace?.logoUrl ? `${API_BASE}${workspace.logoUrl}` : null;

  const saveName = async () => {
    setSaving(true);
    try {
      const updated = await api.updateWorkspaceName(name);
      setWorkspace(w => ({ ...w, name: updated.name }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // Optimistic update for local dev
      setWorkspace(w => ({ ...w, name }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  const handleLogoFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setLogoSaving(true);
    try {
      const result = await api.uploadLogo(file);
      if (result.logoUrl) setWorkspace(w => ({ ...w, logoUrl: result.logoUrl }));
    } catch {
      // Fallback: local object URL
      const url = URL.createObjectURL(file);
      setWorkspace(w => ({ ...w, logoUrl: url }));
    }
    setLogoSaving(false);
  };

  const removeLogo = async () => {
    try { await api.deleteLogo(); } catch {}
    setWorkspace(w => ({ ...w, logoUrl: null }));
  };

  return (
    <>
      <h1 style={{ fontSize:20,fontWeight:900,color:CYAN,textShadow:`0 0 16px ${CYAN}`,marginBottom:6 }}>Workspace</h1>
      <p style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:24 }}>Customize your company name and logo across the entire app.</p>

      {/* Logo upload */}
      <div style={{ marginBottom:28 }}>
        <label style={{ display:"block",marginBottom:10,fontSize:11,fontWeight:700,color:CYAN,letterSpacing:"0.07em",textTransform:"uppercase" }}>Company Logo</label>
        <div style={{ display:"flex", alignItems:"flex-start", gap:20, flexWrap:"wrap" }}>
          {/* Preview */}
          <div style={{ width:90,height:90,borderRadius:16,background:logoSrc?"rgba(255,255,255,0.04)":`linear-gradient(135deg,${CYAN},${PINK})`,border:`1px solid ${logoSrc?CYAN+"44":"transparent"}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0,boxShadow:logoSrc?`0 0 20px ${CYAN}22`:`0 0 24px ${PINK}44` }}>
            {logoSrc
              ? <img src={logoSrc} alt="logo" style={{ width:"100%",height:"100%",objectFit:"contain" }}/>
              : <span style={{ fontSize:28,fontWeight:900,color:"#fff" }}>{name.substring(0,2).toUpperCase()}</span>}
          </div>

          {/* Drop zone */}
          <div>
            <div
              onClick={()=>fileRef.current.click()}
              onDragOver={e=>{e.preventDefault();setDragOver(true);}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)handleLogoFile(f);}}
              style={{ width:200,minHeight:80,border:`2px dashed ${dragOver?CYAN:PINK+"66"}`,borderRadius:12,padding:"16px 18px",cursor:"pointer",background:dragOver?`${CYAN}11`:"rgba(255,255,255,0.03)",textAlign:"center",transition:"all 0.2s",boxShadow:dragOver?`0 0 18px ${CYAN}33`:"none" }}>
              <div style={{ fontSize:22,marginBottom:6 }}>{logoSaving?"⏳":"📁"}</div>
              <div style={{ fontSize:12,fontWeight:700,color:PINK,marginBottom:4 }}>{logoSaving?"Uploading…":"Click or drag & drop"}</div>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.35)" }}>PNG, JPG, SVG, WebP · max 5MB</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleLogoFile(e.target.files[0])}/>
            <div style={{ display:"flex",gap:8,marginTop:10 }}>
              <button onClick={()=>fileRef.current.click()} style={{ padding:"7px 14px",borderRadius:8,border:`1px solid ${PINK}66`,background:`${PINK}22`,color:PINK,cursor:"pointer",fontSize:12,fontWeight:700 }}>Upload Logo</button>
              {logoSrc && <button onClick={removeLogo} style={{ padding:"7px 14px",borderRadius:8,border:"1px solid rgba(226,75,74,0.4)",background:"rgba(226,75,74,0.12)",color:"#ff7070",cursor:"pointer",fontSize:12,fontWeight:700 }}>Remove</button>}
            </div>
          </div>
        </div>
      </div>

      {/* Company name */}
      <div style={{ marginBottom:8 }}>
        <label style={{ display:"block",marginBottom:6,fontSize:11,fontWeight:700,color:CYAN,letterSpacing:"0.07em",textTransform:"uppercase" }}>Company / Workspace Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="FlexiBoards"
          style={{ width:"100%",padding:"12px 14px",borderRadius:10,boxSizing:"border-box",border:`1px solid ${name?PINK+"66":"rgba(255,255,255,0.12)"}`,background:"rgba(0,0,0,0.55)",color:"#fff",fontSize:15,fontWeight:600,outline:"none",boxShadow:name?`0 0 14px ${PINK}22`:"none",transition:"all 0.2s" }}/>
        <div style={{ fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:6 }}>This name appears in the sidebar, login page, and browser tab.</div>
      </div>

      {/* Live preview */}
      <div style={{ marginTop:18,padding:"14px 16px",background:"rgba(255,255,255,0.03)",borderRadius:12,border:"1px solid rgba(255,255,255,0.08)",marginBottom:4 }}>
        <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.07em",fontWeight:700 }}>Live preview</div>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:32,height:32,borderRadius:9,background:logoSrc?"rgba(255,255,255,0.08)":`linear-gradient(135deg,${CYAN},${PINK})`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0 }}>
            {logoSrc ? <img src={logoSrc} alt="logo" style={{ width:"100%",height:"100%",objectFit:"contain" }}/> : <span style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{name.substring(0,2).toUpperCase()}</span>}
          </div>
          <span style={{ fontWeight:900,fontSize:15,color:"#fff" }}>{name||"FlexiBoards"}</span>
        </div>
      </div>

      <SaveBtn label="Save Workspace" onClick={saveName} saving={saving} saved={saved}/>
    </>
  );
}

/* ── Profile ─────────────────────────────────────────────────────────────────  */
function ProfileSection() {
  const [saving,setSaving]=useState(false); const [saved,setSaved]=useState(false);
  const save=()=>{setSaving(true);setTimeout(()=>{setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2200);},700);};
  return (<>
    <h1 style={{fontSize:20,fontWeight:900,color:CYAN,textShadow:`0 0 16px ${CYAN}`,marginBottom:20}}>Profile</h1>
    <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,padding:"16px 18px",background:"rgba(255,255,255,0.04)",borderRadius:12,border:"1px solid rgba(255,255,255,0.08)"}}>
      <div style={{width:60,height:60,borderRadius:"50%",flexShrink:0,background:`linear-gradient(135deg,${PINK},${CYAN})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff",boxShadow:`0 0 24px ${PINK}55`}}>JD</div>
      <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>Jane Doe</div><div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>Admin · jane@example.com</div></div>
      <button style={{padding:"8px 14px",background:PINK,border:"none",borderRadius:9,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:12,boxShadow:`0 0 12px ${PINK}44`}}>Change Avatar</button>
    </div>
    <Field label="Full Name" value="Jane Doe"/><Field label="Email" value="jane@example.com" type="email"/><Field label="Initials" value="JD"/>
    <div style={{marginBottom:18}}>
      <label style={{display:"block",marginBottom:6,fontSize:11,fontWeight:700,color:CYAN,letterSpacing:"0.07em",textTransform:"uppercase"}}>Timezone</label>
      <select style={{width:"100%",padding:"11px 13px",borderRadius:10,background:"rgba(0,0,0,0.55)",border:`1px solid rgba(255,255,255,0.12)`,color:"#fff",fontSize:13,outline:"none"}}>
        {["America/Los_Angeles","America/New_York","Europe/London","Europe/Paris","Asia/Tokyo","Australia/Sydney"].map(tz=><option key={tz} style={{background:"#111"}}>{tz}</option>)}
      </select>
    </div>
    <SaveBtn label="Save Profile" onClick={save} saving={saving} saved={saved}/>
  </>);
}

/* ── Security ─────────────────────────────────────────────────────────────── */
function SecuritySection() {
  const [saving,setSaving]=useState(false);const[saved,setSaved]=useState(false);
  const save=()=>{setSaving(true);setTimeout(()=>{setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2200);},700);};
  return (<>
    <h1 style={{fontSize:20,fontWeight:900,color:CYAN,textShadow:`0 0 16px ${CYAN}`,marginBottom:20}}>Security</h1>
    <Field label="Current Password" type="password" placeholder="••••••••"/>
    <Field label="New Password" type="password" placeholder="••••••••"/>
    <Field label="Confirm New Password" type="password" placeholder="••••••••"/>
    <SaveBtn label="Update Password" onClick={save} saving={saving} saved={saved}/>
    <div style={{marginTop:26,paddingTop:22,borderTop:"1px solid rgba(255,255,255,0.07)"}}>
      <h3 style={{color:PINK,textShadow:`0 0 12px ${PINK}`,fontSize:15,marginBottom:10}}>Two-Factor Authentication</h3>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:14}}>Add an extra layer of security to your account.</p>
      <button style={{padding:"10px 20px",background:PINK,border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontWeight:700,boxShadow:`0 0 16px ${PINK}55`,fontSize:13}}>Enable 2FA</button>
    </div>
    <div style={{marginTop:26,paddingTop:22,borderTop:"1px solid rgba(255,255,255,0.07)"}}>
      <h3 style={{color:CYAN,fontSize:15,marginBottom:12}}>Active Sessions</h3>
      {[["Chrome · macOS","Current · Sunnyvale CA",true],["Safari · iPhone","2 days ago",false]].map(([d,m,cur])=>(
        <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 13px",marginBottom:9,borderRadius:10,background:"rgba(255,255,255,0.04)",border:`1px solid ${cur?CYAN+"33":"rgba(255,255,255,0.08)"}`}}>
          <div><div style={{fontWeight:600,fontSize:13}}>{d}{cur&&<span style={{color:CYAN,fontSize:10,marginLeft:8}}>· Active</span>}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.38)",marginTop:2}}>{m}</div></div>
          {!cur&&<button style={{padding:"6px 12px",borderRadius:7,border:"1px solid rgba(226,75,74,0.4)",background:"rgba(226,75,74,0.1)",color:"#ff7070",cursor:"pointer",fontSize:11,fontWeight:600}}>Revoke</button>}
        </div>
      ))}
    </div>
  </>);
}

/* ── Notifications ───────────────────────────────────────────────────────── */
function NotificationsSection() {
  const[saving,setSaving]=useState(false);const[saved,setSaved]=useState(false);
  const save=()=>{setSaving(true);setTimeout(()=>{setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2200);},700);};
  return (<>
    <h1 style={{fontSize:20,fontWeight:900,color:CYAN,textShadow:`0 0 16px ${CYAN}`,marginBottom:20}}>Notifications</h1>
    <Toggle label="Weekly email digest" desc="A summary of activity every Monday." defaultOn={true}/>
    <Toggle label="Task assigned to me" desc="When someone assigns you a task." defaultOn={true}/>
    <Toggle label="Due date reminders" desc="24 hours before a task is due." defaultOn={true}/>
    <Toggle label="Overdue task alerts" desc="When tasks pass their due date." defaultOn={false}/>
    <Toggle label="Project updates" desc="When a board is created or archived." defaultOn={false}/>
    <Toggle label="Member joined workspace" desc="When a new invite is accepted." defaultOn={true}/>
    <SaveBtn label="Save Preferences" onClick={save} saving={saving} saved={saved}/>
  </>);
}

/* ── Appearance ─────────────────────────────────────────────────────────── */
function AppearanceSection() {
  const[accent,setAccent]=useState(PINK);const[theme,setTheme]=useState("dark");
  const swatches=[PINK,"#534AB7",CYAN,"#1D9E75","#EF9F27","#E24B4A","#185FA5","#3B6D11"];
  return (<>
    <h1 style={{fontSize:20,fontWeight:900,color:CYAN,textShadow:`0 0 16px ${CYAN}`,marginBottom:20}}>Appearance</h1>
    <div style={{marginBottom:22}}>
      <label style={{display:"block",marginBottom:10,fontSize:11,fontWeight:700,color:CYAN,letterSpacing:"0.07em",textTransform:"uppercase"}}>Theme</label>
      <div style={{display:"flex",gap:10}}>
        {["dark","light","system"].map(t=>(
          <button key={t} onClick={()=>setTheme(t)} style={{padding:"10px 18px",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:600,background:theme===t?"rgba(255,255,255,0.12)":"transparent",color:theme===t?"#fff":"rgba(255,255,255,0.4)",border:`1px solid ${theme===t?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.1)"}`,boxShadow:theme===t?`0 0 10px ${PINK}33`:"none"}}>
            {t==="dark"?"🌙 Dark":t==="light"?"☀️ Light":"💻 System"}
          </button>
        ))}
      </div>
    </div>
    <div style={{marginBottom:22}}>
      <label style={{display:"block",marginBottom:10,fontSize:11,fontWeight:700,color:CYAN,letterSpacing:"0.07em",textTransform:"uppercase"}}>Accent Color</label>
      <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
        {swatches.map(c=>(
          <div key={c} onClick={()=>setAccent(c)} style={{width:32,height:32,borderRadius:"50%",background:c,cursor:"pointer",border:accent===c?"3px solid #fff":"3px solid transparent",boxShadow:accent===c?`0 0 12px ${c}`:"none",transition:"all 0.2s"}}/>
        ))}
      </div>
    </div>
    <Toggle label="Compact density" desc="Show more tasks in less vertical space."/>
    <Toggle label="Collapse sidebar by default"/>
    <Toggle label="Reduce motion" desc="Minimise animations and transitions."/>
  </>);
}

/* ── Integrations ───────────────────────────────────────────────────────── */
function IntegrationsSection() {
  const[conn,setConn]=useState({slack:true,github:false,google:false,zapier:false,notion:false});
  const items=[{k:"slack",n:"Slack",i:"🟣",d:"Task notifications in Slack channels."},{k:"github",n:"GitHub",i:"🐙",d:"Link pull requests and issues to tasks."},{k:"google",n:"Google Calendar",i:"🔵",d:"Sync due dates to your calendar."},{k:"zapier",n:"Zapier",i:"🟠",d:"Automate with 5000+ apps."},{k:"notion",n:"Notion",i:"⬜",d:"Import pages as tasks."}];
  return (<>
    <h1 style={{fontSize:20,fontWeight:900,color:CYAN,textShadow:`0 0 16px ${CYAN}`,marginBottom:8}}>Integrations</h1>
    <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:20}}>Connect to your existing tools and services.</p>
    {items.map(({k,n,i,d})=>(
      <div key={k} style={{display:"flex",alignItems:"center",gap:14,padding:"15px 17px",marginBottom:10,borderRadius:13,background:"rgba(255,255,255,0.04)",border:`1px solid ${conn[k]?CYAN+"33":"rgba(255,255,255,0.08)"}`,transition:"all 0.2s",boxShadow:conn[k]?`0 0 18px ${CYAN}11`:"none"}}>
        <span style={{fontSize:24,flexShrink:0}}>{i}</span>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{n}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2}}>{d}</div></div>
        {conn[k]&&<span style={{fontSize:11,color:CYAN,marginRight:4}}>✓ Connected</span>}
        <button onClick={()=>setConn(c=>({...c,[k]:!c[k]}))} style={{padding:"8px 15px",borderRadius:9,border:conn[k]?"1px solid rgba(226,75,74,0.4)":"none",cursor:"pointer",fontSize:12,fontWeight:700,background:conn[k]?"rgba(226,75,74,0.13)":`linear-gradient(135deg,${PINK},${CYAN})`,color:conn[k]?"#ff7070":"#fff",boxShadow:conn[k]?"none":`0 0 12px ${PINK}44`}}>{conn[k]?"Disconnect":"Connect"}</button>
      </div>
    ))}
  </>);
}

/* ── Activity ────────────────────────────────────────────────────────────── */
function ActivitySection() {
  return (<>
    <h1 style={{fontSize:20,fontWeight:900,color:CYAN,textShadow:`0 0 16px ${CYAN}`,marginBottom:20}}>Activity Summary</h1>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
      {[["128","Tasks Created"],["97","Completed"],["9","Boards"],["5","Members"]].map(([v,l])=>(
        <div key={l} style={{padding:"14px 16px",borderRadius:11,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontSize:24,fontWeight:900,color:CYAN,textShadow:`0 0 10px ${CYAN}`}}>{v}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:3}}>{l}</div>
        </div>
      ))}
    </div>
    {["Moved 'Landing Page' → In Progress · 2h ago","Invited Taylor Lee · Yesterday","Completed 8 tasks in Q3 Marketing · Yesterday","Created 'Mobile App v2' board · 3 days ago","Updated profile settings · 5 days ago"].map(t=>(
      <div key={t} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 13px",marginBottom:8,borderRadius:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",fontSize:12,color:"rgba(255,255,255,0.6)"}}>
        <span style={{color:CYAN}}>↗</span>{t}
      </div>
    ))}
  </>);
}

/* ── Danger ──────────────────────────────────────────────────────────────── */
function DangerSection() {
  const [confirm,setConfirm]=useState("");
  return (<>
    <h1 style={{fontSize:20,fontWeight:900,color:"#E24B4A",textShadow:"0 0 16px #E24B4A",marginBottom:6}}>Danger Zone</h1>
    <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:22}}>These actions are permanent and cannot be undone.</p>
    {[["Clear all tasks","Remove every task from all boards.","Clear tasks"],["Reset to demo data","Restore original sample data.","Reset data"],["Export all data","Download a full JSON backup.","Export JSON"]].map(([title,desc,btn])=>(
      <div key={title} style={{padding:"14px 16px",marginBottom:10,borderRadius:12,background:"rgba(226,75,74,0.06)",border:"1px solid rgba(226,75,74,0.2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontWeight:700,fontSize:13}}>{title}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:3}}>{desc}</div></div>
        <button onClick={()=>window.confirm(`${title}? This cannot be undone.`)} style={{padding:"8px 14px",borderRadius:9,border:"1px solid rgba(226,75,74,0.45)",background:"rgba(226,75,74,0.12)",color:"#ff7070",cursor:"pointer",fontWeight:700,fontSize:12,whiteSpace:"nowrap",marginLeft:14}}>{btn}</button>
      </div>
    ))}
    <div style={{padding:"18px",marginTop:14,borderRadius:12,background:"rgba(226,75,74,0.07)",border:"2px solid rgba(226,75,74,0.3)"}}>
      <div style={{fontWeight:700,fontSize:14,color:"#ff7070",marginBottom:5}}>Delete Account</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:12}}>Type <strong style={{color:"#ff7070"}}>DELETE</strong> to confirm.</div>
      <input value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Type DELETE to confirm"
        style={{width:"100%",padding:"10px 13px",borderRadius:9,boxSizing:"border-box",border:"1px solid rgba(226,75,74,0.4)",background:"rgba(0,0,0,0.55)",color:"#ff7070",fontSize:13,outline:"none",marginBottom:12}}/>
      <button disabled={confirm!=="DELETE"} style={{width:"100%",padding:"12px",borderRadius:10,border:"none",background:confirm==="DELETE"?"#cc0033":"rgba(255,255,255,0.06)",color:confirm==="DELETE"?"#fff":"rgba(255,255,255,0.22)",cursor:confirm==="DELETE"?"pointer":"not-allowed",fontWeight:800,fontSize:13,boxShadow:confirm==="DELETE"?"0 0 24px #cc003355":"none"}}>
        Delete My Account Permanently
      </button>
    </div>
  </>);
}

/* ── Main ────────────────────────────────────────────────────────────────── */
const MENU = [
  { id:"workspace",     label:"🏢 Workspace"          },
  { id:"profile",       label:"👤 Profile"            },
  { id:"security",      label:"🔒 Security"           },
  { id:"notifications", label:"🔔 Notifications"     },
  { id:"appearance",    label:"🎨 Appearance"         },
  { id:"integrations",  label:"🔌 Integrations"       },
  { id:"activity",      label:"📊 Activity"           },
  { id:"danger",        label:"⚠️  Danger Zone"       },
];

export default function Settings() {
  const [section, setSection] = useState("workspace");
  const panels = {
    workspace:     <WorkspaceSection/>,
    profile:       <ProfileSection/>,
    security:      <SecuritySection/>,
    notifications: <NotificationsSection/>,
    appearance:    <AppearanceSection/>,
    integrations:  <IntegrationsSection/>,
    activity:      <ActivitySection/>,
    danger:        <DangerSection/>,
  };
  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      {/* Left nav */}
      <div style={{ width:210, background:"rgba(0,0,0,0.45)", borderRight:"1px solid rgba(255,255,255,0.07)", padding:"16px 10px", flexShrink:0, overflowY:"auto" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em",textTransform:"uppercase",padding:"0 8px 12px" }}>Settings</div>
        {MENU.map(m=>(
          <button key={m.id} onClick={()=>setSection(m.id)} style={{ display:"block",width:"100%",padding:"10px 11px",marginBottom:3,borderRadius:9,border:"none",cursor:"pointer",textAlign:"left",background:section===m.id?`${PINK}22`:"transparent",color:section===m.id?CYAN:"rgba(255,255,255,0.55)",fontWeight:section===m.id?700:400,fontSize:13,boxShadow:section===m.id?`inset 3px 0 0 ${PINK}`:"none",transition:"all 0.15s",textShadow:section===m.id?`0 0 10px ${CYAN}`:"none" }}>
            {m.label}
          </button>
        ))}
      </div>
      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"28px 32px" }}>
        <div style={{ maxWidth:640 }}>
          {panels[section]}
        </div>
      </div>
    </div>
  );
}
