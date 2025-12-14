import React, { useRef, useState } from 'react';

import { BaseInput } from './base-input';
import { Icon } from './icon';

interface PasswordInputProps {
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Password',
  value,
  onChange,
  onBlur,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    let newPassword: string;

    if (showPassword) {
      newPassword = inputValue;
    } else {
      const prevMasked = '*'.repeat(value.length);
      const lengthDiff = inputValue.length - prevMasked.length;

      if (lengthDiff > 0) {
        // Characters added
        const addedChars = inputValue.slice(
          cursorPosition - lengthDiff,
          cursorPosition
        );
        newPassword =
          value.slice(0, cursorPosition - lengthDiff) +
          addedChars +
          value.slice(cursorPosition - lengthDiff);
      } else if (lengthDiff < 0) {
        // Characters deleted
        newPassword =
          value.slice(0, cursorPosition) +
          value.slice(cursorPosition - lengthDiff);
      } else {
        // Character replaced
        const replacedChar = inputValue[cursorPosition - 1] || '';
        newPassword =
          value.slice(0, cursorPosition - 1) +
          replacedChar +
          value.slice(cursorPosition);
      }
    }

    onChange(newPassword);
  };

  return (
    <BaseInput
      ref={inputRef}
      type="text"
      autoComplete="off"
      label={label}
      value={showPassword ? value : '*'.repeat(value.length)}
      onChange={handleChange}
      onBlur={onBlur}
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
};

PasswordInput.displayName = 'PasswordInput';
