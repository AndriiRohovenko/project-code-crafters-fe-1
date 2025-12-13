import React from 'react';

import LogoIcon from '@/assets/icons/logo.svg?react';
import { IconName } from '@/shared/types/icons.types';
import { IconButton } from '@/shared/ui/icon-button';

import { useScreenDimensions } from '../hooks/use-screen-dimensions.hook';

const SMALL_LOGO_SIZE = 69;
const LARGE_LOGO_SIZE = 83;
const MAX_CONTENT_WIDTH = 1280;

interface SocialMediaConfig {
  iconName: IconName;
  href: string;
  target?: string;
}

const SOCIAL_MEDIA_CONFIG: SocialMediaConfig[] = [
  {
    iconName: 'facebook',
    href: 'https://www.facebook.com',
    target: '_blank',
  },
  {
    iconName: 'instagram',
    href: 'https://www.instagram.com',
    target: '_blank',
  },
  {
    iconName: 'youtube',
    href: 'https://www.youtube.com',
    target: '_blank',
  },
];

export const Footer: React.FC = () => {
  const { isMobile } = useScreenDimensions();

  const iconButtonSize = isMobile ? 'small' : 'extra-medium';

  return (
    <footer className="pb-4 md:pb-8 2xl:pb-10">
      <div
        className={`max-w-[${MAX_CONTENT_WIDTH}px] mx-auto mb-10 flex items-center justify-between px-4 md:px-8 2xl:px-0`}
      >
        <LogoIcon
          width={isMobile ? SMALL_LOGO_SIZE : LARGE_LOGO_SIZE}
          className="text-black"
        />

        <div className="flex items-center gap-3">
          {SOCIAL_MEDIA_CONFIG.map((social) => (
            <IconButton
              key={social.iconName}
              iconName={social.iconName}
              type="link"
              size={iconButtonSize}
              href={social.href}
              target={social.target}
            />
          ))}
        </div>
      </div>

      <div className="mb-10 border-t border-light-grey"></div>

      <p className="text-center text-sm text-black">
        @2024, Foodies. All rights reserved
      </p>
    </footer>
  );
};
