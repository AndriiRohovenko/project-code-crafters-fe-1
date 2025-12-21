import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setFollowersPage,
  setFollowingPage,
} from '@/redux/profileFollows/profileFollows.slice';
import {
  fetchFollowersThunk,
  fetchFollowingThunk,
  followThunk,
  unfollowThunk,
} from '@/redux/profileFollows/profileFollows.thunks';
import { Pagination } from '@/shared/ui/pagination/pagination';

import { ProfileFollowList } from './profile-follow-list';

type Props = {
  tab: 'followers' | 'following';
  profileUserId?: number;
};

export const ProfileFollowPanel = ({ tab, profileUserId }: Props) => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.user);

  const {
    followers,
    following,
    followersMeta,
    followingMeta,
    isLoadingFollowers,
    isLoadingFollowing,
    actionLoadingIds,
    error,
  } = useAppSelector((s) => s.profileFollows);

  const meta = tab === 'followers' ? followersMeta : followingMeta;
  const list = tab === 'followers' ? followers : following;
  const isLoading =
    tab === 'followers' ? isLoadingFollowers : isLoadingFollowing;

  const effectiveProfileUserId = profileUserId ?? authUser?.id;

  useEffect(() => {
    if (!authUser) return;

    if (tab === 'followers') {
      if (!effectiveProfileUserId) return;
      dispatch(
        fetchFollowersThunk({
          profileUserId: effectiveProfileUserId,
          page: meta.page,
          limit: meta.limit || 10,
        })
      );
    } else {
      dispatch(
        fetchFollowingThunk({ page: meta.page, limit: meta.limit || 10 })
      );
    }
  }, [dispatch, tab, authUser, effectiveProfileUserId, meta.page, meta.limit]);

  // ✅ Auto-back: якщо на сторінці 0 елементів (після delete),
  // і це не 1ша сторінка, то переходимо на попередню.
  useEffect(() => {
    if (!authUser) return;
    if (isLoading) return;

    // Якщо list порожній, а ми не на першій сторінці,
    // "відкочуємо" page на 1 назад.
    if (list.length === 0 && meta.page > 1) {
      if (tab === 'followers') dispatch(setFollowersPage(meta.page - 1));
      else dispatch(setFollowingPage(meta.page - 1));
    }
  }, [authUser, isLoading, list.length, meta.page, tab, dispatch]);

  const refetchFollowers = async () => {
    if (!authUser) return;
    if (!effectiveProfileUserId) return;

    await dispatch(
      fetchFollowersThunk({
        profileUserId: effectiveProfileUserId,
        page: followersMeta.page,
        limit: followersMeta.limit,
      })
    );
  };

  const refetchFollowing = async () => {
    if (!authUser) return;

    await dispatch(
      fetchFollowingThunk({
        page: followingMeta.page,
        limit: followingMeta.limit,
      })
    );
  };

  const refetchAfterAction = async () => {
    await Promise.all([refetchFollowing(), refetchFollowers()]);
  };

  const handleFollow = async (id: number) => {
    await dispatch(followThunk(id));
    await refetchAfterAction();
  };

  const handleUnfollow = async (id: number) => {
    await dispatch(unfollowThunk(id));
    await refetchAfterAction();
  };

  const onPageChange = (nextPage: number) => {
    if (tab === 'followers') dispatch(setFollowersPage(nextPage));
    else dispatch(setFollowingPage(nextPage));
  };

  if (!authUser) {
    return <div className="py-8 text-sm text-neutral-500">No auth user</div>;
  }

  return (
    <div>
      <ProfileFollowList
        tab={tab}
        users={list}
        isLoading={isLoading}
        error={error}
        actionLoadingIds={actionLoadingIds}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        rows={meta.limit}
      />

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
