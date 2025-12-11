import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { BaseInput } from './base-input';
import { Icon } from './icon';

interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = 'Password', value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose the input ref to parent components
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const actualValue = value !== undefined ? value : internalValue;
    const maskedValue = '*'.repeat(actualValue.length);

    const toggleVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (showPassword) {
        if (value === undefined) {
          setInternalValue(newValue);
        }
        if (onChange) {
          onChange(e);
        }
      } else {
        const cursorPosition = e.target.selectionStart || 0;
        const lengthDiff = newValue.length - maskedValue.length;

        let newActualValue: string;

        if (lengthDiff > 0) {
          const addedChars = newValue.slice(
            cursorPosition - lengthDiff,
            cursorPosition
          );
          newActualValue =
            actualValue.slice(0, cursorPosition - lengthDiff) +
            addedChars +
            actualValue.slice(cursorPosition - lengthDiff);
        } else if (lengthDiff < 0) {
          newActualValue =
            actualValue.slice(0, cursorPosition) +
            actualValue.slice(cursorPosition - lengthDiff);
        } else {
          const replacedChar = newValue[cursorPosition - 1] || '';
          newActualValue =
            actualValue.slice(0, cursorPosition - 1) +
            replacedChar +
            actualValue.slice(cursorPosition);
        }

        if (value === undefined) {
          setInternalValue(newActualValue);
        }

        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: newActualValue,
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      }
    };

    return (
      <BaseInput
        ref={inputRef}
        type="text"
        autoComplete="off"
        label={label}
        value={showPassword ? actualValue : maskedValue}
        onChange={handleChange}
        rightSlot={
          <button
            type="button"
            onClick={toggleVisibility}
            className="flex items-center justify-center text-black transition-opacity hover:opacity-70 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'eye' : 'eye-off'} size={20} />
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
