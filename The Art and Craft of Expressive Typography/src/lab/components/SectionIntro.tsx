import React from 'react';

type SectionIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: 'left' | 'center' | 'right';
  variant?: 'light' | 'dark';
  className?: string;
};

const alignmentMap: Record<NonNullable<SectionIntroProps['align']>, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};

const variantMap = {
  light: {
    eyebrow: 'text-black/50',
    title: 'text-black',
    body: 'text-black/70',
  },
  dark: {
    eyebrow: 'text-white/60',
    title: 'text-white',
    body: 'text-white/70',
  },
};

export const SectionIntro: React.FC<SectionIntroProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  variant = 'light',
  className,
}) => {
  const alignmentClass = alignmentMap[align];
  const palette = variantMap[variant];

  return (
    <div className={`flex flex-col gap-3 ${alignmentClass} ${className ?? ''}`}>
      {eyebrow ? (
        <span className={`text-xs font-mono uppercase tracking-[0.5em] ${palette.eyebrow}`}>
          {eyebrow}
        </span>
      ) : null}
      <h3 className={`text-3xl md:text-4xl font-semibold leading-tight ${palette.title}`}>{title}</h3>
      <p className={`text-base md:text-lg leading-relaxed ${palette.body}`}>{description}</p>
    </div>
  );
};

export default SectionIntro;
