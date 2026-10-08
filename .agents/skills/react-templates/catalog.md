# React Template Catalog

Templates are grouped by category. Source code paths are relative to this file.

The linked TSX files are local adaptations of provider code, obtained through Locomotion's "Show source code" control or React Video Editor's Source Code / MCP controls. Each template is a single reusable component with an optional `theme` prop, not a registered video composition or an unmodified source snapshot. Provider descriptions, tags, URLs and selected styles below remain original metadata.

Templates whose provider is LG Video Agent are original project components commissioned by the user, not imports or reconstructions of third-party code. Their Original preset is the local neutral design; ELG applies the shared brand appearance. No third-party license is asserted for them.

Use [the shared theme presets](./theme.ts): omit `theme` or pass `templatePresets.original` for provider-default styling, or pass `templatePresets.elg` for Urbanist/Open Sans, the ELG palette and safe margins. Text-only headlines use `textHeadingScale: 2` to retain their visual prominence; explainer sizes remain unchanged. Spring Scale In, Fade Slide Up, Typewriter Reveal, Gradient Text and Bold Text Punch preserve their signature animations. Set `motion.preserveEffects: false` for their restrained alternatives. [The font loader](./fonts.ts) loads packaged fonts before rendering. These local presets are independent of Locomotion's selected source style.

Quotes use `resolveTemplateAppearance` to retain provider type scale, spacing,
radii and layout in either preset, without applying composition safe margins.
New imports must follow [the source-fidelity workflow](../import-templates/SKILL.md).

## Logo (`./logo/`)

### [Logo Stroke Draw](./logo/logo-stroke-draw.tsx)

> SVG stroke drawing animation for logo line reveals

