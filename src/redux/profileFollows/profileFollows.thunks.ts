import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  createUsersFollow,
  deleteUsersUnfollow,
  getUsersByidFollowers,
  getUsersCurrentFollowing,
  PaginatedFollowersResponse,
  PaginatedFollowingResponse,
} from '@/api/api.gen';

type FollowersArgs = { profileUserId: number; page: number; limit: number };
type FollowingArgs = { page: number; limit: number };

export const fetchFollowersThunk = createAsyncThunk<
  PaginatedFollowersResponse,
  FollowersArgs
>('profileFollows/fetchFollowers', async ({ profileUserId, page, limit }) => {
  return await getUsersByidFollowers(profileUserId, { page, limit });
});

export const fetchFollowingThunk = createAsyncThunk<
  PaginatedFollowingResponse,
  FollowingArgs
>('profileFollows/fetchFollowing', async ({ page, limit }) => {
  return await getUsersCurrentFollowing({ page, limit });
});

export const followThunk = createAsyncThunk(
  'profileFollows/follow',
  async (targetUserId: number) => {
    await createUsersFollow({ followingId: targetUserId });
    return targetUserId;
  }
);

export const unfollowThunk = createAsyncThunk(
  'profileFollows/unfollow',
  async (targetUserId: number) => {
    await deleteUsersUnfollow({ followingId: targetUserId });
    return targetUserId;
  }
);
