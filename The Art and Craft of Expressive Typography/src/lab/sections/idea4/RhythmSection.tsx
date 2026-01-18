import React, { useState } from 'react';
import { SliderControl } from '../../components/SliderControl';
import { SplitSection } from '../../components/SplitSection';

export const Idea04RhythmSection: React.FC = () => {
  const [leading, setLeading] = useState(1.5);
  const [tracking, setTracking] = useState(0);

  return (
    <SplitSection
      left={(
        <>
          <p className="text-xs font-mono uppercase tracking-[0.5em] text-black/50">Rhythm &amp; Line Length</p>
          <h3 className="text-4xl font-light">Typography breathes.</h3>
          <p>Direct lift from Idea 04’s rhythm module: two sliders govern leading and tracking to help the copy inhale/exhale.</p>
        </>
      )}
      right={(
        <div className="space-y-6">
          <SliderControl
            label="Leading"
            value={leading}
            min={1.1}
            max={2.4}
            step={0.1}
            helperText="Line height controls tempo."
            onChange={setLeading}
          />
          <SliderControl
            label="Tracking"
            value={tracking}
            min={-0.1}
            max={0.3}
            step={0.01}
            helperText="Letter spacing adjusts texture."
            onChange={setTracking}
          />
          <p
            className="rounded-2xl border border-black/10 bg-white/80 p-6 text-base leading-relaxed text-black/80"
            style={{ lineHeight: leading, letterSpacing: `${tracking}em`, transition: 'line-height 200ms ease, letter-spacing 200ms ease' }}
          >
            Good typography is invisible service. When rhythm clicks, the content hums along without interruption.
          </p>
        </div>
      )}
    />
  );
};

export default Idea04RhythmSection;
