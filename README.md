# lg-video-agent

Projecte base per crear vídeos de marca i comunicació per a Església la Garriga amb Remotion.

## Objectiu

Aquest repositori serveix com a espai per desenvolupar un agent/assistència que ajudi a crear vídeos visuals, narratius i elegants amb un estil apropiat a una comunitat cristiana i a la identitat de l'església.

## Estructura

- `.claude/agents/lg-remotion-editor.md`: definició i instruccions completes de LG Remotion Editor per a Claude Code
- `.agents/skills/elg-brand/SKILL.md`: skill reutilitzable de marca amb tipografia, colors, gradients, composició i moviment; proposta inicial pendent de validació
- `.agents/skills/mlx-whisper/SKILL.md`: transcripció local de narracions i timestamps per paraula per generar captions; s'aplica sempre que s'aporta un àudio narrat per fer un vídeo
- `.agents/skills/narrative-beats/SKILL.md`: mapa de beats narratius vinculat a la transcripció revisada per planificar els elements gràfics abans del muntatge
- `.agents/skills/remotion-verify/SKILL.md`: verificació visual, de moviment, auditiva i del fitxer exportat, amb evidències abans del lliurament final
- `.agents/skills/remotion-best-practices/SKILL.md`: router dels dotze skills oficials de `remotion-dev/skills`, instal·lats localment per a GitHub Copilot i Claude Code; procedència registrada a `skills-lock.json`

## Flux de treball recomanat

1. Utilitza `.claude/agents/lg-remotion-editor.md` per definir les instruccions de l'agent.
2. Genera components i composicions a Remotion dins `src/`.
3. Ajusta el text, colors, transicions i temps de les seqüències segons la campanya o esdeveniment.
4. Aplica `remotion-verify`: inspecciona fotogrames i moviment, contrasta l'àudio quan correspongui i corregeix els problemes detectats.
5. Si es demana exportació, renderitza i verifica també el fitxer final abans de lliurar-lo. Registra les evidències i limitacions a `verification.json` dins `.cache/verification/<run-id>/`. `npm run build` només comprova TypeScript.

## Estil visual

- Minimalista i elegant
- Colors netes i elevats
- Narrativa clara amb text i moviment controlat
- Adaptat a serveis, difusió, testimonis i moments destacats

## Comença

### Skills oficials de Remotion

S'han instal·lat els dotze skills oficials al workspace amb:

```sh
npx --yes skills add remotion-dev/skills --skill '*' --agent claude-code github-copilot --yes
```

No és una instal·lació global ni una actualització dels paquets del vídeo.
La definició de `lg-remotion-editor` precarrega `remotion-best-practices` i
`remotion-markup`, i exigeix llegir-los explícitament si el client no suporta
la precàrrega. El router selecciona les guies de creació, captions, preview,
render i documentació segons la tasca; per a vídeos de múltiples escenes,
l'agent també ha de seguir les guies de layout i seqüenciació.
Els skills locals de marca, narració, storyboard i verificació continuen
vigents. Si el client no descobreix els skills nous a la sessió actual,
inicia una sessió nova o recarrega el workspace.

Des de Claude Code, demana: «Utilitza l'agent lg-remotion-editor per crear un vídeo».

Si no detecta l'agent reanomenat, reinicia Claude Code. Les instruccions completes són a `.claude/agents/lg-remotion-editor.md`.

La definició de l'agent s'ha traslladat de `.github/agents/` a `.claude/agents/`; ja no es registra al selector d'agents de Copilot.

## Narració i captions amb MLX Whisper

Quan aportes un arxiu d'àudio amb veu narrada per crear un vídeo, l'agent aplica
la skill `mlx-whisper`, tret que demanis explícitament no transcriure o fer servir
un altre motor. La transcripció es fa localment, sense enviar l'àudio a una API.
Els timestamps per paraula són estimacions i cal revisar-ne la sincronització.

Sempre aportaràs també el text de la narració per contrastar-lo amb la
transcripció generada. Si falta, l'agent el demanarà abans de continuar.
Per als vídeos narrats, l'ordre és: **àudio → transcripció → revisió amb el text
aportat → mapa de beats → composició Remotion → verificació visual i auditiva →
lliurament final**. La skill `narrative-beats`
genera un `beats.json` separat amb idees, ancoratges temporals i propostes visuals,
sense modificar els captions. La revisió textual no verifica la sincronització
ni l'èmfasi de la veu; aquestes comprovacions requereixen contrast amb l'àudio.

