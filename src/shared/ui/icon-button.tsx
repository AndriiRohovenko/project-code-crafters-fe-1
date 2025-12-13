import React from 'react';

import { IconName } from '@/shared/types/icons.types';
import { Icon } from '@/shared/ui/icon';

type IconButtonSize = 'small' | 'extra-medium' | 'medium' | 'large';
type IconButtonType = 'button' | 'base' | 'link';

interface IconButtonProps {
  iconName: IconName;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  size?: IconButtonSize;
  onClick?: () => void;
  type?: IconButtonType;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

const sizeClasses: Record<IconButtonSize, string> = {
  small: 'w-9 h-9', // 36x36
  'extra-medium': 'w-10 h-10', // 40x40
  medium: 'w-[42px] h-[42px]', // 42x42
  large: 'w-14 h-14', // 56x56
};

const iconSizeMap: Record<IconButtonSize, number> = {
  small: 16,
  'extra-medium': 18,
  medium: 20,
  large: 24,
};

export const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  iconColor = 'var(--color-dark-grey)',
  backgroundColor = 'var(--color-white)',
  borderColor = 'var(--color-light-grey)',
  size = 'medium',
  onClick,
  type = 'button',
  className = '',
  href,
  target,
  rel,
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    rounded-full border
    transition-all duration-200 ease-in-out cursor-pointer
    ${sizeClasses[size]}
    ${className}
  `.trim();

  const inlineStyles: React.CSSProperties = {
    backgroundColor,
    borderColor,
    color: iconColor,
  };

  if (type === 'base') {
    return (
      <div className={baseClasses} style={inlineStyles} onClick={onClick}>
        <Icon name={iconName} size={iconSizeMap[size]} />
      </div>
    );
  }

  if (type === 'link') {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={baseClasses}
        style={inlineStyles}
        onClick={onClick}
      >
        <Icon name={iconName} size={iconSizeMap[size]} />
      </a>
    );
  }

  return (
    <button
      type="button"
      className={baseClasses}
      style={inlineStyles}
      onClick={onClick}
    >
      <Icon name={iconName} size={iconSizeMap[size]} />
    </button>
  );
};
