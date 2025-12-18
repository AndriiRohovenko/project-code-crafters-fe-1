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
    <div className="mb-8 flex flex-col items-center gap-6 rounded-lg border border-gray-200 bg-white p-6 md:flex-row md:items-start md:p-8">
      {/* Аватар */}
      <div className="flex-shrink-0">
        <img
          src={user.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=200'}
          alt={user.name || 'User'}
          className="h-24 w-24 rounded-full object-cover md:h-32 md:w-32"
          onError={(e) => {
            e.currentTarget.src = 'https://www.gravatar.com/avatar/?d=mp&s=200';
          }}
        />
      </div>
       {/* Інформація */}
      <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
        <h2 className="mb-1 text-xl font-bold uppercase md:text-2xl">
          {user.name || 'User'}
        </h2>
        <p className="mb-4 text-sm text-gray-600 md:text-base">{user.email}</p>

        {/* Статистика */}
        <div className="mb-6 flex gap-4 text-sm md:gap-6 md:text-base">
          <div>
            <span className="font-semibold">Recipes: </span>
            <span className="text-gray-600">{recipesCount}</span>
          </div>
          <div>
            <span className="font-semibold">Following: </span>
            <span className="text-gray-600">{followingCount}</span>
          </div>
          <div>
            <span className="font-semibold">Followers: </span>
            <span className="text-gray-600">{followersCount}</span>
          </div>
        </div>

        {/* Кнопка Logout */}
        <Button
          type="button"
          variant="dark"
          label="LOG OUT"
          onClick={handleLogout}
          className="w-full md:w-auto"
        />
      </div>
    </div>
  );
};