### Requisits previs

- Mac amb Apple Silicon (M1 o posterior). Aquest flux no està preparat per a
	Mac Intel, Windows o Linux.
- Python natiu `arm64`; es recomana Python 3.11 o 3.12. Evita executar-lo sota
	Rosetta. Comprova'l amb `python3 -c "import platform; print(platform.machine())"`.
- Homebrew per instal·lar `ffmpeg`, o una instal·lació equivalent amb `ffmpeg`
	disponible al PATH. `brew --version` i `python3 --version` han de funcionar
	abans de les comandes següents.
- Connexió per instal·lar paquets i per a la primera descàrrega del model de
	Hugging Face, que pot ocupar diversos GB. Reserva RAM i espai de disc suficients;
	la mida depèn del model. Les execucions següents reutilitzen la cache local.
- Un arxiu d'àudio llegible amb la narració, preferiblement sense música de fons.
	No retallis pauses si el vídeo ha d'utilitzar l'àudio original.

Executa aquesta preparació una vegada, des de l'arrel del repositori:

```sh
brew install ffmpeg
python3 -m venv "$HOME/.venvs/lg-video-agent-whisper"
"$HOME/.venvs/lg-video-agent-whisper/bin/python" -m pip install --upgrade pip
"$HOME/.venvs/lg-video-agent-whisper/bin/python" -m pip install mlx-whisper
```

Comprova la instal·lació abans de transcriure:

```sh
ffmpeg -version
"$HOME/.venvs/lg-video-agent-whisper/bin/python" -c "import platform, mlx_whisper; assert platform.system() == 'Darwin' and platform.machine() == 'arm64'; print('MLX Whisper disponible')"
```

Aquesta comprovació no descarrega el model ni demostra encara la precisió dels
captions. El model es descarrega automàticament en la primera transcripció:

```sh
"$HOME/.venvs/lg-video-agent-whisper/bin/python" \
	.agents/skills/mlx-whisper/scripts/transcribe.py \
	"/ruta/narracio.wav" --output-dir .cache/captions/narracio --language ca
```

Substitueix la ruta d'exemple per l'arxiu real. El model per defecte és
`mlx-community/whisper-large-v3-turbo`; pots canviar-lo amb `--model` per un altre
model Whisper compatible amb MLX o una carpeta local. Utilitza `--language auto`
per detectar l'idioma, o un codi com `ca`, `es` o `en`. No es tradueix la narració.

Es generen `transcription.json` (resultat complet) i `captions.json` (text, idioma
i paraules amb `text`, `start` i `end` en segons). No se sobreescriuen resultats
existents: tria una carpeta de sortida nova per repetir la prova. L'agent utilitza
aquests temps per sincronitzar els captions amb la narració a Remotion.

L'entorn Python queda fora del repositori i els resultats a `.cache/`, que està
ignorada per git. No afegeixis narracions privades ni models al repositori. Revisa
el text i la sincronització de l'inici, mig i final abans de publicar el vídeo.

## Video Agent Resources

Arrenca la galeria local de recursos:

```sh
npm install
npm run resources:deploy
```

Obre l'adreça que mostra el terminal (per defecte, http://127.0.0.1:4173).
Si el port està ocupat, s'utilitza el següent disponible.

La pestanya **Sound Effects** inclou set efectes de càmera amb noms llegibles,
descripcions, tags, autoria original i descàrrega en MP3. Cada efecte té un
reproductor amb controls; iniciar-ne un atura el que estigui sonant. La cerca
filtra per nom, descripció, tags i autoria. Els fitxers són a
`resources/sound-effects/` i el catàleg a `resources/sound-effects.ts`.
Les descripcions parteixen dels noms originals aportats; els identificadors
originals es conserven al catàleg, sense assumir-ne cap llicència.

La pestanya **Background Music** recull música de fons amb el mateix format:
reproductor, cerca, tags, autoria original i descàrrega en MP3. Inclou
**Lofi Vinyl Teapot** d'ornave (identificador original 553356, 3:37) i
**Lofi** de sub_clair (identificador original 586095, 3:34), amb introducció
suau, un descans tranquil entre 1:44 i 2:09 i un final que s'esvaeix a 3:29.
Iniciar una pista atura la que estigui sonant i canviar de pestanya atura la
reproducció. Els fitxers són a `resources/background-music/` i el catàleg a
`resources/background-music.ts`, també sense assumir-ne cap llicència.

