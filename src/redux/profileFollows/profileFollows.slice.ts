import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { FollowerUserDTO, FollowUserDTO } from '@/api/api.gen';

import {
  PROFILE_FOLLOWS_DEFAULT_LIMIT,
  PROFILE_FOLLOWS_DEFAULT_PAGE,
  PROFILE_FOLLOWS_DEFAULT_TOTAL,
  PROFILE_FOLLOWS_DEFAULT_TOTAL_PAGES,
} from './profileFollows.constants';
import {
  fetchFollowersThunk,
  fetchFollowingThunk,
  followThunk,
  unfollowThunk,
} from './profileFollows.thunks.ts';

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type State = {
  followers: FollowerUserDTO[];
  following: FollowUserDTO[];

  followersMeta: Meta;
  followingMeta: Meta;

  isLoadingFollowers: boolean;
  isLoadingFollowing: boolean;

  actionLoadingIds: Record<number, boolean>;
  error: string | null;
};

const defaultMeta: Meta = {
  page: PROFILE_FOLLOWS_DEFAULT_PAGE,
  limit: PROFILE_FOLLOWS_DEFAULT_LIMIT,
  total: PROFILE_FOLLOWS_DEFAULT_TOTAL,
  totalPages: PROFILE_FOLLOWS_DEFAULT_TOTAL_PAGES,
};

const initialState: State = {
  followers: [],
  following: [],
  followersMeta: { ...defaultMeta },
  followingMeta: { ...defaultMeta },
  isLoadingFollowers: false,
  isLoadingFollowing: false,
  actionLoadingIds: {},
  error: null,
};

export const profileFollowsSlice = createSlice({
  name: 'profileFollows',
  initialState,
  reducers: {
    setFollowersPage(state, action: PayloadAction<number>) {
      state.followersMeta.page = action.payload;
    },
    setFollowingPage(state, action: PayloadAction<number>) {
      state.followingMeta.page = action.payload;
    },
    // якщо захочеш керувати лімітом з UI
    setFollowersLimit(state, action: PayloadAction<number>) {
      state.followersMeta.limit = action.payload;
      state.followersMeta.page = 1;
    },
    setFollowingLimit(state, action: PayloadAction<number>) {
      state.followingMeta.limit = action.payload;
      state.followingMeta.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // followers
      .addCase(fetchFollowersThunk.pending, (state) => {
        state.isLoadingFollowers = true;
        state.error = null;
      })
      .addCase(fetchFollowersThunk.fulfilled, (state, action) => {
        state.isLoadingFollowers = false;
        state.followers = action.payload.data ?? [];
        state.followersMeta = {
          page: action.payload.currentPage,
          limit: action.payload.itemsPerPage,
          total: action.payload.totalItems,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchFollowersThunk.rejected, (state, action) => {
        state.isLoadingFollowers = false;
        state.error = action.error.message ?? 'Failed to load followers';
      })

      // following
      .addCase(fetchFollowingThunk.pending, (state) => {
        state.isLoadingFollowing = true;
        state.error = null;
      })
      .addCase(fetchFollowingThunk.fulfilled, (state, action) => {
        state.isLoadingFollowing = false;
        state.following = action.payload.data ?? [];
        state.followingMeta = {
          page: action.payload.currentPage,
          limit: action.payload.itemsPerPage,
          total: action.payload.totalItems,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchFollowingThunk.rejected, (state, action) => {
        state.isLoadingFollowing = false;
        state.error = action.error.message ?? 'Failed to load following';
      })

      // follow/unfollow (loading тільки для кнопки)
      .addCase(followThunk.pending, (state, action) => {
        state.actionLoadingIds[action.meta.arg] = true;
      })
      .addCase(followThunk.fulfilled, (state, action) => {
        state.actionLoadingIds[action.payload] = false;
      })
      .addCase(followThunk.rejected, (state, action) => {
        state.actionLoadingIds[action.meta.arg] = false;
      })

      .addCase(unfollowThunk.pending, (state, action) => {
        state.actionLoadingIds[action.meta.arg] = true;
      })
      .addCase(unfollowThunk.fulfilled, (state, action) => {
        state.actionLoadingIds[action.payload] = false;
      })
      .addCase(unfollowThunk.rejected, (state, action) => {
        state.actionLoadingIds[action.meta.arg] = false;
      });
  },
});

export const {
  setFollowersPage,
  setFollowingPage,
  setFollowersLimit,
  setFollowingLimit,
} = profileFollowsSlice.actions;

export const profileFollowsReducer = profileFollowsSlice.reducer;
