import { useEffect, useMemo } from 'react';

import type { User } from '@/api/api.gen';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchFollowersThunk,
  fetchFollowingThunk,
  followThunk,
  unfollowThunk,
} from '@/redux/profileFollows/profileFollows.thunks';
import { Button } from '@/shared/ui/button';

interface ProfileUserHeaderProps {
  user: User;
}

/**
 * Compact header for viewing another user's profile.
 * Shows avatar, name, email and a Follow/Unfollow button.
 */
export const ProfileUserHeader = ({ user }: ProfileUserHeaderProps) => {
  const dispatch = useAppDispatch();
  const followersMeta = useAppSelector((s) => s.profileFollows.followersMeta);
  const followingList = useAppSelector((s) => s.profileFollows.following);

  const avatarUrl = useMemo(
    () => user.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=200',
    [user.avatar]
  );

  const isFollowing = useMemo(() => {
    if (!user?.id) return false;
    return (followingList || []).some((f) => f.id === user.id);
  }, [followingList, user.id]);

  useEffect(() => {
    if (!user?.id) return;
    // Fetch follower count and following list
    dispatch(
      fetchFollowersThunk({ profileUserId: user.id, page: 1, limit: 1 })
    );
    dispatch(fetchFollowingThunk({ page: 1, limit: 100 }));
  }, [dispatch, user?.id]);

  const handleFollowToggle = async () => {
    if (!user?.id) return;
    try {
      if (isFollowing) {
        await dispatch(unfollowThunk(user.id)).unwrap();
      } else {
        await dispatch(followThunk(user.id)).unwrap();
      }
      // Refresh counts and following list
      await Promise.all([
        dispatch(
          fetchFollowersThunk({ profileUserId: user.id, page: 1, limit: 1 })
        ),
        dispatch(fetchFollowingThunk({ page: 1, limit: 100 })),
      ]);
    } catch {
      // Error handling
    }
  };

  const followersCount = followersMeta.total;

  return (
    <div>
      <div className="mb-5 flex flex-col items-center rounded-lg border border-light-grey bg-white px-20 py-10">
        <div className="relative mb-5 flex-shrink-0">
          <img
            src={avatarUrl}
            alt={user.name || 'User'}
            className="h-32 w-32 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://www.gravatar.com/avatar/?d=mp&s=200';
            }}
          />
        </div>

        <h2 className="mb-1 text-xl font-bold uppercase text-black">
          {user.name || 'User'}
        </h2>

        <div className="mb-6 w-full space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="font-medium text-light-grey">Email:</span>
            <span className="font-semibold text-black">{user.email}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-light-grey">Followers:</span>
            <span className="font-semibold text-black">{followersCount}</span>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="base"
        label={isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
        onClick={handleFollowToggle}
        className="w-full"
      />
    </div>
  );
};
