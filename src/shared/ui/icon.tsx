import React, { lazy, Suspense, useMemo } from 'react';

import { IconName } from '@/shared/types/icons.types';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const iconCache = new Map<
  IconName,
  React.LazyExoticComponent<React.ComponentType<React.SVGProps<SVGSVGElement>>>
>();

export const Icon: React.FC<IconProps> = ({ name, size = 32, ...props }) => {
  const LazyIcon = useMemo(() => {
    if (iconCache.has(name)) {
      return iconCache.get(name)!;
    }

    const LazyIconComponent = lazy(() =>
      import(`@/assets/icons/${name}.svg?react`).catch(() => ({
        default: () => null,
      }))
    );

    iconCache.set(name, LazyIconComponent);
    return LazyIconComponent;
  }, [name]);

  return (
    <Suspense fallback={<div style={{ width: size, height: size }} />}>
      <LazyIcon {...props} width={size} height={size} />
    </Suspense>
  );
};
