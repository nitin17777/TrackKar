export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-white/70 backdrop-blur border-b border-gray-200">

      <div className="text-xl font-bold text-indigo-600">
        TrackKar 🚀
      </div>

      <div className="flex gap-4">
        <button className="text-gray-600 hover:text-black">
          About
        </button>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
          Get Started
        </button>
      </div>

    </nav>
  );
}