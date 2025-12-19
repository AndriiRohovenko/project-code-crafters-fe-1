import { useEffect } from 'react';

import type { User } from '@/api/api.gen';
import { signOut } from '@/features/auth/auth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchMyRecipes,
  selectMyRecipesPagination,
} from '@/redux/profile.slice';
import {
  fetchFollowersThunk,
  fetchFollowingThunk,
} from '@/redux/profileFollows/profileFollows.thunks';
import { Button } from '@/shared/ui/button';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const dispatch = useAppDispatch();

  // Отримуємо дані з Redux
  const myRecipesPagination = useAppSelector(selectMyRecipesPagination);
  const followingMeta = useAppSelector(
    (state) => state.profileFollows.followingMeta
  );
  const followersMeta = useAppSelector(
    (state) => state.profileFollows.followersMeta
  );

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
    signOut();
    window.location.href = '/';
  };

  const recipesCount = myRecipesPagination.total;
  const followingCount = followingMeta.total;
  const followersCount = followersMeta.total;

  return (
    <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6">
      {/* Аватар */}
      <div className="mb-4 flex-shrink-0">
        <img
          src={user.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=200'}
          alt={user.name || 'User'}
          className="h-32 w-32 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://www.gravatar.com/avatar/?d=mp&s=200';
          }}
        />
      </div>

      {/* Ім'я */}
      <h2 className="mb-1 text-xl font-bold uppercase">
        {user.name || 'User'}
      </h2>

      {/* Email */}
      <p className="mb-6 text-sm text-gray-600">{user.email}</p>

      {/* Статистика */}
      <div className="mb-6 w-full space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-semibold">Recipes:</span>
          <span className="text-gray-600">{recipesCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Following:</span>
          <span className="text-gray-600">{followingCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Followers:</span>
          <span className="text-gray-600">{followersCount}</span>
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
    </div>
  );
};
