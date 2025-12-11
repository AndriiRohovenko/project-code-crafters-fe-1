import React, { useState } from 'react';

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightSlot?: React.ReactNode;
}

export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      className = '',
      label,
      error,
      rightSlot,
      placeholder,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));

    const inputPlaceholder = label
      ? `${label}${props.required ? '*' : ''}`
      : placeholder;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            placeholder={inputPlaceholder}
            onChange={handleChange}
            className={`placeholder:text-black/70 w-full rounded-full border bg-white px-6 py-3 text-base text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 ${rightSlot ? 'pr-14' : ''} ${hasValue ? 'border-black' : 'border-light-grey'} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className} `}
            {...props}
          />
          {rightSlot && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {rightSlot}
            </div>
          )}
        </div>
        {error && <p className="mt-1 px-4 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

BaseInput.displayName = 'BaseInput';
