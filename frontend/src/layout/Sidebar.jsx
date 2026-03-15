export default function Sidebar() {
  return (
    <aside className="w-72 p-6 space-y-6">

      {/* Team Code Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-green-500 text-white p-6 rounded-2xl shadow">

        <p className="text-sm opacity-80">Team Code</p>

        <h2 className="text-2xl font-bold mt-1">
          HACKNER2
        </h2>

      </div>

      {/* Team Members */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <h3 className="font-semibold mb-4">
          Team Members (3)
        </h3>

        {["zczc", "Alex", "Sam"].map((name) => (
          <div
            key={name}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-gray-500">
                Energy: {Math.floor(Math.random()*30)+70}%
              </p>
            </div>
          </div>
        ))}

      </div>

      {/* Quick Stats */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <h3 className="font-semibold mb-4">
          Quick Stats
        </h3>

        <div className="space-y-2 text-sm">

          <div className="flex justify-between">
            <span>Total Tasks</span>
            <b>10</b>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Completed</span>
            <b>1</b>
          </div>

          <div className="flex justify-between text-indigo-600">
            <span>In Progress</span>
            <b>3</b>
          </div>

        </div>

      </div>

    </aside>
  );
}