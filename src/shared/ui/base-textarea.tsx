import React, { useState } from 'react';

interface BaseTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCounter?: boolean;
}

export const BaseTextarea = React.forwardRef<
  HTMLTextAreaElement,
  BaseTextareaProps
>(
  (
    {
      className = '',
      label,
      error,
      showCounter = true,
      value,
      defaultValue,
      onChange,
      maxLength,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      value || defaultValue || ''
    );
    const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));

    const displayValue = (
      value !== undefined ? value : internalValue
    ) as string;
    const count = typeof displayValue === 'string' ? displayValue.length : 0;

    const inputPlaceholder = label ?? placeholder;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      setHasValue(newValue.length > 0);
      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <div>
          <textarea
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            maxLength={maxLength}
            placeholder={inputPlaceholder}
            className={`placeholder:text-black/70 w-full resize-none border-0 border-b bg-white pb-2 pr-16 pt-3 text-sm text-black outline-none focus:ring-0 ${
              hasValue ? 'border-b-black' : 'border-b-light-grey'
            } ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
            {...props}
          />
          {/* Counter inside the textarea */}
          {showCounter && maxLength ? (
            <span className="text-black/30 pointer-events-none absolute bottom-4 right-6 text-xs">
              {count}/{maxLength}
            </span>
          ) : null}
        </div>
        {error && <p className="mt-1 px-4 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

BaseTextarea.displayName = 'BaseTextarea';