- Provider: React Video Editor
- Source: https://www.reactvideoeditor.com/remotion-templates/logo-stroke-draw
- Selected style: `default`
- Tags: Not listed by the provider.
- License: The provider marks this template as free; the user confirmed permission to import and adapt it on 2026-10-04. No MIT license is asserted. See [RVE's general license](https://www.reactvideoeditor.com/important/license); permission for this internal use does not authorize public redistribution.

Provider category: Logo & Branding. Original duration: 90 frames at 30 fps.

Provider description: Draws an SVG logo outline (hexagon + inner triangle) by animating stroke-dashoffset from full length to 0 using interpolate(). After the outline completes, the fill fades in. Creates a hand-drawn reveal effect.

SVG paths, stroke color, draw speed, and fill timing are configurable. The stroke-draw technique works with any SVG shape, making it adaptable to real logo outlines. A premium reveal style suited for clean, modern brands.

Usage notes: Original preserves the 120 x 120 hexagon/triangle, draw intervals, fill timing and Company Name caption; `companyName` customizes only the Original caption. Pass `logo="elg"` with `templatePresets.elg` for the user-requested three-second ELG animation: draw the supplied vector leaf over 0-1.4 seconds with seven overlapping subpaths (0.1-second stagger, 0.8-second duration each, quadratic ease-in/out), fade in the fill with cubic ease-in/out over 1.4-1.8 seconds, then reveal the canonical "Església la Garriga" vector lettering below over 1.8-2.2 seconds. Hold the complete logo for the final 0.8 seconds. Overlap avoids stop-start motion between sections. Each original subpath is normalized individually; the original compound path supplies the fill without changing its geometry. The leaf stays visible at 120 x 120, with the original caption gap. The lettering is extracted from the supplied full-logo SVG with all glyph paths, rectangles, transforms and gradient definitions preserved, rather than rendered as black font text. Its tight viewBox frames only the letters; its 240px width preserves their aspect ratio. The raster symbol and white backdrop are excluded from this lettering-only extraction, not modified in the canonical asset. Both assets use instance-scoped IDs. This content/layout/timing substitution is specific to this template. Logo cards and expanded views last exactly 90 frames at 30 fps and initialize at frame 89 so the complete lettering is visible before hover playback.

Dark-mode adaptation: when the ELG preview theme supplies white text, the leaf outline, leaf fill and all vector lettering shapes render in white, as explicitly requested by the user. Light mode retains the supplied gradients. Scoped CSS overrides SVG inline fills without modifying canonical asset geometry, transforms, source colors or animation timing.

## Text (`./text/`)

### [Spring Scale In](./text/spring-scale-in.tsx)

> Bouncy spring scale entrance for headlines and hero text.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/spring-scale-in?style=default
- Selected style: `default`
- Tags: `spring`, `scale`, `bounce`, `headline`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

Usage notes: An entrance animation that scales text into view with a bouncy spring motion. Suitable for headlines and prominent introductory text.

Both Original and ELG preserve the same spring scale entrance, bounce and opacity timing. ELG changes the typography, palette and sizing without replacing the signature animation. Set `motion.preserveEffects: false` for a gentle fade and translation without scaling or bouncing.

### [Fade Slide Up](./text/fade-slide-up.tsx)

> Classic fade-in with upward slide. The essential text entrance animation.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/fade-slide-up?style=default
- Selected style: `default`
- Tags: `fade`, `slide`, `entrance`, `text`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

Usage notes: Original and ELG share the same linear 20-frame fade and 24 px upward slide. Set `motion.preserveEffects: false` for the shorter, eased entrance using theme duration and distance.

### [Staggered Words](./text/staggered-words.tsx)

> Words fade in one by one with spring physics for natural rhythm.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/staggered-words?style=default
- Selected style: `default`
- Tags: `stagger`, `words`, `spring`, `sequence`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

### [Typewriter Reveal](./text/typewriter-reveal.tsx)

> Character-by-character typewriter effect with blinking cursor.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/typewriter-reveal?style=default
- Selected style: `default`
- Tags: `typewriter`, `text`, `reveal`, `cursor`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

Usage notes: Original and ELG preserve the same 70-frame typing duration at 30 fps and the blinking cursor. Set `motion.preserveEffects: false` for ELG's shorter reveal without a cursor; `motion.blinkCursor` controls the cursor when signature preservation is disabled. Override `revealFrames` to control the typing duration explicitly.

### [Gradient Text](./text/gradient-text.tsx)

> Large text with animated purple-to-gold gradient color sweep on dark or light background.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/gradient-text?style=default
- Selected style: `default`
- Tags: `gradient`, `text`, `color-sweep`, `hero`, `announcement`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

Usage notes: The provider's description mentions a purple-to-gold gradient, but the published `default` source uses grayscale colors; the original preset retains that palette. ELG preserves the staggered character entrance, color sweep and subtle glow, using brand accents mixed with the contrast color (`accentTextMix: 0.6`) to maintain readable text. It does not substitute an underline for the effect. Set `motion.preserveEffects: false` for the previous gentle entrance with a decorative underline.

### [Bold Text Punch](./text/bold-text-punch.tsx)

> Impact text on dark background with scale-in and shake. Made for social clips.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/bold-text-punch?style=default
- Selected style: `default`
- Tags: `bold`, `impact`, `social`, `short`, `dark`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

Usage notes: ELG uses the exact brand accent gradient (`accentBackground`) across the canvas, with white text (`inverseTextColor`) directly over it and no backplate, as requested by the user. Contrast is lower at the lighter end of the gradient and does not meet the general 4.5:1 target everywhere. It preserves the scale entrance and short shake with Urbanist. This is a template-specific adaptation, not a change to the general brand guidelines. Set `motion.preserveEffects: false` to suppress bounce and shake; explicit `bgColor` and `textColor` props still override the preset.

## Explainer (`./explainer/`)

### [Complementary Panels](./explainer/complementary-panels.tsx)

> Two complementary perspectives reveal separately, then connect with a shared conclusion. No VS, scores or winning side.

- Provider: LG Video Agent
- Source: ./explainer/complementary-panels.tsx
- Selected style: `original`
- Tags: `comparison`, `complementary`, `two-panels`, `process`, `vertical`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Customize `question`, `leftTitle`, `leftText`, `rightTitle`, `rightText` and `conclusion`. `leftIcon` and `rightIcon` accept `atom`, `cup` or `none`; icons are from the installed Lucide library. Panels are side by side in landscape and stacked in portrait based on composition dimensions, not preview mode. `secondEnterSeconds` and `connectSeconds` are editorial cues relative to this component, not speech timestamps. The second panel appears after 0.65 seconds; the connection starts after 1.65 seconds, with 0.5-second eased entrances. Keep short panel text and leave the completed comparison visible for at least three seconds. No ratings, quantities or factual measurements are added.

### [Negation to Affirmation](./explainer/negation-to-affirmation.tsx)

> A labelled statement appears word by word, is struck through and falls away; a turn phrase then introduces the affirmation that replaces it.

- Provider: LG Video Agent
- Source: ./explainer/negation-to-affirmation.tsx
- Selected style: `original`
- Tags: `negation`, `contrast`, `strike-through`, `affirmation`, `vertical`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from the Newton scene of the Fe i ciència video; the English sample renders its supplied script. Customize `label`, `negation`, `turn` and `affirmation`. Negation words appear from `revealSeconds` every `wordStaggerSeconds`; pass `wordSeconds` (one time per word, in seconds relative to this component) to follow reviewed narration timestamps; a length mismatch throws. Otherwise the cues are editorial, not speech timing. The strike draws at `strikeSeconds`; at `turnSeconds` the card falls and the turn pill pops in; at `affirmationSeconds` the pill gives way to the affirmation card, labelled with the same turn phrase. Keep the affirmation visible for at least three seconds and the turn phrase short. Essential text sits on solid card surfaces; the strike uses `negativeColor` and the affirmation the readable accent mix (`accentTextMix`).

### [Lens Reveal](./explainer/lens-reveal.tsx)

> A magnifying lens is drawn, moves over an object and shows what happens inside it, then confirms it with a check.

- Provider: LG Video Agent
- Source: ./explainer/lens-reveal.tsx
- Selected style: `original`
- Tags: `lens`, `magnifier`, `inside`, `how-it-works`, `reveal`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from the lens over the teapot in the Fe i ciència video. `outside` and `inside` accept any content drawn on the same square stage, such as two SVGs sharing a viewBox; the sample is a clock face with turning gears. The lens ring draws at `drawSeconds` and travels from `moveSeconds` to `lensX`/`lensY` (fractions of the stage); `inside` appears within the lens, magnified 1.15×, at `insideSeconds`. The `label` pill and the optional `check` badge follow at `labelSeconds` and `checkSeconds`. `lensSize` is the lens radius as a fraction of the stage. Cues are editorial, relative to this component. Keep the label short.

### [The More, The More](./explainer/the-more-the-more.tsx)

> For each row, a bar of understanding fills while the admired subject grows in proportion, without numbers.

- Provider: LG Video Agent
- Source: ./explainer/the-more-the-more.tsx
- Selected style: `original`
- Tags: `proportion`, `analogy`, `growth`, `comparison`, `rhetoric`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from the Gaudí and inventor analogies of the Fe i ciència video. `causeLabel` and `effectLabel` head the two columns; `rows` takes one to three `{ cause, effect }` pairs, and other counts throw. Each row enters at `rowSeconds + index * rowStaggerSeconds`; over `growSeconds` its bar fills and the effect card grows from 0.6× to 1.25×. The growth is a rhetorical proportion, not data: do not add percentages or values. Keep effect text short; it wraps inside a card sized for its largest scale.

### [Concept Equation](./explainer/concept-equation.tsx)

> Two concepts joined by a drawn symbol (≠, = or +), with an optional result.

- Provider: LG Video Agent
- Source: ./explainer/concept-equation.tsx
- Selected style: `original`
- Tags: `equation`, `not-equal`, `distinction`, `complement`, `concepts`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from «Admirar ≠ conèixer» and the plus joining the two answers in the Fe i ciència video. `operator` is `≠`, `=` or `+`; pass `result` to append `= result`. Cards pop in at `leftSeconds`, `rightSeconds` and `resultSeconds + 0.35`; symbol strokes draw from `operatorSeconds`, and the equals sign from `resultSeconds`. The last card is emphasised on the inverse surface. Cards stack in portrait and form one row in landscape. Symbols are drawn as SVG strokes, independent of font glyph coverage, with accessible labels (`is not`, `equals`, `plus`).

### [Idea Spread](./explainer/idea-spread.tsx)

> An idea card shrinks into the centre of a grid while copies fill the other cells, showing how widespread it is.

- Provider: LG Video Agent
- Source: ./explainer/idea-spread.tsx
- Selected style: `original`
- Tags: `idea`, `widespread`, `grid`, `multiply`, `opinion`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from the opening of the Fe i ciència video («una idea molt estesa»). The card shows `idea` at full size, shrinks into the centre cell at `shrinkSeconds`, then copies pop in from the centre outwards from `spreadSeconds`, every `copyStaggerSeconds`: 8 in portrait (3×3) and 14 in landscape (5×3). The `label` pill appears at `labelSeconds`. Copies are decorative (`aria-hidden`) and too small to read, so keep the idea short enough to read before the shrink.

### [Key Question](./explainer/key-question.tsx)

> A question builds word by word on a solid card, with its key phrase highlighted in a pill.

- Provider: LG Video Agent
- Source: ./explainer/key-question.tsx
- Selected style: `original`
- Tags: `question`, `highlight`, `key-phrase`, `word-by-word`, `vertical`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from the central question of the Fe i ciència video. `keyPhrase` must appear verbatim in `question`, otherwise the component throws; pass an empty string for no highlight. Words slide in from `revealSeconds` every `wordStaggerSeconds`, or at `wordSeconds` (one time per word, relative to this component) to follow reviewed narration; the pill appears with its first word. The question is left-aligned on a solid card so it stays readable on the brand gradient.

### [Partial Reveal](./explainer/partial-reveal.tsx)

> A dashed disc is revealed only up to a chosen fraction and labelled, to show partial knowledge.

- Provider: LG Video Agent
- Source: ./explainer/partial-reveal.tsx
- Selected style: `original`
- Tags: `partial`, `reveal`, `wedge`, `knowledge`, `metaphor`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from the creation scene of the Fe i ciència video («conèixer-lo parcialment»). `content` fills the disc; the sample is a night sky. After the outline at `outlineSeconds`, `fraction` (greater than 0, at most 1; other values throw) is revealed clockwise from the top between `revealSeconds` and `revealSeconds + revealDurationSeconds`. The `label` pill appears at `labelSeconds`. The fraction is a visual metaphor, not a measurement: do not add percentages.

### [Concept Breakdown](./explainer/concept-breakdown.tsx)

> "What is X?" explainer with bullet points that fade in sequentially.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/concept-breakdown
- Selected style: `default`
- Tags: `concept`, `definition`, `bullets`, `educational`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

### [Step Explainer](./explainer/step-explainer.tsx)

> Numbered steps with animated underlines. Perfect for "How it works" sections.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/step-explainer?style=default
- Selected style: `default`
- Tags: `steps`, `how-it-works`, `numbered`, `process`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

### [Before & After](./explainer/before-after.tsx)

> Side-by-side comparison cards showing before and after states with transition animation.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/before-after?style=default
- Selected style: `default`
- Tags: `before-after`, `comparison`, `transformation`, `contrast`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

## Diagram (`./diagram/`)

Sources below are adapted from the published `default` style for internal video production. Geometry and frame-driven motion are preserved; ELG changes fonts and palette only. Locomotion's terms permit free-template use and modification, but restrict redistribution as a competing marketplace, starter kit or code library.

### [Venn Diagram (2)](./diagram/venn-diagram-2.tsx)

> Two-circle Venn diagram with overlap label

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/venn-diagram-2?style=default
- Selected style: `default`
- Tags: `venn`, `diagram`, `comparison`, `overlap`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

Usage notes: The provider's source hides the title and defaults the overlap label to "UX", although the website demo passes "UX Engineering". The 800 x 500 SVG and original entrance timing are retained. Clip IDs are scoped to each instance.

### [Venn Diagram (3)](./diagram/venn-diagram-3.tsx)

> Three-circle Venn diagram with center overlap

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/venn-diagram-3?style=default
- Selected style: `default`
- Tags: `venn`, `diagram`, `comparison`, `overlap`, `triple`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Versus Split](./diagram/versus-split.tsx)

