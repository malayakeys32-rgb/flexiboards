import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import IncidentCard from "../../components/IncidentCard";
import { getIncidents, createIncident } from "../../api/incidents";

export default function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getIncidents();
    setIncidents(data);
  };

  const addIncident = async () => {
    if (!title.trim()) return;
    await createIncident({ title, category });
    setTitle("");
    setCategory("");
    load();
  };

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-white mb-6">Incident Tracking</h1>

      <div className="flex gap-3 mb-6">
        <input
          className="bg-[#1a1a2b] text-white p-2 rounded-lg"
          placeholder="Incident title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="bg-[#1a1a2b] text-white p-2 rounded-lg"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          className="bg-red-600 px-4 py-2 rounded-lg text-white"
          onClick={addIncident}
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {incidents.map((i) => (
          <IncidentCard
            key={i.id}
            incident={i}
            onSelect={() => (window.location.href = `/incidents/${i.id}`)}
          />
        ))}
      </div>
    </AppLayout>
  );
}
