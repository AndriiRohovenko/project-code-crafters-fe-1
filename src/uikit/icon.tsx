import React, { lazy, Suspense, useMemo } from 'react';

import { IconName } from '../shared/types/icons.types';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, size = 32, ...props }) => {
  const LazyIcon = useMemo(
    () =>
      lazy(() =>
        import(`../assets/icons/${name}.svg?react`).catch(() => ({
          default: () => null,
        }))
      ),
    [name]
  );

  return (
    <Suspense fallback={<div style={{ width: size, height: size }} />}>
      <LazyIcon {...props} width={size} height={size} />
    </Suspense>
  );
};
