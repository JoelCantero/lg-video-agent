# Una veritat que no oprimeix · nota del projecte

Vídeo vertical narrat per a Església la Garriga, fet amb Remotion per LG Video
Agent el 8 d'octubre de 2026 a partir de la narració i el guió aportats.

| | |
| --- | --- |
| Composició | `UnaVeritat` (carpeta «UnaVeritat» de Studio) |
| Entrada | `src/index.tsx` |
| Format | 1080 × 1920 (9:16), 30 fps |
| Durada | 6519 fotogrames · 217,3 s |
| Escenes soltes | `UnaVeritat-Escenes/*`, per revisar cada escena per separat |

## Previsualitzar i exportar

```sh
npm ci
npx remotion studio src/index.tsx   # http://localhost:3000/UnaVeritat
npm run build                       # comprovació TypeScript
npx --no-install remotion render src/index.tsx UnaVeritat out/una-veritat.mp4 --codec=h264
```

`npm run render` exporta `EsglesiaLaGarriga`, no aquest vídeo. Abans de
renderitzar cal aportar els assets privats descrits més avall.

Variant per a xarxes (mateix vídeo, àudio a −14 LUFS i −1,5 dBTP). Els valors
`measured_*` són de la primera passada sobre l'exportació del 8/10/2026; si
canvia la mescla, cal repetir la primera passada:

```sh
ffmpeg -i out/una-veritat.mp4 -map 0:a -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -
ffmpeg -i out/una-veritat.mp4 -map 0:v -map 0:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=-34.89:measured_TP=-16.37:measured_LRA=4.20:measured_thresh=-45.54:offset=0.63:linear=true" \
  -c:a aac -b:a 320k -ar 48000 out/una-veritat-xarxes-14lufs.mp4
```

## Lliurament del 8/10/2026

| Fitxer | Contingut |
| --- | --- |
| `out/una-veritat-20261008-211810.mp4` | Mescla del preview (−34,9 LUFS), H.264 + AAC, 31 MB |
| `out/una-veritat-20261008-211810-xarxes-14lufs.mp4` | Mateixa pista de vídeo; àudio a −14,3 LUFS per a xarxes |
| `out/una-veritat-20261008-211810-projecte.zip` | Codi reproduïble, sense els assets privats |
| `.cache/verification/una-veritat-export-20261008-211810/` | Evidències de l'exportació (local) |

## Assets privats necessaris

`public/private/` no és al git ni al ZIP. Per renderitzar, cal:

| Ruta | Origen | sha256 |
| --- | --- | --- |
| `public/private/una-veritat.wav` | `Una veritat que no oprimeix .m4a` convertit a WAV mono 44,1 kHz (els dos canals eren idèntics): `ffmpeg -i "Una veritat que no oprimeix .m4a" -ac 1 -ar 44100 -c:a pcm_s16le public/private/una-veritat.wav` | `97d35ea0…d94f7621` |
| `public/private/music/sub_clair-lofi-586095-minus26db.wav` | `resources/background-music/sub-clair-lofi.mp3` rebaixat 26 dB: `ffmpeg -i resources/background-music/sub-clair-lofi.mp3 -af volume=-26dB -c:a pcm_s16le -ar 48000 public/private/music/sub_clair-lofi-586095-minus26db.wav` | `c75de4a4…b9046286` |

Els efectes de so (`public/sfx/`) són còpies exactes de `resources/sound-effects/`
i sí que s'inclouen al ZIP.

## Estructura

| Fitxer | Ús |
| --- | --- |
| `UnaVeritat.tsx` | Muntatge: 15 escenes en `<Series>`, escombrada i efecte a cada tall, subtítols, narració i música |
| `data/captions-reviewed.json` | Captions revisats, amb temps per paraula i les decisions de revisió |
| `data/timeline.ts` | Escenes en segons de narració, pàgines de subtítols i rangs amagats |
| `data/transitions.ts` | Efecte de so de cada tall, amb nivells mesurats |
| `data/music.ts` | Inici, còpia rebaixada i corba de volum de la música |
| `scenes/`, `illustrations/`, `motion.ts` | Escenes, il·lustracions originals i ajudes d'animació |

La transcripció original i el mapa de beats són a
`.cache/captions/una-veritat-20261008/` (local) i al ZIP com a `docs/`.

| # | Escena | Narració |
| --- | --- | --- |
| 01 | Obertura | 0–6,77 s |
| 02 | Opressor | 6,77–23,1 s |
| 03 | Desconfiança | 23,1–31,57 s |
| 04 | Relativisme | 31,57–57,63 s |
| 05 | Problema | 57,63–77,4 s |
| 06 | Contradicció | 77,4–89,87 s |
| 07 | Necessitem | 89,87–107,44 s |
| 08 | Pregunta | 107,44–114,44 s |
| 09 | Filipencs 2:6-7 | 114,44–133,12 s |
| 10 | Descens | 133,12–146,55 s |
| 11 | Mans | 146,55–159,95 s |
| 12 | Nom | 159,95–172,88 s |
| 13 | Llum | 172,88–195,16 s |
| 14 | Evangeli | 195,16–214,3 s |
| 15 | Logo | 214,3–217,3 s |

