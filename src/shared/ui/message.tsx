import { ReactNode } from 'react';

interface MessageProps {
  children: ReactNode;
  className?: string;
}

const Message = ({ children, className = '' }: MessageProps) => {
  return (
    <div
      className={`flex w-full items-center justify-center py-4 text-center text-lg font-medium text-[var(--color-text)] md:py-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Message;
