import React from 'react';

/** Absolutely positioned element centred on (x, y), or right-aligned to x. */
export const Floating: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
  readonly opacity?: number;
  readonly rotate?: number;
  readonly dx?: number;
  readonly dy?: number;
  readonly anchor?: 'center' | 'right' | 'left';
  readonly children: React.ReactNode;
}> = ({ x, y, scale = 1, opacity = 1, rotate = 0, dx = 0, dy = 0, anchor = 'center', children }) => (
  <div
    style={{
      position: 'absolute',
      top: y,
      display: 'flex',
      ...(anchor === 'center'
        ? { left: x, translate: `calc(-50% + ${dx}px) calc(-50% + ${dy}px)` }
        : anchor === 'left'
          ? { left: x, translate: `${dx}px calc(-50% + ${dy}px)`, transformOrigin: 'left center' }
          : { right: 1080 - x, translate: `${dx}px calc(-50% + ${dy}px)`, transformOrigin: 'right center' }),
      scale: `${Math.max(0, scale)}`,
      rotate: `${rotate}deg`,
      opacity: Math.max(0, Math.min(1, opacity)),
    }}
  >
    {children}
  </div>
);
