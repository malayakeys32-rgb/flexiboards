import React, { useState } from "react";

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<"business" | "personal">("business");

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-black border-b border-purple-700">
      <div className="text-xl font-bold text-purple-300">FlexiBoards</div>

      <nav className="flex items-center gap-4">
        <select
          className="bg-[#111] text-white px-3 py-1 rounded-lg border border-purple-500"
          value={mode}
          onChange={(e) => setMode(e.target.value as "business" | "personal")}
        >
          <option value="business">Business</option>
          <option value="personal">Personal</option>
        </select>

        <button className="text-white hover:text-purple-300">
          To‑Do
        </button>

        <button
          className="text-white border border-purple-500 px-3 py-1 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menu
        </button>
      </nav>

      {menuOpen && (
        <div className="absolute right-6 top-14 bg-[#111] border border-purple-700 rounded-xl p-3 text-sm text-white">
          <button className="block w-full text-left py-1">Workspace tools</button>
          <button className="block w-full text-left py-1">Settings</button>
          <button className="block w-full text-left py-1">Profile</button>
        </div>
      )}
    </header>
  );
}
