import { useEffect } from 'react';
import { cancelRender, useDelayRender } from 'remotion';
import '@fontsource/urbanist/latin-700.css';
import '@fontsource/open-sans/latin-400.css';
import '@fontsource/open-sans/latin-700.css';

export const useBrandFonts = (): void => {
  const { delayRender, continueRender } = useDelayRender();

  useEffect(() => {
    const handle = delayRender('Loading ELG fonts');
    let released = false;
    const release = () => {
      if (!released) {
        released = true;
        continueRender(handle);
      }
    };
    Promise.all([
      document.fonts.load('700 88px Urbanist', 'Per què està bullint aquesta aigua?'),
      document.fonts.load('400 50px "Open Sans"', 'ciència i fe'),
      document.fonts.load('700 50px "Open Sans"', 'ciència i fe'),
    ])
      .then(release)
      .catch((error: unknown) => {
        if (!released) cancelRender(error);
      });
    return release;
  }, [delayRender, continueRender]);
};
