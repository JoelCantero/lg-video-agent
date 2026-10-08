# Són la ciència i la fe incompatibles? · nota del projecte

Vídeo vertical narrat per a Església la Garriga, fet amb Remotion per LG Video
Agent el 4 d'octubre de 2026.

| | |
| --- | --- |
| Composició | `FeICiencia` (carpeta «FeICiencia» de Studio) |
| Entrada | `src/index.tsx` |
| Format | 1080 × 1920 (9:16), 30 fps |
| Durada | 4788 fotogrames · 159,6 s |
| Pilot aprovat | `FeICienciaPilotTetera` (escena de la tetera, 1482 fotogrames) |
| Escenes soltes | `FeICiencia-Escenes/*`, per revisar cada escena per separat |

## Previsualitzar i exportar

```sh
npm ci
npx remotion studio src/index.tsx   # http://localhost:3000/FeICiencia
npm run build                       # comprovació TypeScript
npx --no-install remotion render src/index.tsx FeICiencia out/fe-i-ciencia.mp4 --codec=h264
```

`npm run render` exporta `EsglesiaLaGarriga`, no aquest vídeo. Abans de
renderitzar cal aportar els assets privats descrits més avall.

Variant per a xarxes (mateix vídeo, àudio normalitzat a −14 LUFS i −1,5 dBTP).
Els valors `measured_*` són els de la primera passada de l'exportació del
4/10/2026; si canvia la mescla, torna a fer la primera passada:

```sh
ffmpeg -i out/fe-i-ciencia.mp4 -map 0:a -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -
ffmpeg -i out/fe-i-ciencia.mp4 -map 0:v -map 0:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=-36.90:measured_TP=-18.25:measured_LRA=4.70:measured_thresh=-47.39:offset=-0.34:linear=true" \
  -c:a aac -b:a 320k -ar 48000 out/fe-i-ciencia-xarxes-14lufs.mp4
```

## Lliurament del 4/10/2026

| Fitxer | Contingut |
| --- | --- |
| `out/fe-i-ciencia-20261004-222153.mp4` | Mescla aprovada al preview (−36,8 LUFS) |
| `out/fe-i-ciencia-20261004-222153-xarxes-14lufs.mp4` | Mateixa pista de vídeo; àudio a −13,9 LUFS per a xarxes |
| `out/fe-i-ciencia-20261004-222153-projecte.zip` | Codi reproduïble, sense els assets privats |
| `.cache/verification/fe-i-ciencia-export-20261004-222153/` | Evidències de l'exportació (local) |

## Assets privats necessaris

`public/private/` no és al git ni al ZIP. Per renderitzar, copia-hi:

| Ruta | Origen | sha256 |
| --- | --- | --- |
| `public/private/fe-i-ciencia.wav` | Narració (WAV mono, 44,1 kHz, 157,72 s) usada per la transcripció revisada | `cff7f563…24106c6c` |
| `public/private/music/ornave-lofi-vinyl-teapot-553356.mp3` | Còpia exacta de `resources/background-music/lofi-vinyl-teapot.mp3` | `558757c9…dd0b2d90` |

Els efectes de so (`public/sfx/`) són còpies exactes de `resources/sound-effects/`
i sí que s'inclouen al ZIP.

## Estructura

| Fitxer | Ús |
| --- | --- |
| `FeICiencia.tsx` | Muntatge: 12 escenes en `<Series>`, escombrada i efecte a cada tall, subtítols, narració i música |
| `data/captions-reviewed.json` | Còpia exacta dels captions revisats, amb temps per paraula |
| `data/timeline.ts` | Escenes en segons de narració, pàgines de subtítols i rangs amagats |
| `data/transitions.ts` | Efecte de so de cada tall, amb nivells mesurats |
| `data/music.ts` | Corba de volum de la música |
| `data/tetera-cues.ts` | Cues de l'escena de la tetera |
| `scenes/`, `illustrations/`, `components/` | Escenes, il·lustracions originals i components |

