import * as Tone from "tone";

const kickVol = new Tone.Volume(0).toDestination();
const snareVol = new Tone.Volume(0).toDestination();
const hiHatVol = new Tone.Volume(0).toDestination();

export const kick = new Tone.MembraneSynth().connect(kickVol);
export const snare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
}).connect(snareVol);
export const hiHat = new Tone.MetalSynth({
  frequency: 250,
  envelope: {
    attack: 0.001,
    decay: 0.1,
    release: 0.01,
  },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5,
}).connect(hiHatVol);

export const DRUMS = {
  kick,
  snare,
  hiHat,
};

export const VOLUMES = {
  kick: kickVol,
  snare: snareVol,
  hiHat: hiHatVol,
};
