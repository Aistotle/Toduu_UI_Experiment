import React, { Suspense } from 'react';

const Idea05Lab = React.lazy(() => import('./Idea05Lab'));

export const LazyIdea05Section: React.FC = () => {
  return (
    <Suspense fallback={<div className="rounded-[32px] border border-dashed border-black/10 bg-white/60 p-8 text-sm text-black/60">Loading Framer Motion study…</div>}>
      <Idea05Lab />
    </Suspense>
  );
};

export default LazyIdea05Section;
