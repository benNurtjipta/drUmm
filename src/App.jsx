import { useState, useRef, useEffect } from "react";
import * as Tone from "tone";
import { DRUMS, VOLUMES } from "./synths/synths.js";
import ControlPanel from "./components/ControlPanel.jsx";

const DRUM_NAMES = ["kick", "snare", "hiHat"];
const STEPS = 16;

const getInitialSequence = () =>
  Object.fromEntries(
    DRUM_NAMES.map((name) => [name, Array(STEPS).fill(false)])
  );

function App() {
  const [sequence, setSequence] = useState(getInitialSequence());
  const [playing, setPlaying] = useState(false);
  const [drums, setDrums] = useState(null);
  const [bpm, setBpm] = useState(120);
  const stepRef = useRef(0);
  const loopIdRef = useRef(null);

  const toggleStep = (drum, index) => {
    const newSteps = [...sequence[drum]];
    newSteps[index] = !newSteps[index];
    setSequence({ ...sequence, [drum]: newSteps });
  };

  const loopCallback = (time) => {
    DRUM_NAMES.forEach((drum) => {
      if (sequence[drum][stepRef.current]) {
        const synth = DRUMS[drum];
        if (drum === "kick") {
          synth.triggerAttackRelease("C1", "8n", time);
        } else if (drum === "hiHat") {
          synth.triggerAttackRelease("C6", "8n", time);
        } else if (drum === "snare") {
          synth.triggerAttackRelease("8n", time);
        }
      }
    });
    stepRef.current = (stepRef.current + 1) % STEPS;
  };

  const startSequencer = async () => {
    await Tone.start();

    if (!drums) {
      setDrums({
        kick: DRUMS.kick,
        snare: DRUMS.snare,
        hiHat: DRUMS.hiHat,
      });
    }

    Tone.Transport.bpm.value = bpm;
    stepRef.current = 0;

    if (loopIdRef.current !== null) {
      Tone.Transport.clear(loopIdRef.current);
    }

    loopIdRef.current = Tone.Transport.scheduleRepeat(loopCallback, "16n");
    Tone.Transport.start();
    setPlaying(true);
  };

  const stopSequencer = () => {
    if (loopIdRef.current !== null) {
      Tone.Transport.clear(loopIdRef.current);
      loopIdRef.current = null;
    }
    Tone.Transport.stop();
    setPlaying(false);
  };

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-6">🥁 Drumcomputer</h1>

      <ControlPanel
        playing={playing}
        bpm={bpm}
        onToggle={playing ? stopSequencer : startSequencer}
        onBpmChange={setBpm}
      />

      <div className="space-y-6">
        {DRUM_NAMES.map((drum) => (
          <div key={drum} className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="w-16 font-semibold capitalize">{drum}</span>

              <div className="flex flex-row gap-1 shrink-0">
                {sequence[drum].map((active, i) => (
                  <button
                    key={i}
                    onClick={() => toggleStep(drum, i)}
                    className={`w-6 h-6 rounded ${
                      active ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="ml-4 flex items-center">
                <label className="text-sm mr-2">Volume</label>
                <input
                  type="range"
                  min="-60"
                  max="0"
                  step="1"
                  defaultValue={VOLUMES[drum].volume.value}
                  onChange={(e) =>
                    (VOLUMES[drum].volume.value = parseInt(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
