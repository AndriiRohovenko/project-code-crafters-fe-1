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

  const favoritesMeta = useAppSelector((state) => state.favorites);

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
  const favoritesCount = favoritesMeta.items.length;

  return (
    <div>
      <div className="mb-5 flex flex-col items-center rounded-lg border border-light-grey bg-white px-20 py-10">
        {/* Аватар */}
        <div className="mb-4 flex-shrink-0">
          <img
            src={user.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=200'}
            alt={user.name || 'User'}
            className="h-32 w-32 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://www.gravatar.com/avatar/?d=mp&s=200';
            }}
          />
          {/* <button
          className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
          aria-label="Edit profile picture"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 4V16M4 10H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button> */}
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
    </div>
  );
};
