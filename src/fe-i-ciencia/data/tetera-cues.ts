// Visual cues of the teapot scene, anchored to reviewed caption word indices.
// Mirrors the "visual.cues" of .cache/captions/fe-i-ciencia-20261004/beats.json.
export const teteraCues = {
  lennox: 105, // El teòleg i matemàtic
  lennoxName: 109, // John Lennox
  invitation: 111, // ens convida a mirar-ho
  look: 114, // mirar
  teapot: 120, // Davant d'una tetera
  boiling: 126, // bullint,
  question: 129, // Per què està bullint aquesta aigua?
  someone: 135, // Algú podria respondre:
  because: 138, // Perquè la flama
  flame: 140, // flama
  energy: 142, // energia
  water: 147, // l'aigua
  absorbs: 148, // absorbeix
  molecules: 154, // molècules
  move: 156, // mouen
  boilingPoint: 161, // punt d'ebullició
  perfect: 164, // Perfecte.
  however: 165, // No obstant això,
  sameQuestion: 173, // la mateixa pregunta
  purpose: 177, // Perquè vull
  want: 179, // vull
  cup: 183, // tassa de te
  whichCorrect: 186, // Quina resposta és correcta?
  both: 190, // Les dues.
  how: 192, // Una explica com passa;
  finality: 196, // l'altra explica quina finalitat té.
  notContradict: 202, // No es contradiuen.
  contradict: 204, // contradiuen
  complement: 205, // Es complementen.
  sameWay: 207, // De la mateixa manera,
  science: 212, // ciència
  howWorks: 214, // com funciona
  universe: 217, // l'univers
  faith: 221, // fe
  whyExists: 224, // per què existeix,
  meaning: 227, // quin sentit té
  behind: 231, // qui hi ha darrere
} as const;

export type TeteraCue = keyof typeof teteraCues;
