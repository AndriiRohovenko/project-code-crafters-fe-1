import React from 'react';

import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import {
  addFavorite,
  removeFavorite,
  selectIsFavorite,
} from '@/redux/favorites.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Icon } from '@/shared/ui/icon';

interface FavoriteButtonProps {
  recipeId: number;
  variant?: 'text' | 'icon';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  recipeId,
  variant = 'text',
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { openModal } = useModals();
  const user = useAppSelector((state) => state.user);
  const isFavorite = useAppSelector(selectIsFavorite(recipeId));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Guest user - show sign-in modal
      openModal(MODAL_TYPES.SIGN_IN);
      return;
    }

    // Logged-in user - toggle favorite
    if (isFavorite) {
      dispatch(removeFavorite(recipeId));
    } else {
      dispatch(addFavorite(recipeId));
    }
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={className}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Icon
          size={18}
          name="heart"
          className={isFavorite ? 'fill-red-500 text-red-500' : ''}
        />
      </button>
    );
  }

  // Text variant - recipe view page
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex h-14 min-w-[156px] items-center justify-center gap-2 rounded-[30px] border border-[var(--color-text)] bg-white px-8 py-4 text-center font-['Mulish'] uppercase text-[var(--color-main)] outline-none transition-all duration-300 hover:border-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white focus-visible:border-[var(--color-main)] focus-visible:bg-[var(--color-main)] focus-visible:text-white ${className}`}
    >
      {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    </button>
  );
};
