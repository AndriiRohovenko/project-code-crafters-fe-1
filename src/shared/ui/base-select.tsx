import React, { useEffect, useRef, useState } from 'react';

import { Icon } from './icon';

interface SelectOption {
  value: string;
  label: string;
}

interface BaseSelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export const BaseSelect = React.forwardRef<HTMLDivElement, BaseSelectProps>(
  (
    {
      label,
      placeholder = 'Select an option',
      options,
      value,
      defaultValue,
      onChange,
      error,
      className = '',
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string>(
      defaultValue || ''
    );
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedValue = value !== undefined ? value : internalValue;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const selectedOption = options.find((opt) => opt.value === selectedValue);
    const displayText = selectedOption
      ? selectedOption.label
      : label
        ? `${label}${required ? '*' : ''}`
        : placeholder;

    const handleSelect = (optionValue: string) => {
      if (value === undefined) {
        setInternalValue(optionValue);
      }
      onChange?.(optionValue);
      setIsOpen(false);
    };

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    return (
      <div
        className={`w-full ${className}`}
        ref={(node) => {
          selectRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        {...props}
      >
        <div className="relative">
          <button
            type="button"
            onClick={handleToggle}
            disabled={disabled}
            className={`placeholder:text-black/70 flex w-full items-center justify-between rounded-full border bg-white px-6 py-3 text-base text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 ${
              selectedValue ? 'border-black' : 'border-light-grey'
            } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${
              isOpen ? 'border-black' : ''
            }`}
          >
            <span className={selectedValue ? 'text-black' : 'text-black/70'}>
              {displayText}
            </span>
            <Icon
              name="down"
              size={20}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-2 w-full">
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <ul className="max-h-60 overflow-auto py-2">
                  {options.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={`w-full px-6 py-3 text-left text-base text-black transition-colors hover:bg-gray-50 ${
                          selectedValue === option.value
                            ? 'bg-gray-100 font-medium'
                            : ''
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        {error && <p className="mt-1 px-4 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

BaseSelect.displayName = 'BaseSelect';
