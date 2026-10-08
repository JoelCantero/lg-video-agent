# Plantilla ELG · vídeo narrat vertical

Base reutilitzable extreta del vídeo «Són la ciència i la fe incompatibles?»
(`src/fe-i-ciencia/`, LG Video Agent, 4 d'octubre de 2026). Conté només peces
genèriques; les escenes, il·lustracions i dades d'aquell vídeo continuen a la
seva carpeta. Còpia independent: canviar la plantilla no modifica el vídeo lliurat.

## Contingut

| Fitxer | Ús |
| --- | --- |
| `theme.ts` | Colors i gradient exactes d'`elg-brand`, fonts, corbes i `pop`/`settle` |
| `fonts.ts` | `useBrandFonts()`: espera Urbanist 700 i Open Sans 400/700 dels paquets `@fontsource` |
| `timeline.ts` | `createTimeline(words, scenes, fps)`: `toFrame`, `sceneDuration`, `sceneCues` |
| `audio.ts` | `gainForLoudness`, `effectVolume` i `duckedMusicVolumes` (música sota la veu) |
| `components/BrandBackground.tsx` | Gradient de marca amb punts suaus |
| `components/Captions.tsx` | Subtítols paraula a paraula sobre placa fosca, màxim dues línies |
| `components/SceneSweep.tsx` | Escombrada blanca que tapa el tall entre escenes (16 fotogrames) |
| `components/TransitionSound.tsx` | Efecte de so amb l'atac sobre el tall i sortida abans de la veu |
| `components/StarrySky.tsx`, `VerseLines.tsx`, `WordReveal.tsx` | Versets literals revelats amb la veu |
| `components/Pill.tsx`, `NameCard.tsx`, `Floating.tsx` | Etiquetes, targetes de nom i posicionament |

## Com començar un vídeo nou

1. Transcriu la narració amb `mlx-whisper`, revisa-la amb el guió i genera
   el mapa de beats (`narrative-beats`). Copia els captions revisats a
   `src/<video>/data/`.
2. Defineix les escenes en segons de narració i agrupa les pàgines de
   subtítols per sentit (`pageStarts`), amb `hiddenRanges` per als textos
   que ja surten literalment a pantalla.
3. Crea un fitxer per escena a `src/<video>/scenes/`: `const at = timeline.sceneCues('escena')`
   i anima cada revelació amb `at(índexDeParaula)`.
4. Munta les escenes amb `<Series>`, una `SceneSweep` i un `TransitionSound`
   per tall, `Captions` i l'àudio. Mesura la sonoritat de la veu i la música
   (`ffmpeg -af ebur128`) abans de fixar els nivells.
5. Fes una escena pilot, verifica amb `remotion-verify` i amplia després.

Valors de referència del vídeo d'origen: 1080×1920, 30 fps; música −16 LU
sota la veu mentre parla, −12 LU a les pauses; efectes al nivell de la veu
forta sense superar-ne el pic.

Els efectes de so i la música no inclouen llicència registrada al catàleg
de recursos; confirma els drets abans de publicar.