El mapa de beats és a `.cache/captions/fe-i-ciencia-20261004/beats.json` (local)
i al ZIP com a `docs/beats.json`.

| # | Escena | Narració |
| --- | --- | --- |
| 01 | Obertura | 0–13,3 s |
| 02 | Veus | 13,3–30,3 s |
| 03 | Pregunta | 30,3–39,2 s |
| 04 | Tetera (pilot) | 39,2–88,6 s |
| 05 | Newton | 88,6–101,5 s |
| 06 | Salm | 101,5–108,45 s |
| 07 | Creació | 108,45–113,75 s |
| 08 | Analogies | 113,75–122,72 s |
| 09 | Univers | 122,72–131,35 s |
| 10 | Crist | 131,35–143,5 s |
| 11 | Colossencs | 143,5–156 s |
| 12 | Logo | 156–159,6 s |

## Decisions

- La narració comença al fotograma 0, sense retalls ni canvis de velocitat. Subtítols i cues usen els temps revisats.
- Els subtítols s'agrupen per sentit i s'amaguen quan la mateixa frase ja és a pantalla: títol, pregunta sobre la veritat, cita de Newton, Salm, «davant la majestuositat i la grandesa de Déu» i Colossencs 1:15-16.
- Ortografia: «ateïsme», tal com es va demanar, i «grandesa».
- El signe ≠ es dibuixa en SVG perquè el subconjunt llatí d'Open Sans no el conté.
- Transicions: escombrada blanca de 16 fotogrames centrada al tall i un efecte de càmera de `resources/sound-effects`. L'atac cau al tall, el nivell s'iguala a la veu (−30 dBFS a la finestra més forta, pic ≤ −18 dBFS) i el so acaba abans de la veu següent.
- Música: «Lofi Vinyl Teapot» a −16 LU respecte de la veu mentre parla, −12 LU a les pauses i −4 LU sota el logo. Entra en 1 s i s'esvaeix en 1,5 s.
- Logo: plantilla `Logo Stroke Draw` del catàleg (preset ELG, versió blanca) a escala 3.

## Verificació i limitacions

- `npm run build` sense errors.
- 169 fotogrames renderitzats i mesurats: marges, subtítols en dues línies com a màxim i escombrades que tapen els talls.
- MP4: 1080 × 1920, 30 fps, H.264 + AAC 48 kHz, 4788 fotogrames. Els fotogrames extrets coincideixen amb les mostres verificades (diferència mitjana ≤ 1,5/255).
- Àudio de l'MP4: desfasament 0 respecte de la mescla verificada; −36,8 LUFS i pic real −18,2 dBTP. La veu queda 18,8 dB per sobre de la música (mediana).
- Variant per a xarxes: paquets de vídeo idèntics (MD5), mateix desfasament 0, −13,9 LUFS i pic real −1,4 dBTP. El guany és gairebé uniforme (+23,0 dB amb veu, +22,5 dB a les pauses), de manera que es manté l'equilibri veu/música.
- **Pendent de revisió humana.** L'agent no pot veure imatges ni escoltar àudio. Cal revisar la llegibilitat a mida mòbil, la fluïdesa del moviment, la sincronització percebuda i el nivell i l'encaix de la música i els efectes.

## Llicències i permisos

- Música: «Lofi Vinyl Teapot», ornave (ID 553356). El catàleg no en registra la llicència; cal confirmar-la abans de publicar.
- Efectes: freesound_community (6243, 44542, 96604) i kauasilbershlachparodes (494026, 494029, 494030). El catàleg no en registra la llicència.
- `Logo Stroke Draw`: adaptació de React Video Editor amb permís d'ús intern (catàleg, 4/10/2026). El permís no autoritza a redistribuir-ne el codi, que és dins del ZIP: no publiqueu el ZIP.
- Fonts: Urbanist i Open Sans (SIL Open Font License 1.1, paquets `@fontsource`).

## Plantilla reutilitzable

La base genèrica d'aquest vídeo és a `src/templates/elg-narrated-video/`, amb el
seu propi README.