> Side-by-side comparison with VS divider

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/versus-split?style=default
- Selected style: `default`
- Tags: `versus`, `comparison`, `split`, `vs`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Comparison Matrix](./diagram/comparison-matrix.tsx)

> Feature comparison grid with checkmarks

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/comparison-matrix?style=default
- Selected style: `default`
- Tags: `comparison`, `matrix`, `grid`, `features`, `table`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Flowchart](./diagram/flowchart.tsx)

> Connected process boxes with decision diamonds

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/flowchart?style=default
- Selected style: `default`
- Tags: `flowchart`, `process`, `flow`, `decision`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Cycle Diagram](./diagram/cycle-diagram.tsx)

> Circular loop of connected steps

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/cycle-diagram?style=default
- Selected style: `default`
- Tags: `cycle`, `loop`, `circular`, `process`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Org Chart](./diagram/org-chart.tsx)

> Organizational hierarchy tree

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/org-chart?style=default
- Selected style: `default`
- Tags: `org`, `chart`, `hierarchy`, `team`, `organization`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Mind Map](./diagram/mind-map.tsx)

> Central idea with radiating branches

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/mind-map?style=default
- Selected style: `default`
- Tags: `mind`, `map`, `brainstorm`, `branches`, `ideas`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Pyramid Diagram](./diagram/pyramid-diagram.tsx)

