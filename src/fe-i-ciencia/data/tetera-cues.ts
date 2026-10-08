// Visual cues of the teapot scene, anchored to reviewed caption word indices.
// Mirrors the "visual.cues" of .cache/captions/fe-i-ciencia-20261004/beats.json.
export const teteraCues = {
  lennox: 104, // El teòleg i matemàtic
  lennoxName: 108, // John Lennox
  invitation: 110, // ens convida a mirar-ho
  look: 113, // mirar
  teapot: 119, // Davant d'una tetera
  boiling: 125, // bullint,
  question: 128, // Per què està bullint aquesta aigua?
  someone: 134, // Algú podria respondre:
  because: 137, // Perquè la flama
  flame: 139, // flama
  energy: 141, // energia
  water: 146, // l'aigua
  absorbs: 147, // absorbeix
  molecules: 153, // molècules
  move: 155, // mouen
  boilingPoint: 160, // punt d'ebullició
  perfect: 163, // Perfecte.
  however: 164, // No obstant això,
  sameQuestion: 172, // la mateixa pregunta
  purpose: 176, // Perquè vull
  want: 178, // vull
  cup: 182, // tassa de te
  whichCorrect: 185, // Quina resposta és correcta?
  both: 189, // Les dues.
  how: 191, // Una explica com passa;
  finality: 195, // l'altra explica quina finalitat té.
  notContradict: 201, // No es contradiuen.
  contradict: 203, // contradiuen
  complement: 204, // Es complementen.
  sameWay: 206, // De la mateixa manera,
  science: 211, // ciència
  howWorks: 213, // com funciona
  universe: 216, // l'univers
  faith: 220, // fe
  whyExists: 223, // per què existeix,
  meaning: 226, // quin sentit té
  behind: 230, // qui hi ha darrere
} as const;

export type TeteraCue = keyof typeof teteraCues;
