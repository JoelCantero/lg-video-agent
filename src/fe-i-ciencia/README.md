# Són la ciència i la fe incompatibles? · nota del projecte

Vídeo vertical narrat per a Església la Garriga, fet amb Remotion per LG Video
Agent el 4 d'octubre de 2026. El 8 d'octubre es va passar a la nova gravació de la
narració, amb els temps de cada escena adaptats.

| | |
| --- | --- |
| Composició | `FeICiencia` (carpeta «FeICiencia» de Studio) |
| Entrada | `src/index.tsx` |
| Format | 1080 × 1920 (9:16), 30 fps |
| Durada | 5220 fotogrames · 174,0 s |
| Pilot aprovat | `FeICienciaPilotTetera` (escena de la tetera) |
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
8/10/2026; si canvia la mescla, torna a fer la primera passada:

```sh
ffmpeg -i out/fe-i-ciencia.mp4 -map 0:a -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -
ffmpeg -i out/fe-i-ciencia.mp4 -map 0:v -map 0:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=-35.12:measured_TP=-16.18:measured_LRA=3.40:measured_thresh=-45.64:offset=0.33:linear=true" \
  -c:a aac -b:a 320k -ar 48000 -movflags +faststart out/fe-i-ciencia-xarxes-14lufs.mp4
```

## Lliurament del 8/10/2026

Narració del 8/10/2026 (174,0 s).

| Fitxer | Contingut |
| --- | --- |
| `out/fe-i-ciencia-20261008-212017.mp4` | Mescla verificada (−35,1 LUFS) |
| `out/fe-i-ciencia-20261008-212017-xarxes-14lufs.mp4` | Mateixa pista de vídeo; àudio a −14,1 LUFS per a xarxes |
| `out/fe-i-ciencia-20261008-212017-projecte.zip` | Codi reproduïble, sense els assets privats |
| `.cache/verification/fe-i-ciencia-export-20261008-212017/` | Evidències de l'exportació (local) |

Els fitxers `out/fe-i-ciencia-20261004-222153*` són de la primera gravació (159,6 s).

## Assets privats necessaris

`public/private/` no és al git ni al ZIP. Per renderitzar, copia-hi:

| Ruta | Origen | sha256 |
| --- | --- | --- |
| `public/private/fe-i-ciencia-20261008.wav` | Narració del 8/10/2026 (WAV mono, 44,1 kHz, 171,14 s), convertida sense pèrdues de `Són la ciència i la fe incompatibles?.m4a` | `2a4e094c…89684939` |
| `public/private/music/ornave-lofi-vinyl-teapot-553356-minus20db.wav` | `ornave-lofi-vinyl-teapot-553356.mp3` (còpia exacta de `resources/background-music/lofi-vinyl-teapot.mp3`) rebaixada exactament 20 dB: `ffmpeg -i …mp3 -af volume=-20dB -c:a pcm_s16le …wav` | `d7fc68ac…4fe4cd93` |

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

El mapa de beats és a `.cache/captions/fe-i-ciencia-20261008/beats.json` (local).
La primera gravació i els seus captions i beats es conserven a `public/private/fe-i-ciencia.wav`
i `.cache/captions/fe-i-ciencia-20261004/`.

| # | Escena | Narració |
| --- | --- | --- |
| 01 | Obertura | 0–13,43 s |
| 02 | Veus | 13,43–31,1 s |
| 03 | Pregunta | 31,1–40,33 s |
| 04 | Tetera (pilot) | 40,33–93,7 s |
| 05 | Newton | 93,7–108,83 s |
| 06 | Salm | 108,83–117 s |
| 07 | Creació | 117–122,87 s |
| 08 | Analogies | 122,87–132,2 s |
| 09 | Univers | 132,2–141,27 s |
| 10 | Crist | 141,27–154,27 s |
| 11 | Colossencs | 154,27–170,4 s |
| 12 | Logo | 170,4–174 s |

## Decisions

