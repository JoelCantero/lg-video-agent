import type { SceneName } from './timeline';

// Measured from resources/sound-effects (decoded at 48 kHz): attack and audible end in seconds,
// peak and loudest 10 ms window in dBFS. Files are served from public/sfx/.
export const soundEffects = {
  'shutter-click-02': { attack: 0.049, end: 0.14, peakDb: -6.5, loudestDb: -20.5 },
  'shutter-click-03': { attack: 0.144, end: 0.56, peakDb: 0, loudestDb: -11.9 },
  'shutter-click-04': { attack: 0.134, end: 0.66, peakDb: 0, loudestDb: -10.9 },
  'analog-camera-shutter': { attack: 0.526, end: 1.06, peakDb: -4.4, loudestDb: -19.0 },
  'nikon-d5100-shutter': { attack: 0.211, end: 0.68, peakDb: -11.3, loudestDb: -24.7 },
  'vintage-camera-flash': { attack: 0.636, end: 1.59, peakDb: 2.1, loudestDb: -7.2 },
} as const;

export type SoundEffect = keyof typeof soundEffects;

// The narration peaks at -17.8 dBFS with loud speech around -30.7 dBFS (10 ms windows);
// effects are levelled to that speech loudness and never peak above the voice.
const TARGET_LOUDEST_DB = -30;
const PEAK_CEILING_DB = -18;

export const effectVolume = (name: SoundEffect) => {
  const { peakDb, loudestDb } = soundEffects[name];
  return 10 ** (Math.min(TARGET_LOUDEST_DB - loudestDb, PEAK_CEILING_DB - peakDb) / 20);
};

/** Scene cuts with their sweep and sound; nextVoice is the measured voice onset after the cut. */
export const transitions: ReadonlyArray<{ scene: SceneName; sfx: SoundEffect; nextVoice: number | null }> = [
  { scene: 'voices', sfx: 'shutter-click-02', nextVoice: 13.81 },
  { scene: 'question', sfx: 'shutter-click-04', nextVoice: 30.95 },
  { scene: 'tetera', sfx: 'analog-camera-shutter', nextVoice: 40.24 },
  { scene: 'newton', sfx: 'shutter-click-03', nextVoice: 89.12 },
  { scene: 'psalm', sfx: 'vintage-camera-flash', nextVoice: 102.01 },
  { scene: 'creation', sfx: 'nikon-d5100-shutter', nextVoice: 109.09 },
  { scene: 'analogies', sfx: 'shutter-click-02', nextVoice: 114.09 },
  { scene: 'universe', sfx: 'shutter-click-04', nextVoice: 123.25 },
  { scene: 'christ', sfx: 'analog-camera-shutter', nextVoice: 131.77 },
  { scene: 'colossians', sfx: 'vintage-camera-flash', nextVoice: 144.08 },
  { scene: 'logo', sfx: 'nikon-d5100-shutter', nextVoice: null },
];
