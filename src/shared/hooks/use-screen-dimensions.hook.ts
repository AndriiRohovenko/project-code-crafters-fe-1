import { useEffect, useState } from 'react';

const MOBILE_MIN = 275;
const MOBILE_MAX = 767;
const TABLET_MIN = 267;
const TABLET_MAX = 1279;
const DESKTOP_MIN = 1280;

export const useScreenDimensions = () => {
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window === 'undefined') {
      return { isMobile: false, isTablet: false, isDesktop: false };
    }
    const width = window.innerWidth;
    return {
      isMobile: width >= MOBILE_MIN && width <= MOBILE_MAX,
      isTablet: width >= TABLET_MIN && width <= TABLET_MAX,
      isDesktop: width >= DESKTOP_MIN,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setDimensions({
        isMobile: width >= MOBILE_MIN && width <= MOBILE_MAX,
        isTablet: width >= TABLET_MIN && width <= TABLET_MAX,
        isDesktop: width >= DESKTOP_MIN,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};
