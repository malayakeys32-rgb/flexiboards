import React, { useState } from "react";

const PINK = "#d63384";
const CYAN = "#0dcaf0";
const API_BASE = process.env.REACT_APP_API_URL || "";

export default function Login({ onLogin, workspace }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = await onLogin(email, password);
    setLoading(false);
    if (!result.ok) setError(result.error);
  };

  const logoSrc = workspace?.logoUrl
    ? `${API_BASE}${workspace.logoUrl}`
    : null;

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"radial-gradient(ellipse at 60% 40%,#1a002e 0%,#000 70%)",
      fontFamily:"'Inter',sans-serif", position:"relative", overflow:"hidden",
    }}>
      <style>{`
        @keyframes pulse{0%,100%{transform:scale(1);opacity:.55}50%{transform:scale(1.1);opacity:1}}
        @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @keyframes glow{0%,100%{text-shadow:0 0 18px ${CYAN}}50%{text-shadow:0 0 40px ${CYAN},0 0 80px ${CYAN}}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* BG FX */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${PINK}22 0%,transparent 70%)`,top:"-130px",left:"-120px",animation:"pulse 4s ease-in-out infinite"}}/>
        <div style={{position:"absolute",width:420,height:420,borderRadius:"50%",background:`radial-gradient(circle,${CYAN}18 0%,transparent 70%)`,bottom:"-90px",right:"-90px",animation:"pulse 6s ease-in-out infinite reverse"}}/>
        <div style={{position:"absolute",width:1,height:"100%",background:`linear-gradient(to bottom,transparent,${PINK}55,transparent)`,left:"22%",animation:"scan 6s linear infinite"}}/>
        <div style={{position:"absolute",width:1,height:"100%",background:`linear-gradient(to bottom,transparent,${CYAN}44,transparent)`,right:"26%",animation:"scan 9s linear infinite reverse"}}/>
        {[...Array(9)].map((_,i)=>(
          <div key={i} style={{position:"absolute",top:0,bottom:0,left:`${i*12}%`,width:"0.5px",background:"rgba(255,255,255,0.025)"}}/>
        ))}
      </div>

      {/* Card */}
      <div style={{
        position:"relative", zIndex:10, width:430, padding:"40px 36px",
        background:"rgba(0,0,0,0.86)", borderRadius:20,
        border:"1px solid rgba(255,255,255,0.1)",
        boxShadow:`0 0 60px ${PINK}33,0 0 120px ${CYAN}11,inset 0 1px 0 rgba(255,255,255,0.06)`,
        backdropFilter:"blur(24px)",
        animation: error ? "shake 0.4s ease" : "fadeUp 0.45s ease",
      }}>
        {/* Dynamic logo / brand */}
        <div style={{textAlign:"center",marginBottom:28}}>
          {logoSrc ? (
            <img src={logoSrc} alt="logo" style={{width:64,height:64,borderRadius:14,objectFit:"contain",margin:"0 auto 12px",display:"block",boxShadow:`0 0 30px ${PINK}44`}}/>
          ) : (
            <div style={{width:64,height:64,borderRadius:16,margin:"0 auto 12px",background:`linear-gradient(135deg,${CYAN},${PINK})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:"#fff",boxShadow:`0 0 36px ${PINK}55`}}>
              {(workspace?.name||"FB").substring(0,2).toUpperCase()}
            </div>
          )}
          <div style={{fontSize:26,fontWeight:900,color:"#fff",letterSpacing:"-0.04em",animation:"glow 3s ease-in-out infinite"}}>
            {workspace?.name || "FlexiBoards"}
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.32)",marginTop:4,letterSpacing:"0.14em",textTransform:"uppercase"}}>Admin Portal · Secured</div>
        </div>

        {/* Hint */}
        <div style={{background:`linear-gradient(135deg,${PINK}18,${CYAN}18)`,border:`1px solid ${CYAN}44`,borderRadius:12,padding:"11px 14px",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.75}}>📧 admin@flexiboards.com<br/>🔑 Admin@2026!</div>
          <button onClick={()=>{setEmail("admin@flexiboards.com");setPassword("Admin@2026!");setError("");}} style={{background:`linear-gradient(135deg,${PINK},${CYAN})`,border:"none",borderRadius:9,padding:"8px 12px",cursor:"pointer",color:"#fff",fontSize:11,fontWeight:800,whiteSpace:"nowrap",boxShadow:`0 0 12px ${PINK}44`}}>Auto-fill</button>
        </div>

        <form onSubmit={submit}>
          {/* Email */}
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:CYAN,marginBottom:6,letterSpacing:"0.07em",textTransform:"uppercase"}}>Email address</label>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>📧</span>
              <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError("");}} placeholder="admin@flexiboards.com" required
                style={{width:"100%",padding:"12px 12px 12px 40px",borderRadius:11,fontSize:13,background:"rgba(255,255,255,0.05)",border:`1px solid ${email?CYAN+"66":"rgba(255,255,255,0.12)"}`,color:"#fff",outline:"none",boxSizing:"border-box",transition:"border 0.2s"}}/>
            </div>
          </div>

          {/* Password */}
          <div style={{marginBottom:22}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:CYAN,marginBottom:6,letterSpacing:"0.07em",textTransform:"uppercase"}}>Password</label>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>🔑</span>
              <input type={showPass?"text":"password"} value={password} onChange={e=>{setPassword(e.target.value);setError("");}} placeholder="••••••••" required
                style={{width:"100%",padding:"12px 42px 12px 40px",borderRadius:11,fontSize:13,background:"rgba(255,255,255,0.05)",border:`1px solid ${password?PINK+"66":"rgba(255,255,255,0.12)"}`,color:"#fff",outline:"none",boxSizing:"border-box",transition:"border 0.2s"}}/>
              <button type="button" onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:15,color:"rgba(255,255,255,0.35)",padding:0}}>{showPass?"🙈":"👁️"}</button>
            </div>
          </div>

          {error && <div style={{background:"rgba(226,75,74,0.16)",border:"1px solid #E24B4A66",borderRadius:9,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#ff7070",display:"flex",alignItems:"center",gap:8}}>⚠️ {error}</div>}

          <button type="submit" disabled={loading} style={{width:"100%",padding:"14px",borderRadius:13,border:"none",cursor:loading?"not-allowed":"pointer",background:loading?"rgba(255,255,255,0.1)":`linear-gradient(135deg,${PINK},${CYAN})`,color:"#fff",fontSize:15,fontWeight:800,boxShadow:loading?"none":`0 0 30px ${PINK}55`,transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            {loading ? <><div style={{width:18,height:18,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.25)",borderTopColor:"#fff",animation:"spin 0.7s linear infinite"}}/> Authenticating…</> : `Sign in →`}
          </button>
        </form>

        <div style={{textAlign:"center",marginTop:20,fontSize:10,color:"rgba(255,255,255,0.18)",letterSpacing:"0.04em"}}>
          {workspace?.name||"FlexiBoards"} v1.0 · © 2026 All rights reserved
        </div>
      </div>
    </div>
  );
}
