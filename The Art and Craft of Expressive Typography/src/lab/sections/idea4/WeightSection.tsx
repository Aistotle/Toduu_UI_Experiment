import React, { useState } from 'react';
import { SliderControl } from '../../components/SliderControl';
import { SplitSection } from '../../components/SplitSection';

export const Idea04WeightSection: React.FC = () => {
  const [weight, setWeight] = useState(400);

  return (
    <SplitSection
      reverse
      left={(
        <>
          <p className="text-xs font-mono uppercase tracking-[0.5em] text-black/50">Weight &amp; Emphasis</p>
          <h3 className="text-4xl font-light">Weight sets gravity.</h3>
          <p>Borrowed from Idea 04’s "Weight & Emphasis" slider: increasing weight thickens the voice before changing words.</p>
        </>
      )}
      right={(
        <div className="space-y-6">
          <SliderControl
            label="Weight"
            value={weight}
            min={100}
            max={900}
            step={50}
            helperText="Higher values feel louder."
            onChange={setWeight}
          />
          <p
            className="text-center text-4xl"
            style={{ fontWeight: weight, transition: 'font-weight 200ms ease' }}
          >
            Gravitas
          </p>
        </div>
      )}
    />
  );
};

export default Idea04WeightSection;
