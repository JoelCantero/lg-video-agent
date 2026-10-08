import captions from './captions-reviewed.json';

export type CaptionWord = { text: string; start: number; end: number };

export const FPS = 30;
export const words: CaptionWord[] = captions.words;

// Decoded length of public/private/fe-i-ciencia-20261008.wav (ffprobe).
export const AUDIO_SECONDS = 171.14;
export const AUDIO_SRC = 'private/fe-i-ciencia-20261008.wav';

export const toFrame = (seconds: number) => Math.round(seconds * FPS);
export const wordStart = (index: number) => words[index].start;
export const wordEnd = (index: number) => words[index].end;

/** Scene ranges in narration seconds; each scene starts where the previous one ends. */
export const scenes = {
  opening: { start: 0, end: 13.43 },
  voices: { start: 13.43, end: 31.1 },
  question: { start: 31.1, end: 40.33 },
  tetera: { start: 40.33, end: 93.7, firstWord: 104, lastWord: 237 },
  newton: { start: 93.7, end: 108.83 },
  psalm: { start: 108.83, end: 117 },
  creation: { start: 117, end: 122.87 },
  analogies: { start: 122.87, end: 132.2 },
  universe: { start: 132.2, end: 141.27 },
  christ: { start: 141.27, end: 154.27 },
  colossians: { start: 154.27, end: 170.4 },
  logo: { start: 170.4, end: 174 },
} as const;

export type SceneName = keyof typeof scenes;

export const sceneDuration = (name: SceneName) => toFrame(scenes[name].end) - toFrame(scenes[name].start);

/** Frame of a reviewed caption word relative to the start of a scene. */
export const sceneCues =
  (name: SceneName) =>
  (word: number, offsetSeconds = 0) =>
    toFrame(wordStart(word) + offsetSeconds) - toFrame(scenes[name].start);

/** Voice onset measured in the WAV at 0.67 s; Whisper places the first word at 0.00 s. */
export const FIRST_VOICE_OFFSET = 0.65;

/**
 * First word index of every caption page (editorial grouping by meaning and pauses,
 * at most two lines). Timestamps always come from the reviewed captions.
 */
export const captionPageStarts = [
  0, 7, 15, 18, 27, 33, 35, 44, 52, 56, 62, 72, 79, 89, 93, 97, 104, 110, 119, 128, 134, 137, 145,
  150, 156, 163, 164, 167, 176, 185, 189, 191, 195, 201, 204, 206, 210, 217, 226, 238, 248, 251,
  259, 263, 265, 273, 283, 288, 295, 306, 314, 322, 328, 332, 338, 347, 355, 362, 370, 380, 386,
  396, 403, 410, 417, 423, 431, 439,
];

/** Word ranges whose literal text is the scene's main graphic (title, question, quote, verses): no captions. */
export const onScreenTextRanges: ReadonlyArray<readonly [number, number]> = [
  [0, 6],
  [93, 103],
  [251, 262],
  [288, 305],
  [362, 369],
  // Colossians 1:15-16, including the reference read a second time (443-446).
  [410, 446],
];