> Layered pyramid with stacking animation

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/pyramid-diagram?style=default
- Selected style: `default`
- Tags: `pyramid`, `hierarchy`, `layers`, `triangle`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Concentric Circles](./diagram/concentric-circles.tsx)

> Nested rings expanding outward

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/concentric-circles?style=default
- Selected style: `default`
- Tags: `concentric`, `circles`, `nested`, `rings`, `layers`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [SWOT Analysis](./diagram/swot-analysis.tsx)

> Strengths, weaknesses, opportunities, threats grid

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/swot-analysis?style=default
- Selected style: `default`
- Tags: `swot`, `analysis`, `grid`, `strategy`, `quadrant`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Pie Chart](./diagram/pie-chart.tsx)

> Animated donut pie chart with legend

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/pie-chart?style=default
- Selected style: `default`
- Tags: `pie`, `chart`, `donut`, `data`, `percentage`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

Usage notes: The provider appends percent signs to the raw values; it does not normalize legend values when their sum differs from 100. Original behavior is retained.

### [Line Chart](./diagram/line-chart.tsx)

> Animated line chart with drawing path

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/line-chart?style=default
- Selected style: `default`
- Tags: `line`, `chart`, `graph`, `trend`, `data`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Radar Chart](./diagram/radar-chart.tsx)

