import React from 'react';

import ArrowUpRight from '../assets/icons/arrow-up-right.svg?react';
import Burger from '../assets/icons/burger.svg?react';
import Camera from '../assets/icons/camera.svg?react';
import CheckActive from '../assets/icons/check-active.svg?react';
import CheckEmpty from '../assets/icons/check-empty.svg?react';
import Close from '../assets/icons/close.svg?react';
import Down from '../assets/icons/down.svg?react';
import Eye from '../assets/icons/eye.svg?react';
import EyeOff from '../assets/icons/eye-off.svg?react';
import Facebook from '../assets/icons/facebook.svg?react';
import Heart from '../assets/icons/heart.svg?react';
import IconBack from '../assets/icons/icon-back.svg?react';
import IconGithub from '../assets/icons/icon-github.svg?react';
import IconLinkedin from '../assets/icons/icon-linkedin.svg?react';
import Instagram from '../assets/icons/instagram.svg?react';
import Logo from '../assets/icons/logo.svg?react';
import Minus from '../assets/icons/minus.svg?react';
import Plus from '../assets/icons/plus.svg?react';
import Quote from '../assets/icons/quote.svg?react';
import Trash from '../assets/icons/trash.svg?react';
import Up from '../assets/icons/up.svg?react';
import Youtube from '../assets/icons/youtube.svg?react';

const icons = {
  'arrow-up-right': ArrowUpRight,
  burger: Burger,
  camera: Camera,
  'check-active': CheckActive,
  'check-empty': CheckEmpty,
  close: Close,
  down: Down,
  'eye-off': EyeOff,
  eye: Eye,
  facebook: Facebook,
  heart: Heart,
  'icon-back': IconBack,
  'icon-github': IconGithub,
  'icon-linkedin': IconLinkedin,
  instagram: Instagram,
  logo: Logo,
  minus: Minus,
  plus: Plus,
  quote: Quote,
  trash: Trash,
  up: Up,
  youtube: Youtube,
};

export type IconName = keyof typeof icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const SvgComponent = icons[name];
  if (!SvgComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  return <SvgComponent {...props} />;
};