Genera la pàgina estàtica amb `npm run resources:build` i obre
`resources/dist/index.html` directament al navegador. Els set efectes i les dues
pistes de música queden incrustats dins l'HTML (uns 21 MB) i es poden escoltar sense
servidor ni connexió.

La pestanya Templates mostra les categories, descripcions i tags de
`.agents/skills/react-templates/catalog.md` i reprodueix els components TSX
parametrizats en bucle només mentre el cursor és sobre el template; en sortir,
la reproducció s'atura. Inclou cerca, filtres de categoria, vista ampliada
i consulta del codi. La vista ampliada conserva controls manuals per a
dispositius tàctils i navegació amb teclat.

El selector **Original / ELG** canvia el preset dels trenta-tres templates, també
a la vista ampliada. ELG és el preset inicial. Aquest selector és independent
del tema clar/fosc de la interfície.

La categoria **Logo** inclou Logo Stroke Draw de React Video Editor, importat
amb permís confirmat per l'usuari. Original conserva el traçat de les formes i
els temps del proveïdor. L'animació ELG dura 3 segons en total: els set
subtraços de la fulla se solapen amb moviment suau durant 1,4 segons,
el farciment es fon durant 0,4 segons i després es revela, durant 0,4 segons,
el lettering vectorial original
«Església la Garriga» just a sota, amb les formes i els degradats del SVG
aportat, sense substituir-lo per text d'una font. El logo complet es manté
visible durant els 0,8 segons finals;
les variants comparteixen els
controls de preview i inspecció del codi. No es declara llicència MIT ni permís
de redistribució pública del component.

En mode fosc ELG, tant el traç i el farciment de la fulla com el lettering
vectorial es mostren en blanc. El mode clar conserva els degradats originals
del SVG; les formes i els temps de l'animació no canvien.

La categoria **Quotes** inclou Quote Card, Testimonial Card, Social Post,
Profile Card, Video Testimonial i el nou **Scripture Reference**. Les fonts TSX, descripcions, tags i URL
originals dels cinc imports es conserven al catàleg. Video Testimonial utilitza una fotografia
de mostra empaquetada localment amb llicència Unsplash i una waveform animada,
no un vídeo real. Substitueix els noms, les cites i la imatge de mostra abans
de publicar contingut real. Els cinc components comparteixen els presets i
l'interruptor Clar/Fosc, sense duplicats de marca.

Les dues plantilles originals noves són **Complementary Panels** a Explainer
i **Scripture Reference** a Quotes. No provenen d'un proveïdor extern:
Original és el disseny neutre local i ELG aplica fonts i paleta compartides.
La comparació revela dos panells i després els connecta, sense «VS», marcadors
ni guanyadors. La citació mostra text llarg en fragments complets amb la
referència persistent, sense avatars ni mètriques socials. Hi ha reflow
vertical propi, no un retall del format horitzontal, i superfícies sòlides
per al text en mode fosc. Les previews duren sis i vuit segons, respectivament.
Configura els textos i les cues abans de publicar. En citacions llargues,
allarga la composició per incloure totes les pàgines; la plantilla rebutja
una durada insuficient en lloc d'ometre el final.

La categoria **Diagram** afegeix setze templates: Venn de dos i tres cercles,
Versus Split, Comparison Matrix, Flowchart, Cycle Diagram, Org Chart, Mind Map,
Pyramid Diagram, Concentric Circles, SWOT Analysis, Pie Chart, Line Chart,
Radar Chart, Gauge Meter i Quadrant Chart. Conserven les descripcions i els tags
del proveïdor, el contingut per defecte, els SVG i les animacions originals.
La galeria utilitza el mateix llenç real de 960 × 540 que el preview del proveïdor.
Els gràfics mantenen les fórmules originals; valida les dades abans de publicar.
Les condicions del proveïdor restringeixen redistribuir les fonts com a catàleg,
starter kit o biblioteca competidora; aquests recursos són per a producció interna.

Els Quotes i Diagram utilitzen `resolveTemplateAppearance`: ELG canvia fonts i paleta,
però conserva mides de text, interlineats, amplades, espaiats, radis i animacions
del proveïdor. Els tokens de mida d'una composició nova no es traslladen
automàticament a les targetes importades. El procés i els controls de fidelitat
es documenten a [Import Templates](.agents/skills/import-templates/SKILL.md).

