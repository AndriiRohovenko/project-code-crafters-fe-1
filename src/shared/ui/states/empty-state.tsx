import React from 'react';

type Props = {
  text: string;
  className?: string;
};

export const EmptyState: React.FC<Props> = ({ text, className = '' }) => {
  return (
    <div
      className={[
        // spacing
        'pt-[80px] md:pt-[100px] 2xl:pt-[140px]',
        // layout
        'w-full text-center',
        className,
      ].join(' ')}
    >
      <p
        className={[
          // width from tablet+
          'mx-auto md:max-w-[610px]',
          // typography
          'font-medium tracking-[-0.02em]',
          'text-[14px] leading-5 md:text-[16px] md:leading-6',
          // color
          'text-light-grey md:text-dark-grey',
        ].join(' ')}
      >
        {text}
      </p>
    </div>
  );
};
