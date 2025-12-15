import React from 'react';

interface MainTitleProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

const MainTitle: React.FC<MainTitleProps> = ({ text, tag: Tag = 'h1' }) => {
  return (
    <Tag className="text-[28px] font-extrabold uppercase text-black md:text-[40px]">
      {text}
    </Tag>
  );
};

export default MainTitle;
