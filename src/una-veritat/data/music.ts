import { duckedMusicVolumes } from '../../templates/elg-narrated-video/audio';
import { FPS, scenes, toFrame, words } from './timeline';

// sub_clair «Lofi» (586095) lowered by exactly 26 dB: the renderer rounds volumes to steps of 1/97,
// and this −9.7 LUFS track ducked under the voice would need volumes below 0.01.
export const MUSIC_SRC = 'private/music/sub_clair-lofi-586095-minus26db.wav';

// The track fades out by 209.5 s of its 214.1 s; starting in the pause after «Històricament,»
// lands that ending on the last words and the logo.
export const MUSIC_START_FRAME = toFrame(8.2);
const VIDEO_FRAMES = toFrame(scenes.logo.end);
export const MUSIC_FRAMES = VIDEO_FRAMES - MUSIC_START_FRAME;
export const MUSIC_FADE_IN_FRAMES = 30;

// Integrated loudness measured with ffmpeg ebur128 (the −26 dB copy and the narration).
const MUSIC_LUFS = -35.7;
const NARRATION_LUFS = -34.8;

/** Music volume for every frame of the video (index with the absolute frame). */
export const MUSIC_VOLUMES = duckedMusicVolumes({
  words,
  fps: FPS,
  durationInFrames: VIDEO_FRAMES,
  musicLufs: MUSIC_LUFS,
  narrationLufs: NARRATION_LUFS,
  underSpeech: -16,
  inPauses: -12,
  outro: { startFrame: toFrame(scenes.logo.start), level: -4 },
  fadeInFrames: 1,
  fadeOutFrames: 30,
});
