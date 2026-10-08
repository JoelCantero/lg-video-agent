# Plantilla ELG · il·lustracions simbòliques

Peces gràfiques originals extretes del vídeo «Una veritat que no oprimeix»
(`src/una-veritat/`, LG Video Agent, 8 d'octubre de 2026). Són genèriques i
animables per fotogrames; complementen la plantilla
[`elg-narrated-video`](../elg-narrated-video/README.md), de la qual fan servir
els colors. Còpia independent: canviar-la no modifica el vídeo lliurat.

| Fitxer | Ús |
| --- | --- |
| `Orb.tsx` | Disc de llum (la veritat): nucli, anell i raigs. `crack` dibuixa esquerdes, `shatter` el trenca en 9 fragments i tornar-lo a 0 el recompon. `OrbGroup` el posa dins d'un altre SVG; `Shard` dibuixa un fragment sol |
| `Hand.tsx` | Mà de cara: `open` 0 és un puny i 1 la mà oberta (els dits s'estiren un darrere l'altre i el polze s'obre). `held` posa un objecte entre el palmell i els dits plegats; `behind`, llum que s'escapa pel voltant del puny |
| `Person.tsx` | Persona simple amb els peus a (x, y): braç alçat (`raise`), inclinació, encongiment i `flip`. `personHand` dona la posició de la mà; `PersonShape` la dibuixa dins d'un SVG |
| `Scale.tsx` | Balança de la justícia: inclinació, pal opcional (`post`), contorn discontinu del pal absent (`ghostPost`), fulcre substituïble i càrrega als plats. `scalePivot` situa la balança pel fulcre |
| `Symbols.tsx` | Creu que es dibuixa, corona, Bíblia oberta i fletxa |
| `motion.ts` | `useMotion()`: `ramp`, `rise`, `fall`, `pop` i `settle` sobre el fotograma actual |

Les il·lustracions són metàfores visuals: no hi afegiu xifres ni dades que el
guió no aporti. Verifiqueu-ne la llegibilitat a mida de mòbil a cada vídeo.
