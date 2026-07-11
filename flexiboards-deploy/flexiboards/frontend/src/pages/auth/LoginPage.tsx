export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/neon-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/70 border border-purple-600 rounded-2xl p-8 w-full max-w-md text-white">
        <h1 className="text-2xl font-bold mb-4">Sign in to FlexiBoards</h1>
        <input
          className="w-full mb-3 bg-[#111] px-3 py-2 rounded-lg"
          placeholder="Email"
        />
        <input
          className="w-full mb-4 bg-[#111] px-3 py-2 rounded-lg"
          placeholder="Password"
          type="password"
        />
        <button className="w-full bg-purple-600 py-2 rounded-lg">
          Log in
        </button>
      </div>
    </div>
  );
}
