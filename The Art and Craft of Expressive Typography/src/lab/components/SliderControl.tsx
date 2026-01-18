import React, { ChangeEvent, useId } from 'react';

type SliderControlProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (next: number) => void;
  unitLabel?: string;
  helperText?: string;
  id?: string;
};

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.1,
  onChange,
  unitLabel,
  helperText,
  id,
}) => {
  const generatedId = useId();
  const sliderId = id ?? generatedId;
  const valueId = `${sliderId}-value`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    onChange(nextValue);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.3em] text-black/60">
        <label htmlFor={sliderId}>{label}</label>
        <span id={valueId} className="text-black/80">
          {value.toFixed(2)}{unitLabel ? ` ${unitLabel}` : ''}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-describedby={helperText ? `${sliderId}-helper` : undefined}
        aria-valuetext={`${value.toFixed(2)}${unitLabel ? ` ${unitLabel}` : ''}`}
        onChange={handleChange}
        className="w-full accent-black/70"
      />
      {helperText ? (
        <p id={`${sliderId}-helper`} className="text-xs text-black/60 leading-relaxed">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default SliderControl;
