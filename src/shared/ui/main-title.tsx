import React from 'react';

interface MainTitleProps {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  children: React.ReactNode;
  className?: string;
}

export const MainTitle: React.FC<MainTitleProps> = ({
  tag: Tag = 'h1',
  children,
  className = '',
}) => {
  return (
    <Tag
      className={`text-[28px] font-extrabold uppercase leading-8 tracking-[-0.56px] text-black md:text-[40px] md:leading-[44px] md:tracking-[-0.8px] ${className}`}
    >
      {children}
    </Tag>
  );
};
