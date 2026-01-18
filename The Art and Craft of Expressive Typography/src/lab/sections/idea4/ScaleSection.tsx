import React, { useState } from 'react';
import { SliderControl } from '../../components/SliderControl';
import { SplitSection } from '../../components/SplitSection';

export const Idea04ScaleSection: React.FC = () => {
  const [scale, setScale] = useState(2);

  return (
    <SplitSection
      left={(
        <>
          <p className="text-xs font-mono uppercase tracking-[0.5em] text-black/50">Scale &amp; Hierarchy</p>
          <h3 className="text-4xl font-light">Size is a shout.</h3>
          <p>Drag the slider to nudge the typographic hierarchy, mirroring Idea 04’s "Scale & Hierarchy" module.</p>
        </>
      )}
      right={(
        <div className="space-y-6">
          <SliderControl
            label="Scale"
            value={scale}
            min={1}
            max={4}
            step={0.1}
            unitLabel="rem"
            helperText="Scale creates hierarchy and drama."
            onChange={setScale}
          />
          <p
            className="text-center font-semibold text-black"
            style={{ fontSize: `${scale}rem`, transition: 'font-size 200ms ease' }}
          >
            HIERARCHY
          </p>
        </div>
      )}
    />
  );
};

export default Idea04ScaleSection;
