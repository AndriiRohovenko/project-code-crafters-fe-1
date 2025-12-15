import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => (
  <div className="mx-auto min-w-[320px] max-w-[375px] px-4 md:max-w-[768px] md:px-8 2xl:max-w-[1440px] 2xl:px-20">
    {children}
  </div>
);

export default Container;
