export default function ControlPanel({ playing, bpm, onToggle, onBpmChange }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded text-white ${
          playing ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {playing ? "Stop" : "Start"}
      </button>

      <div className="flex items-center gap-2">
        <label className="text-sm">BPM: {bpm}</label>
        <input
          type="range"
          min="60"
          max="180"
          step="1"
          value={bpm}
          onChange={(e) => onBpmChange(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}
