import React, { useState } from 'react';
import { SliderControl } from './SliderControl';

type TrackingDemoProps = {
  label?: string;
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  specimen?: string;
  description?: string;
};

export const TrackingDemo: React.FC<TrackingDemoProps> = ({
  label = 'Tracking',
  initialValue = 0,
  min = -0.1,
  max = 0.4,
  step = 0.02,
  specimen = 'TRACKING',
  description = 'Letter-spacing shifts texture: tight feels urgent, loose feels airy.',
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="space-y-6 rounded-3xl border border-black/10 bg-white/80 p-6">
      <SliderControl
        label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        unitLabel="em"
        helperText={description}
        onChange={setValue}
      />
      <p
        className="text-center text-4xl md:text-5xl font-bold tracking-[var(--tracking,0)]"
        style={{ letterSpacing: `${value}em`, transition: 'letter-spacing 200ms ease' }}
      >
        {specimen}
      </p>
    </div>
  );
};

export default TrackingDemo;
