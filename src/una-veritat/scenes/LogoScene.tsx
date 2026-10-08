import React from 'react';
import { AbsoluteFill } from 'remotion';
import { LogoStrokeDraw } from '../../../.agents/skills/react-templates/logo/logo-stroke-draw';
import { templatePreviewTheme } from '../../../.agents/skills/react-templates/theme';

// Catalog template unchanged: rendered on its 360×640 canvas and scaled 3× to fill the vertical frame.
export const LogoScene: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 360, height: 640, transformOrigin: '0 0', scale: '3' }}>
      <LogoStrokeDraw logo="elg" theme={templatePreviewTheme('elg', true, 'Logo')} />
    </div>
  </AbsoluteFill>
);