> Multi-axis radar/spider chart

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/radar-chart?style=default
- Selected style: `default`
- Tags: `radar`, `spider`, `chart`, `multi-axis`, `scores`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Gauge Meter](./diagram/gauge-meter.tsx)

> Animated gauge with sweeping needle

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/gauge-meter?style=default
- Selected style: `default`
- Tags: `gauge`, `meter`, `dial`, `performance`, `score`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

### [Quadrant Chart](./diagram/quadrant-chart.tsx)

> 2×2 matrix with positioned items

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/quadrant-chart?style=default
- Selected style: `default`
- Tags: `quadrant`, `matrix`, `2x2`, `priority`, `effort-impact`
- License: Free template, MIT according to [Locomotion's terms](https://www.locomotion.pro/terms), subject to the redistribution restrictions above.

Usage notes for Diagram: Default content, raw chart parsing and hidden titles follow the published source, which can differ from website demo props. Preview at the provider's actual 960 x 540 canvas, despite its advertised 1920 x 1080 output. For custom data, retain the provider's required item counts; degenerate one-axis/one-point inputs are not supported by the original formulas. Distinct ELG palette tones replace grayscale series without changing values or geometry. Fonts can alter wrapping; these are appearance adaptations, not pixel-identical copies.

## Quotes (`./quotes/`)

The imported templates below retain Locomotion's original Social metadata but are grouped under Quotes at the user's request. Scripture Reference, Name Card and Narrated Verse are original project code. All share the Original/ELG theme contract.

### [Scripture Reference](./quotes/scripture-reference.tsx)

> Scripture text in readable passages with a persistent reference. No avatar, social metrics or testimonial framing.

- Provider: LG Video Agent
- Source: ./quotes/scripture-reference.tsx
- Selected style: `original`
- Tags: `scripture`, `quote`, `reference`, `long-text`, `vertical`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Supply the exact user-approved `text` and `reference`; the sample is Psalm 19:1 in the public-domain King James Version. Long text is divided at word boundaries into passages, without ellipses or omissions. `passages` can supply editorially chosen fragments instead. Each passage enters over 0.5 seconds; the reference stays visible during changes. `secondsPerPassage` defaults to eight seconds and must be at least three. For multiple passages, the composition duration must include every complete interval; insufficient duration throws rather than silently losing the ending. Extend this duration for slow reading or longer fragments. Passage changes are editorial cues, not word-level narration alignment. Landscape and portrait have their own constrained type/layout scales. Essential text uses solid theme surfaces in dark mode, not low-contrast text on the brand gradient.

### [Name Card](./quotes/name-card.tsx)

> Role and name card to cite an author or introduce a speaker; the name wipes in beside a contrast bar.

- Provider: LG Video Agent
- Source: ./quotes/name-card.tsx
- Selected style: `original`
- Tags: `name`, `role`, `lower-third`, `speaker`, `author`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from the John Lennox, Stephen Hawking and Isaac Newton cards of the Fe i ciència video. Customize `name` and `role` with wording from the approved script; no avatar, biography or credentials are added. `placement` is `center` or `lower-third` (bottom left inside the 8% safe margins). The card enters over 0.5 seconds; the name wipes in from `nameSeconds` and the role fades in at `roleSeconds`, both editorial cues relative to this component. The name uses the readable accent mix (`accentTextMix`) on the solid card surface.

### [Narrated Verse](./quotes/narrated-verse.tsx)

> A full-screen literal verse: the reference appears first, then each word as it is read, with the reference kept on screen.

- Provider: LG Video Agent
- Source: ./quotes/narrated-verse.tsx
- Selected style: `original`
- Tags: `scripture`, `verse`, `narration`, `word-by-word`, `reference`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from the Psalm 19:1 and Colossians 1:15-16 scenes of the Fe i ciència video; the sample is Psalm 19:1 in the public-domain King James Version. Supply the exact approved `text` and `reference`, never a paraphrase. The reference pops in at `referenceSeconds` and moves to the top at `revealSeconds`. Words then appear every `wordStaggerSeconds`, or at `wordSeconds` (one time per word, relative to this component) to follow reviewed narration; a length mismatch throws. Long text is split into pages at word boundaries (90 characters in portrait, 110 in landscape) unless `pages` gives them; each page gives way 0.35 seconds before the first word of the next. Show the verse with this template instead of captions. The surface is the card colour; on a dark surface, as in dark previews, twinkling stars evoke the night sky (`stars`). Unlike Scripture Reference, this is a protagonist scene following the voice, not an editorially timed card.

### [Quote Card](./quotes/quote-card.tsx)

> Testimonial quote card with author avatar. Great for social proof clips.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/quote-card?style=default
- Selected style: `default`
- Tags: `quote`, `testimonial`, `social-proof`, `card`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

### [Testimonial Card](./quotes/testimonial-card.tsx)

> Customer testimonial with glassmorphic card, quote text, avatar, name, and role.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/testimonial-card?style=default
- Selected style: `default`
- Tags: `testimonial`, `review`, `quote`, `social-proof`, `customer`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

### [Social Post](./quotes/social-post.tsx)

> Animated social media post card with avatar, text, rolling like count, retweets, and views.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/social-post?style=default
- Selected style: `default`
- Tags: `social`, `post`, `twitter`, `x`, `announcement`, `likes`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

### [Profile Card](./quotes/profile-card.tsx)

> Professional profile introduction with avatar, name, role, bio, and animated stat counters.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/profile-card?style=default
- Selected style: `default`
- Tags: `profile`, `bio`, `introduction`, `personal`, `social`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

Usage notes: The published default source animates the statistic blocks' entrances; it does not numerically roll their values despite the provider description.

### [Video Testimonial](./quotes/video-testimonial.tsx)

> Split-screen testimonial with cinematic video area (waveform, play button) and glassmorphic quote card with star rating.

- Provider: Locomotion
- Source: https://www.locomotion.pro/template/video-testimonial?style=default
- Selected style: `default`
- Tags: `testimonial`, `video`, `review`, `quote`, `stars`, `media`
- License: Free templates are MIT-licensed according to [Locomotion's terms](https://www.locomotion.pro/terms).

## Transition (`./transition/`)

### [Scene Sweep](./transition/scene-sweep.tsx)

> Tilted bands sweep across the frame and hide a hard cut between two scenes.

- Provider: LG Video Agent
- Source: ./transition/scene-sweep.tsx
- Selected style: `original`
- Tags: `transition`, `wipe`, `cut`, `sweep`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from the scene cuts of the Fe i ciència video. `before` and `after` render under the bands and switch at `cutSeconds` (default: the middle of the enclosing composition or sequence), the frame where the main band covers the whole canvas. Omit them for the sample cards. To hide a cut between `<Series>` scenes, overlay a 16-frame `<Sequence>` centred on the cut with `before={null}`, `after={null}` and a transparent theme `background`. `durationSeconds` defaults to 16 frames at 30 fps; `direction` mirrors the 12° bands; `color` overrides the band color, which defaults to the theme text color so it contrasts with the background. No sound is included: pair it with a gallery sound effect whose attack lands on the cut, kept quieter than the narration.

## Captions (`./captions/`)

### [Word Captions](./captions/word-captions.tsx)

> Word-by-word speech captions on a solid plate, at most two lines, highlighting each word while it is spoken.

- Provider: LG Video Agent
- Source: ./captions/word-captions.tsx
- Selected style: `original`
- Tags: `captions`, `subtitles`, `word-by-word`, `narration`, `timestamps`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from the subtitles of the Fe i ciència video; the English sample uses illustrative timings, not a transcription. `captions` takes the `Caption` shape of `@remotion/captions` (`text`, `startMs`, `endMs`, `timestampMs`, `confidence`, optional `pageBreakAfter`), keeping the leading space of each word. For narration, transcribe with `mlx-whisper`, review the words against the supplied text and convert their seconds with `startMs = start * 1000` and `endMs = end * 1000`; never invent times for missing words. A word without a leading space joins the previous one, such as an elision or suffix split off by the transcription engine. Pages break at `pageBreakAfter`, sentence punctuation, pauses of at least `pauseBreakMs` (400 ms) and `hiddenRanges` boundaries. Longer phrases are halved into balanced pages, preferably after punctuation, up to `maxCharsPerPage` (52 portrait, 70 landscape). A page appears with its first word and stays until the next page or 0.7 seconds after its last word. The highlight follows `startMs <= time < endMs`, so it never stays on during silences; upcoming words are dimmed. `hiddenRanges` lists inclusive caption indices whose literal text is already on screen, such as titles or verses. `offsetSeconds` is the narration time at this component's first frame. Pass a transparent theme `background` to overlay a video. The plate uses the inverse surface; the highlight uses the first accent color with 4.5:1 contrast against the plate text, otherwise an inverted chip.

## Background (`./background/`)

### [Starry Sky](./background/starry-sky.tsx)

> A night sky of drifting, twinkling stars with an optional warp dive; content can sit on top.

- Provider: LG Video Agent
- Source: ./background/starry-sky.tsx
- Selected style: `original`
- Tags: `background`, `stars`, `night`, `warp`, `sky`
- License: Original project code; no third-party template copied. Redistribution terms are not established here.

Usage notes: Adapted from the verse and universe scenes of the Fe i ciència video. The sky always uses the inverse (night) surface, with stars in the inverse text color, so light and dark previews look alike. `stars` sets how many stars there are and `brightness` scales their opacity. Pass `diveSeconds` to fly through the stars: for `diveDurationSeconds` (at least 1 second) they streak outwards from the centre, then the sky settles again. `children` render above the sky; keep essential text readable against the night color.

Usage notes: The provider's video area is a still portrait with animated waveform and play decoration, not a playable video. The same [demo image](./quotes/video-testimonial.jpg) is packaged locally from https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1080&fit=crop&q=80 under the [Unsplash license](https://unsplash.com/license); replace `imageUrl` with licensed campaign media before publication. The demo names and quotations are sample content, not endorsements by the photographed person. ELG uses packaged Urbanist/Open Sans; Original retains the provider's Inter/system fallback stack.