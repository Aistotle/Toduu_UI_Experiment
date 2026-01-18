import React from 'react';

export const AnimatedText: React.FC<{ style: React.CSSProperties; children: React.ReactNode; }> = ({ style, children }) => (
  <span className="inline-block will-change-transform" style={style}>{children}</span>
);
