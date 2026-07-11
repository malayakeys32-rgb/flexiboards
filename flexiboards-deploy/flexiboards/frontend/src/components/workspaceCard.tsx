export default function WorkspaceCard({ workspace, onSelect }) {
  return (
    <div
      className="p-4 bg-[#0f0f1a] border border-[#1f1f2d] rounded-xl hover:border-purple-500 cursor-pointer transition-all"
      onClick={onSelect}
    >
      <h2 className="text-xl font-bold text-white">{workspace.name}</h2>
      <p className="text-sm text-gray-400">
        {workspace.projects?.length || 0} projects
      </p>
    </div>
  );
}
