import React, { ReactNode } from 'react';

type SplitSectionProps = {
  left: ReactNode;
  right: ReactNode;
  reverse?: boolean;
  className?: string;
};

export const SplitSection: React.FC<SplitSectionProps> = ({ left, right, reverse = false, className }) => {
  return (
    <section className={`rounded-[32px] border border-black/10 bg-white/90 p-8 md:p-12 ${className ?? ''}`}>
      <div className={`grid gap-12 md:grid-cols-2 items-center ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
        <div className="space-y-4 text-black/80">
          {left}
        </div>
        <div>
          {right}
        </div>
      </div>
    </section>
  );
};

export default SplitSection;
