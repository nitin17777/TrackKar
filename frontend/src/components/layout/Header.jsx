export default function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">

      <div className="flex items-center gap-4">

        <button className="text-gray-500 hover:text-black">
          ← Exit
        </button>

        <h1 className="text-xl font-bold text-indigo-600">
          TrackKar
        </h1>

      </div>

      {/* Progress */}
      <div className="flex items-center gap-4">

        <div className="text-sm text-gray-500">
          Overall Progress
          <div className="font-bold text-lg">35%</div>
        </div>

        <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-[35%] h-full bg-black"></div>
        </div>

      </div>

    </header>
  );
}