## Decisions

- Transcripció local amb MLX Whisper (`large-v3-turbo`, català), revisada amb el guió. Es manté el text del guió on Whisper s'equivocava («Ell», «aferrar a la», «creure en la», «com a», «Paradoxalment») i el que es diu realment on la veu canvia el guió: «**Jesús** no ens va salvar» (160,6 s) i «convertint en **un** opressor» (12,2 s). Pendents de confirmació de l'usuari.
- Errates del guió corregides: «joj» → «jo» i «Saps que vol dir aixó?» → «Saps què vol dir això?». S'ha eliminat un «Gràcies.» final que Whisper havia inventat sobre el silenci.
- La narració comença al fotograma 0, sense retalls ni canvis de velocitat. Les vores de paraula situades dins d'una pausa s'han ajustat a l'energia mesurada de la veu.
- Subtítols amagats on el mateix text és a pantalla: títol, «no existeix cap veritat absoluta», «Necessitem un absolut…», la pregunta clau, Filipencs 2:6-7, «Saps què vol dir això?», Filipencs 2:9 i «una veritat absoluta que no oprimeix».
- Plantilles del catàleg sense modificar: Key Question, Narrated Verse (el verset passa de pàgina a la pausa després de «res:») i Logo Stroke Draw (ELG, versió blanca, escala 3). La resta són il·lustracions originals: el disc de llum que s'esquerda i es recompon, el puny que s'obre, la balança, la V de Filipencs 2 i el con de llum.
- Transicions: escombrada blanca de 16 fotogrames centrada al tall i un efecte de càmera de `resources/sound-effects`, al nivell de la veu forta (pic ≤ −16 dBFS) i acabat abans de la paraula següent.
- Música: «Lofi» de sub_clair (586095). Entra als 8,2 s, a la pausa després de «Històricament,», perquè el seu final natural caigui sobre les últimes paraules i el logo. −16 LU respecte de la veu mentre parla, −12 LU a les pauses i −4 LU sota el logo. Es fa servir una còpia rebaixada 26 dB perquè el render arrodoneix el volum a passos d'1/97.

## Verificació i limitacions

- `npm run build` sense errors; proves de temes de les plantilles (25/25).
- Més de 200 fotogrames renderitzats i mesurats: subtítols d'una o dues línies (cap de tres) amb marges ≥ 70 px, i escombrades que tapen el 93–100 % de cada tall.
- MP4: 1080 × 1920, 30 fps, H.264 + AAC 48 kHz, 6519 fotogrames. 23 fotogrames extrets coincideixen amb el render del codi (diferència mitjana ≤ 0,95/255).
- Àudio de l'MP4: desfasament 0 respecte de la mescla verificada; −34,9 LUFS i pic real −16,4 dBTP. La música coincideix amb la corba dissenyada (±0,04 dB) i queda 16 LU per sota de la veu mentre parla.
- Variant per a xarxes: paquets de vídeo idèntics (MD5), desfasament 0, −14,3 LUFS i pic real −1,4 dBTP. El guany és gairebé uniforme (+20,7 dB amb veu, +21,0 dB a les pauses).
- **Pendent de revisió humana.** L'agent no pot veure imatges ni escoltar àudio: cal revisar la llegibilitat a mida de mòbil, el moviment, la sincronització percebuda i l'encaix de la música i els efectes.

## Llicències i permisos

- Música: «Lofi», sub_clair (ID 586095). El catàleg no en registra la llicència; cal confirmar-la abans de publicar.
- Efectes: freesound_community (44542, 96604, 6243) i kauasilbershlachparodes (494026, 494029, 494030). El catàleg no en registra la llicència.
- `Logo Stroke Draw`: adaptació de React Video Editor amb permís d'ús intern (catàleg, 4/10/2026). El permís no autoritza a redistribuir-ne el codi, que és dins del ZIP: no publiqueu el ZIP.
- Key Question i Narrated Verse: codi original del projecte (LG Video Agent).
- Fonts: Urbanist i Open Sans (SIL Open Font License 1.1, paquets `@fontsource`).
- Filipencs 2:6-7: text literal aportat per l'usuari.

## Plantilles reutilitzables

Aquest vídeo es basa en [`src/templates/elg-narrated-video/`](../templates/elg-narrated-video/README.md).
Les il·lustracions genèriques (disc de llum, mà/puny, persona, balança, símbols)
es conserven com a plantilla independent a
[`src/templates/elg-illustrations/`](../templates/elg-illustrations/README.md).
