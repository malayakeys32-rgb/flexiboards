export default function IncidentCard({ incident, onSelect }) {
  return (
    <div
      className="p-4 bg-[#111122] border border-red-700 rounded-xl hover:border-red-400 cursor-pointer transition-all"
      onClick={onSelect}
    >
      <h2 className="text-lg font-bold text-white">{incident.title}</h2>
      <p className="text-sm text-gray-400">{incident.category}</p>
      <p className="text-xs text-gray-500 mt-2">
        {new Date(incident.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
