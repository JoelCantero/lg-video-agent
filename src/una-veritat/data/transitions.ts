import { effectVolume } from '../../templates/elg-narrated-video/audio';
import type { SceneName } from './timeline';

// Measured in resources/sound-effects (decoded at 48 kHz): attack and audible end in seconds,
// peak and loudest 10 ms window in dBFS. Files are served from public/sfx/.
const soundEffects = {
  'shutter-click-02': { attack: 0.049, end: 0.14, peakDb: -6.5, loudestDb: -20.5 },
  'shutter-click-03': { attack: 0.144, end: 0.56, peakDb: 0, loudestDb: -11.9 },
  'shutter-click-04': { attack: 0.134, end: 0.66, peakDb: 0, loudestDb: -10.9 },
  'analog-camera-shutter': { attack: 0.526, end: 1.06, peakDb: -4.4, loudestDb: -19.0 },
  'nikon-d5100-shutter': { attack: 0.211, end: 0.68, peakDb: -11.3, loudestDb: -24.7 },
  'vintage-camera-flash': { attack: 0.636, end: 1.59, peakDb: 2.1, loudestDb: -7.2 },
} as const;

type SoundEffect = keyof typeof soundEffects;

// Narration: −34.8 LUFS, sample peak −13.7 dBFS. Effects sit at the level of loud speech
// and never peak above the voice.
const TARGET_LOUDEST_DB = -28;
const PEAK_CEILING_DB = -16;

export const sfx = (name: SoundEffect) => ({
  src: `sfx/${name}.mp3`,
  attack: soundEffects[name].attack,
  end: soundEffects[name].end,
  volume: effectVolume(soundEffects[name], TARGET_LOUDEST_DB, PEAK_CEILING_DB),
});

/** Scene cuts with their sound; nextVoice is the first reviewed word after the cut. */
export const transitions: ReadonlyArray<{ scene: SceneName; effect: SoundEffect; nextVoice: number | null }> = [
  { scene: 'oppressor', effect: 'shutter-click-02', nextVoice: 7.2 },
  { scene: 'distrust', effect: 'shutter-click-03', nextVoice: 23.43 },
  { scene: 'relativism', effect: 'nikon-d5100-shutter', nextVoice: 32.03 },
  { scene: 'problem', effect: 'shutter-click-04', nextVoice: 58.26 },
  { scene: 'contradiction', effect: 'shutter-click-03', nextVoice: 77.81 },
  { scene: 'need', effect: 'analog-camera-shutter', nextVoice: 90.46 },
  { scene: 'question', effect: 'shutter-click-02', nextVoice: 108.26 },
  { scene: 'philippians', effect: 'vintage-camera-flash', nextVoice: 115.28 },
  { scene: 'descent', effect: 'nikon-d5100-shutter', nextVoice: 133.66 },
  { scene: 'hands', effect: 'shutter-click-04', nextVoice: 147.18 },
  { scene: 'name', effect: 'analog-camera-shutter', nextVoice: 160.6 },
  { scene: 'light', effect: 'shutter-click-03', nextVoice: 173.39 },
  { scene: 'gospel', effect: 'shutter-click-02', nextVoice: 195.58 },
  { scene: 'logo', effect: 'nikon-d5100-shutter', nextVoice: null },
];
