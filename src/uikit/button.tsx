import React from 'react';

interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  variant?: 'base' | 'outline' | 'outline-secondary' | 'outline-grey';
  label: string;
}

const baseStyles =
  'inline-flex items-center justify-center rounded-full px-10 py-3 text-sm font-bold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variants = {
  base: 'bg-black text-white hover:bg-dark-grey focus:ring-black',
  outline:
    'border border-black bg-transparent text-black hover:bg-gray-50 focus:ring-black',
  'outline-secondary':
    'border border-white bg-transparent text-white hover:bg-white/10 focus:ring-white',
  'outline-grey':
    'border border-light-grey bg-transparent text-black hover:bg-gray-50 focus:ring-light-grey',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'base', label, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {label}
      </button>
    );
  }
);

Button.displayName = 'Button';
