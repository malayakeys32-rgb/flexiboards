import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../../layouts/AppLayout";
import { getIncident, updateIncident, deleteIncident } from "../../api/incidents";

export default function IncidentPage() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getIncident(id);
    setIncident(data);
    setTitle(data.title);
    setCategory(data.category || "");
  };

  const save = async () => {
    await updateIncident(id, { title, category });
    load();
  };

  const remove = async () => {
    await deleteIncident(id);
    window.location.href = "/incidents";
  };

  if (!incident) return <AppLayout>Loading...</AppLayout>;

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-white mb-6">Incident Details</h1>

      <div className="bg-[#0f0f1a] p-6 rounded-xl border border-red-700 mb-6">
        <h2 className="text-xl font-bold mb-3">Edit Incident</h2>

        <input
          className="bg-[#1a1a2b] text-white p-2 rounded-lg w-full mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="bg-[#1a1a2b] text-white p-2 rounded-lg w-full mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />

        <button
          className="bg-red-600 px-4 py-2 rounded-lg text-white mr-3"
          onClick={save}
        >
          Save
        </button>

        <button
          className="bg-red-800 px-4 py-2 rounded-lg text-white"
          onClick={remove}
        >
          Delete Incident
        </button>
      </div>
    </AppLayout>
  );
}
