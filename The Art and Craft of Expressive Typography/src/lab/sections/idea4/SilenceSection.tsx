import React, { useState } from 'react';
import { SliderControl } from '../../components/SliderControl';
import { SplitSection } from '../../components/SplitSection';

export const Idea04SilenceSection: React.FC = () => {
  const [padding, setPadding] = useState(2);

  return (
    <SplitSection
      left={(
        <>
          <p className="text-xs font-mono uppercase tracking-[0.5em] text-black/50">Negative Space</p>
          <h3 className="text-4xl font-light">Silence amplifies.</h3>
          <p>Idea 04’s "Negative Space & Silence" slider increased padding around a quote. Here the same interaction runs inside our component layer.</p>
        </>
      )}
      right={(
        <div className="space-y-6">
          <SliderControl
            label="Padding"
            value={padding}
            min={1}
            max={5}
            step={0.25}
            unitLabel="rem"
            helperText="Space gives the message room." 
            onChange={setPadding}
          />
          <div
            className="rounded-3xl border border-black/10 bg-white/80 text-center"
            style={{ padding: `${padding}rem`, transition: 'padding 200ms ease' }}
          >
            <p className="text-lg text-black/70">Silence is an active design decision.</p>
          </div>
        </div>
      )}
    />
  );
};

export default Idea04SilenceSection;
