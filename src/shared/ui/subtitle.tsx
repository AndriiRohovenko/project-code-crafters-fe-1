import React from 'react';

interface SubtitleProps {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  children: React.ReactNode;
}

export const Subtitle: React.FC<SubtitleProps> = ({
  tag: Tag = 'p',
  children,
}) => {
  return (
    <Tag className="mb-8 text-[14px] leading-5 tracking-[-0.28px] text-black md:mb-10 md:text-base">
      {children}
    </Tag>
  );
};
