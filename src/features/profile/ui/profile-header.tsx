import { useEffect, useState } from 'react';

import type { User } from '@/api/api.gen';
import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchMyRecipes,
  selectMyRecipesPagination,
} from '@/redux/profile.slice';
import {
  fetchFollowersThunk,
  fetchFollowingThunk,
} from '@/redux/profileFollows/profileFollows.thunks';
import { updateUserAvatar } from '@/redux/user.slice';
import { Button } from '@/shared/ui/button';
import PlusProfileButton from '@/shared/ui/profile/plus-profile-button';

import { ProfilePhotoUploadModal } from './profile-photo-upload-modal';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const dispatch = useAppDispatch();
  const { openModal } = useModals();

  // Отримуємо дані з Redux
  const myRecipesPagination = useAppSelector(selectMyRecipesPagination);
  const followingMeta = useAppSelector(
    (state) => state.profileFollows.followingMeta
  );
  const followersMeta = useAppSelector(
    (state) => state.profileFollows.followersMeta
  );

  const favoritesMeta = useAppSelector((state) => state.favorites);

  // Avatar and modal state
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatar);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Завантажуємо статистику при монтуванні
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyRecipes({ page: 1, limit: 1 })); // Тільки для кількості
      dispatch(
        fetchFollowingThunk({
          page: 1,
          limit: 1,
        })
      );
      dispatch(
        fetchFollowersThunk({
          profileUserId: user.id,
          page: 1,
          limit: 1,
        })
      );
    }
  }, [dispatch, user?.id]);

  const handleLogout = () => {
    openModal(MODAL_TYPES.LOG_OUT);
  };

  const handleAvatarUploadClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUploadSuccess = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
    // Update user avatar in Redux store to sync across all components
    dispatch(updateUserAvatar(newAvatarUrl));
  };

  const recipesCount = myRecipesPagination.total;
  const followingCount = followingMeta.total;
  const followersCount = followersMeta.total;
  const favoritesCount = favoritesMeta.items.length;

  return (
    <div>
      <div className="mb-5 flex flex-col items-center rounded-lg border border-light-grey bg-white px-20 py-10">
        {/* Аватар */}
        <div className="relative mb-5 flex-shrink-0">
          <img
            src={avatarUrl || 'https://www.gravatar.com/avatar/?d=mp&s=200'}
            alt={user.name || 'User'}
            className="h-32 w-32 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://www.gravatar.com/avatar/?d=mp&s=200';
            }}
          />
          <PlusProfileButton onClick={handleAvatarUploadClick} />
        </div>

        {/* Ім'я */}
        <h2 className="mb-1 text-xl font-bold uppercase text-black">
          {user.name || 'User'}
        </h2>

        {/* Статистика */}
        <div className="mb-6 w-full space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="font-medium text-light-grey">Email:</span>
            <span className="font-semibold text-black">{user.email}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-light-grey">Added recipes:</span>
            <span className="font-semibold text-black">{recipesCount}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-light-grey">Favorites:</span>
            <span className="font-semibold text-black">{favoritesCount}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-light-grey">Following:</span>
            <span className="font-semibold text-black">{followingCount}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-light-grey">Followers:</span>
            <span className="font-semibold text-black">{followersCount}</span>
          </div>
        </div>
      </div>
      {/* Кнопка Logout */}
      <Button
        type="button"
        variant="base"
        label="LOG OUT"
        onClick={handleLogout}
        className="w-full"
      />

      {/* Photo Upload Modal */}
      {isModalOpen && (
        <ProfilePhotoUploadModal
          onClose={handleCloseModal}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};
