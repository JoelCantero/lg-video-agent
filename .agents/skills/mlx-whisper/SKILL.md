---
name: mlx-whisper
description: "Use whenever the user provides an audio file containing narrated speech, voiceover, or a recorded script to create a video. Transcribe locally with mlx-whisper on Apple Silicon and generate word-level timestamps for Remotion captions. Trigger also for audio narrat, veu narrada, locucio, transcripcio, subtitols and captions."
---

# MLX Whisper

## Activacio obligatoria

Aplica aquesta skill sempre que l'usuari aporti un arxiu d'audio amb veu narrada
per fer un video, encara que no demani explicitament una transcripcio.
No s'aplica a musica o efectes sense veu. Si l'usuari prohibeix transcriure o
demana un altre motor, respecta aquesta indicacio i explica l'excepcio.

## Requisits

- macOS amb Apple Silicon (M1 o posterior) i Python natiu `arm64`.
- Python 3.11 o 3.12 recomanat, entorn virtual amb `mlx-whisper` i `ffmpeg` al PATH.
- Connexio inicial per instal-lar dependencies i descarregar el model de Hugging Face.
  La inferencia es local; l'audio no s'envia a una API. Amb el model en cache,
  es pot reutilitzar localment. No prometis funcionament offline sense verificar-lo.
- RAM i disc suficients per al model i l'audio. No instal-lis dependencies ni
  descarreguis models grans sense informar l'usuari. Si falta algun requisit,
  consulta la seccio de requisits de `README.md`; no canviis a una API silenciosament.

## Flux de treball

1. Localitza l'arxiu real aportat i comprova que es llegible. Si nomes hi ha una
   referencia a un adjunt inaccessible, demana'n la ruta; no inventis l'audio.
2. Conserva l'original. Utilitza la narracio sense musica quan estigui disponible.
   No retallis silencis ni canviis velocitat: els temps han de correspondre a
   l'audio que es posara al video.
3. Executa el [script de transcripcio](./scripts/transcribe.py) des de l'arrel:

   ```sh
   "$HOME/.venvs/lg-video-agent-whisper/bin/python" \
     .agents/skills/mlx-whisper/scripts/transcribe.py \
     "/ruta/narracio.wav" --output-dir .cache/captions/narracio --language ca
   ```

   Catala es el valor per defecte. Utilitza `--language es`, `--language en` o
   `--language auto` segons la narracio real. Es transcriu, no es tradueix.
   El model inicial es `mlx-community/whisper-large-v3-turbo`; `--model` permet
   un altre model Whisper compatible amb MLX o un directori local.
4. El script crea `transcription.json` amb el resultat complet i `captions.json`:

   ```json
   {
     "language": "ca",
     "timeUnit": "seconds",
     "text": " Bon dia.",
     "words": [{"text": " Bon", "start": 0.2, "end": 0.5}]
   }
   ```

   L'exemple nomes mostra el contracte; no es una transcripcio real. Cada
   paraula conserva el text retornat pel motor, inclosos espais i puntuacio.
   Els temps son segons relatius a l'inici de l'arxiu d'audio.
5. L'usuari sempre aportara el text de la narracio per revisar la transcripcio
   generada. Si falta, demana'l abans de donar per revisat el text i continuar
   amb els beats o el muntatge visual. Contrasta-hi la transcripcio en catala,
   especialment noms propis, referencies i citacions; consulta les discrepancies
   amb l'usuari i conserva una copia revisada sense sobreescriure els originals.
   El text aportat serveix de referencia, no per substituir paraules mentre es
   mantenen timestamps que ja no corresponen a l'audio. No inventis temps per
   paraules absents. Si no hi ha paraules amb temps valids, atura la integracio.
   L'aprovacio textual no implica verificacio auditiva ni de sincronitzacio.
6. Si es prepara el muntatge visual, aplica `narrative-beats` llegint
   `.agents/skills/narrative-beats/SKILL.md` des de l'arrel. Respecta l'ordre
   audio -> transcripcio -> revisio amb el text aportat -> mapa de beats ->
   composicio Remotion. Reutilitza els captions revisats; no tornis a transcriure
   nomes per generar beats. Si nomes es demana transcriure, acaba amb la revisio
   i el lliurament, sense generar beats ni composicio.
7. Integra la narracio i els captions a la composicio existent. Copia nomes els
   fitxers necessaris a `public/` quan calgui servir-los amb `staticFile()`;
   no publiquis ni afegeixis al git audio privat, caches o models sense permis.
   Per ressaltar paraules, calcula `time = frame / fps` i comprova
   `start <= time && time < end`. Si la narracio comenca mes tard al video,
   aplica el mateix desplacament a l'audio i als captions. Respecta les pauses,
   agrupa en blocs llegibles i no deixis activa l'ultima paraula durant silencis.
8. Comprova fragments de l'inici, mig i final escoltant l'audio amb el preview,
   i executa `npm run build` si has modificat codi Remotion. Els timestamps son
   estimacions, no forced alignment. Si no sincronitzen prou, informa'n i
   proposa alineacio amb un model verificat per a l'idioma; no la donis per feta.
9. Informa del model, idioma, rutes generades i comprovacions reals. No afirmis
   que s'ha transcrit o revisat la sincronitzacio si nomes has validat el script.

## Referencia

[MLX Whisper oficial](https://github.com/ml-explore/mlx-examples/tree/main/whisper)
documenta la instal-lacio, `path_or_hf_repo` i `word_timestamps=True`.