import { useEffect } from 'react';
import { cancelRender, useDelayRender } from 'remotion';
import '@fontsource/urbanist/latin-700.css';
import '@fontsource/open-sans/latin-400.css';
import '@fontsource/open-sans/latin-700.css';
import type { TemplateTheme } from './theme';

export function useTemplateFonts(theme: TemplateTheme): void {
  const { delayRender, continueRender } = useDelayRender();

  useEffect(() => {
    const handle = delayRender('Loading template fonts');
    let released = false;
    const release = () => {
      if (!released) {
        released = true;
        continueRender(handle);
      }
    };
    Promise.all([
      document.fonts.load(`${theme.headingWeight} 88px ${theme.headingFont}`, 'Església la Garriga'),
      document.fonts.load(`${theme.bodyWeight} 42px ${theme.bodyFont}`, 'Benvinguts a la comunitat'),
    ]).then(release).catch((error: unknown) => {
      if (!released) cancelRender(error);
    });
    return release;
  }, [theme.headingFont, theme.bodyFont, theme.headingWeight, theme.bodyWeight, delayRender, continueRender]);
}