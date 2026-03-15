export default function StyledInput({ id, label, ...props }) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-gray-600 block mb-1.5"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-400 transition"
        {...props}
      />
    </div>
  );
}