L'interruptor **Clar / Fosc**, al costat del selector d'estil, canvia la paleta
de les previsualitzacions i comparteix l'estat amb la vista ampliada. Manté la
tipografia i les animacions del preset. No modifica el tema de la web ni el
codi font dels templates. El mode inicial és Clar, amb la paleta pròpia del preset.

En ELG/Clar, els sis templates de Text utilitzen el gradient d'accent a les
lletres sobre blanc, també Bold Text Punch. `headingBackground` controla
aquest tractament; Gradient Text conserva el barrat de color per caràcter.
Els Explainer i els presets Original no canvien. El gradient exacte a les
lletres no garanteix el contrast general de 4,5:1 en tot el titular.

En ELG, el mode Fosc utilitza el gradient de marca com a fons del llenç, amb
text blanc, en lloc d'un fons negre. Les targetes de Before & After mantenen
superfícies fosques per llegibilitat. El text directament sobre el gradient
no garanteix el contrast general de 4,5:1 a tot el fons; és una adaptació
demanada per a les previsualitzacions. Original/Fosc conserva el fons fosc sòlid.

Per validar i generar una versió HTML autocontinguda a `resources/dist/index.html`:

```sh
npm run resources:build
```

Els nous templates apareixen quan es registren al catàleg amb un enllaç
al seu fitxer TSX dins d'una carpeta de categoria. La galeria no modifica
les composicions del vídeo.

### Temes dels templates

Cada template té un únic component i una prop `theme` opcional. Els presets
es defineixen a `.agents/skills/react-templates/theme.ts`:

```tsx
import { SpringScaleIn } from './.agents/skills/react-templates/text/spring-scale-in';
import { templatePresets } from './.agents/skills/react-templates/theme';

<SpringScaleIn text="Benvinguts" theme={templatePresets.elg} />;

<SpringScaleIn
	text="Una nova trobada"
	theme={{
		...templatePresets.elg,
		headingSize: 96,
		motion: { ...templatePresets.elg.motion, durationFrames: 18 },
	}}
/>;
```

Els imports de l'exemple són relatius a l'arrel; ajusta'ls des del fitxer
que els utilitzi. Sense `theme`, es mantenen els valors predeterminats del
proveïdor. Els camps de contingut no depenen del tema; les props antigues
`textColor` i `bgColor`, si es passen explícitament, tenen prioritat.

ELG aplica Urbanist 700, Open Sans 400/700, text `#12180c` sobre blanc,
espaiat zero, marges del 8% i entrades suaus de 16 frames a 30 fps. Les mides
de referència s'escalen segons l'amplada de la composició. Els titulars dels
sis templates de Text tenen `textHeadingScale: 2`: 176 px a 1920 i 88 px
al llenç de 960 de la galeria, sense ampliar els Explainer.

Gradient Text conserva l'entrada per lletres, el barrat de color i el glow
subtil. Els accents es barregen amb el color de contrast (`accentTextMix: 0.6`)
per garantir llegibilitat. Bold Text Punch utilitza el gradient `accentBackground`
com a fons i conserva l'escala i la sacsejada. El text blanc es manté sobre
el gradient directament, sense base negra, per petició de l'usuari;
`inverseTextColor` controla el text. El contrast a l'extrem més clar no arriba
al criteri general de 4,5:1. Són adaptacions específiques dels templates, no
canvis a les pautes generals de marca. Per preferir les alternatives suaus,
passa `motion: { ...templatePresets.elg.motion, preserveEffects: false }`.
Allarga la composició si afegeixes més contingut perquè es pugui llegir.

Les fonts llatines, inclosos els caràcters catalans, provenen dels paquets
locals `@fontsource/urbanist` i `@fontsource/open-sans`. El loader compartit
les espera abans de renderitzar. L'HTML generat les incorpora sense connexions
externes i inclou els avisos i les llicències SIL OFL desplegables al peu.
Si reutilitzes els components en un altre projecte, conserva el contracte,
el loader i les dependències; empaqueta també qualsevol font personalitzada.

Comprova el contracte del tema amb Node 22.6 o posterior:

```sh
node --experimental-strip-types --test .agents/skills/react-templates/theme.test.mjs
```

Els fitxers TSX locals són adaptacions, no còpies intactes del codi original.
El catàleg conserva les descripcions, tags, URL i llicències del proveïdor.
