export default function Footer() {
  return (
    <footer className="mt-8 px-6 py-4 border-t border-purple-700 bg-black text-xs text-gray-400 flex justify-between">
      <span>© {new Date().getFullYear()} FlexiBoards</span>
      <span>Business · Personal · Workspace · Tools</span>
    </footer>
  );
}
