import React from 'react';

interface MainTitleProps {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  children: React.ReactNode;
}

export const MainTitle: React.FC<MainTitleProps> = ({
  tag: Tag = 'h1',
  children,
}) => {
  return (
    <Tag className="text-[28px] font-extrabold uppercase text-black md:text-[40px]">
      {children}
    </Tag>
  );
};
