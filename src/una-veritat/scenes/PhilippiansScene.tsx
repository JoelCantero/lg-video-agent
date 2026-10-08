import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { NarratedVerse } from '../../../.agents/skills/react-templates/quotes/narrated-verse';
import { templatePreviewTheme } from '../../../.agents/skills/react-templates/theme';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { FPS, sceneCues, scenes, words } from '../data/timeline';
import { Orb } from '../illustrations/Orb';
import { OpenBible } from '../illustrations/Symbols';
import { lerp, useMotion } from '../motion';

const at = sceneCues('philippians');
const c = {
  bible: at(262),
  jesus: at(267),
};

const VERSE_FROM = 100;
// Literal text supplied by the user (Fl 2:6-7). The page turns at the longest pause (after «res:», 0.68 s)
// because the template fades a page out 0.65 s before the next one starts.
const PAGES = [
  'Ell, que era de condició divina, no es volgué guardar gelosament la seva igualtat amb Déu, sinó que es va fer no res:',
  'prengué la condició de servent i es feu semblant als homes.',
];
const VERSE_WORDS = Array.from({ length: 34 }, (_, k) => words[268 + k].start - scenes.philippians.start - VERSE_FROM / FPS);
const VERSE_THEME = templatePreviewTheme('elg', true);

/** «A la Bíblia llegim…»: the book opens and the camera enters the verse. */
export const PhilippiansScene: React.FC = () => {
  useBrandFonts();
  const { frame, fps, time, ramp, pop, settle } = useMotion();

  const book = pop(c.bible - 4, 13);
  const open = settle(c.bible, 20);
  const light = settle(c.jesus, 24);
  const dive = ramp(VERSE_FROM - 12, 26);
  const verseIn = ramp(VERSE_FROM, 12);

  return (
    <AbsoluteFill>
      {verseIn < 1 ? (
        <AbsoluteFill style={{ scale: `${1 + 2.6 * dive}`, transformOrigin: '540px 760px' }}>
          <BrandBackground />
          {frame >= c.jesus ? (
            <Floating x={540} y={lerp(720, 470, light)} scale={light}>
              <Orb r={46} spin={time * 14} />
            </Floating>
          ) : null}
          {book > 0 ? (
            <Floating x={540} y={800} scale={0.6 + 0.4 * book} opacity={Math.min(1, book * 1.5)}>
              <OpenBible width={680} open={open} />
            </Floating>
          ) : null}
        </AbsoluteFill>
      ) : null}

      <Sequence name="Narrated Verse (catàleg)" from={VERSE_FROM} premountFor={fps}>
        <AbsoluteFill style={{ opacity: verseIn }}>
          <NarratedVerse theme={VERSE_THEME} pages={PAGES} reference="Filipencs 2:6-7" referenceSeconds={0.1} revealSeconds={0.5} wordSeconds={VERSE_WORDS} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
