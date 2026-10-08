import lofiVinylTeapot from './background-music/lofi-vinyl-teapot.mp3?inline';
import subClairLofi from './background-music/sub-clair-lofi.mp3?inline';

export const backgroundMusic = [
  { id: 'lofi-vinyl-teapot', name: 'Lofi Vinyl Teapot', description: 'Pista lo-fi amb textura de vinil. Un fons per acompanyar narracions pausades, reflexions i muntatges tranquils.', src: lofiVinylTeapot, creator: 'ornave', tags: ['lo-fi', 'vinyl', 'calm'], sourceId: '553356' },
  { id: 'sub-clair-lofi', name: 'Lofi', description: "Pista lo-fi amb una introducció suau, un descans tranquil cap a la meitat i un final que s'esvaeix tot sol. Per a narracions llargues i reflexions.", src: subClairLofi, creator: 'sub_clair', tags: ['lo-fi', 'soft intro', 'fade-out'], sourceId: '586095' },
];
