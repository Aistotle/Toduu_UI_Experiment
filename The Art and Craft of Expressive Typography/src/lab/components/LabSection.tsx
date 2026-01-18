import React, { ReactNode } from 'react';

export type LabSectionStatus = 'idea' | 'porting' | 'ready';

export type LabSectionMetadata = {
  id: string;
  source: string;
  title: string;
  summary: string;
  status: LabSectionStatus;
  tags?: string[];
  layout?: 'card' | 'full';
};

type LabSectionProps = {
  metadata: LabSectionMetadata;
  children: ReactNode;
};

const statusCopy: Record<LabSectionStatus, string> = {
  idea: 'Idea Capture',
  porting: 'In Progress',
  ready: 'Ready for Main Stage',
};

const TagsList: React.FC<{ tags?: string[] }> = ({ tags }) => {
  if (!tags || !tags.length) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium tracking-wide text-black/70">
          {tag}
        </span>
      ))}
    </div>
  );
};

export const LabSection: React.FC<LabSectionProps> = ({ metadata, children }) => {
  const { id, title, summary, source, status, tags, layout } = metadata;
  const variant = layout ?? 'full';

  if (variant === 'full') {
    return (
      <section id={id} data-source={source} className="w-full text-[var(--ink)]">
        <div className="px-6 md:px-12 lg:px-24">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-[0.4em] text-black/40">
            <span>{source}</span>
            <span aria-live="polite" className="rounded-full border border-black/10 px-3 py-1 tracking-[0.3em] text-black/60">
              {statusCopy[status]}
            </span>
          </div>
          <div className="mt-6 flex flex-col gap-3 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black">{title}</h2>
            <p className="text-base md:text-lg text-black/70">{summary}</p>
          </div>
          <TagsList tags={tags} />
        </div>
        <div className="mt-8">{children}</div>
      </section>
    );
  }

  return (
    <section
      id={id}
      data-source={source}
      className="rounded-[32px] border border-black/10 bg-white/80 p-8 text-[var(--ink)] shadow-[0_25px_65px_rgba(0,0,0,0.05)] md:p-12"
    >
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-[0.4em] text-black/50">
        <span>{source}</span>
        <span aria-live="polite" className="rounded-full border border-black/10 px-3 py-1 tracking-[0.3em]">
          {statusCopy[status]}
        </span>
      </div>
      <h2 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight text-black">{title}</h2>
      <p className="mt-4 text-base md:text-lg text-black/70 max-w-3xl">{summary}</p>
      <TagsList tags={tags} />
      <div className="mt-8">{children}</div>
    </section>
  );
};

export default LabSection;