- La narració comença al fotograma 0, sense retalls ni canvis de velocitat. Subtítols i cues usen els temps revisats.
- Nova gravació (8/10/2026): text revisat amb el guió i la revisió del 4/10. S'hi ha afegit «mateix» i «és la correcta», «necessito a Déu» tal com es diuen; «el filòsof» no es diu, i la targeta de Rosenberg entra a la pausa abans d'«Alex». La referència «Colossencs 1:15-16» es llegeix dues vegades i es manté fins que es confirmi si cal retallar-la. Cada tall cau just abans que torni la veu, amb el mateix marge que abans quan la pausa ho permet.
- Els subtítols s'agrupen per sentit i s'amaguen quan la mateixa frase ja és a pantalla: títol, pregunta sobre la veritat, cita de Newton, Salm, «davant la majestuositat i la grandesa de Déu» i Colossencs 1:15-16.
- Ortografia: «ateïsme», tal com es va demanar, i «grandesa».
- El signe ≠ es dibuixa en SVG perquè el subconjunt llatí d'Open Sans no el conté.
- Transicions: escombrada blanca de 16 fotogrames centrada al tall i un efecte de càmera de `resources/sound-effects`. L'atac cau al tall, el nivell s'iguala a la veu (−28 dBFS a la finestra més forta, pic ≤ −14,5 dBFS) i el so acaba abans de la veu següent.
- Música: «Lofi Vinyl Teapot» a −16 LU respecte de la veu mentre parla, −12 LU a les pauses i −4 LU sota el logo. Entra en 1 s i s'esvaeix en 1,5 s. S'usa una còpia rebaixada 20 dB perquè el render arrodoneix el volum a passos d'1/97: amb volums d'0,01–0,03 la música quedava 2–3 dB fora del disseny.
- Logo: plantilla `Logo Stroke Draw` del catàleg (preset ELG, versió blanca) a escala 3.

## Verificació i limitacions

Narració del 8/10/2026 (`.cache/verification/fe-i-ciencia-narracio-20261008-*`):

- `npm run build` sense errors; 199 cues dins de la seva escena; 284 referències a paraules comprovades contra el text nou.
- Àudio renderitzat: desfasament 0 amb la narració, −35,0 LUFS i pic real −16,0 dBTP. Música mesurada a −15,65 dB sota la veu (disseny −15,5); la veu queda 15,6 dB per sobre (mediana).
- 182 fotogrames: 81 estats de la verificació anterior portats a la mateixa paraula, 11 talls (escombrada ≥ 92,4 %), 55 pàgines de subtítols (màxim dues línies) i 13 pàgines amagades sense subtítols.

Exportació del 8/10/2026 (`.cache/verification/fe-i-ciencia-export-20261008-212017/`):

- `npm run build` sense errors; 198 referències a paraules tornades a comprovar abans de renderitzar.
- MP4: 1080 × 1920, 30 fps, H.264 + AAC 48 kHz, 5220 fotogrames, 174,0 s. 14 fotogrames extrets pel número exacte coincideixen amb les mostres verificades (diferència mitjana ≤ 1,0/255).
- Àudio de l'MP4: desfasament 0 i residu −38,8 dB respecte de la mescla verificada; −35,1 LUFS i pic real −16,2 dBTP.
- Variant per a xarxes: paquets de vídeo idèntics (MD5), desfasament 0, −14,1 LUFS i pic real −1,4 dBTP. El guany és uniforme (+21,4 dB amb veu i a les pauses), de manera que es manté l'equilibri veu/música.
- ZIP: descomprimit a part, compila i en renderitza fotogrames iguals als verificats.

Primera gravació (4/10/2026):

- `npm run build` sense errors.
- 169 fotogrames renderitzats i mesurats: marges, subtítols en dues línies com a màxim i escombrades que tapen els talls.
- MP4: 1080 × 1920, 30 fps, H.264 + AAC 48 kHz, 4788 fotogrames. Els fotogrames extrets coincideixen amb les mostres verificades (diferència mitjana ≤ 1,5/255).
- Àudio de l'MP4: desfasament 0 respecte de la mescla verificada; −36,8 LUFS i pic real −18,2 dBTP. La veu queda 18,8 dB per sobre de la música (mediana).
- Variant per a xarxes: paquets de vídeo idèntics (MD5), mateix desfasament 0, −13,9 LUFS i pic real −1,4 dBTP. El guany és gairebé uniforme (+23,0 dB amb veu, +22,5 dB a les pauses), de manera que es manté l'equilibri veu/música.

**Pendent de revisió humana, en les dues versions.** L'agent no pot veure imatges ni escoltar àudio. Cal revisar la llegibilitat a mida mòbil, la fluïdesa del moviment, la sincronització percebuda i el nivell i l'encaix de la música i els efectes.

## Llicències i permisos

- Música: «Lofi Vinyl Teapot», ornave (ID 553356). El catàleg no en registra la llicència; cal confirmar-la abans de publicar.
- Efectes: freesound_community (6243, 44542, 96604) i kauasilbershlachparodes (494026, 494029, 494030). El catàleg no en registra la llicència.
- `Logo Stroke Draw`: adaptació de React Video Editor amb permís d'ús intern (catàleg, 4/10/2026). El permís no autoritza a redistribuir-ne el codi, que és dins del ZIP: no publiqueu el ZIP.
- Fonts: Urbanist i Open Sans (SIL Open Font License 1.1, paquets `@fontsource`).

## Plantilla reutilitzable

La base genèrica d'aquest vídeo és a `src/templates/elg-narrated-video/`, amb el
seu propi README.
