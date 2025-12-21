import { configureStore } from '@reduxjs/toolkit';

import { categorySlice } from './category.slice';
import { categoryDetailsSlice } from './categoryDetails/categoryDetails.slice';
import { favoritesSlice } from './favorites.slice';
import { profileSlice } from './profile.slice';
import { profileFollowsReducer } from './profileFollows/profileFollows.slice';
import { userSlice } from './user.slice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    categories: categorySlice.reducer,
    categoryDetails: categoryDetailsSlice.reducer,
    favorites: favoritesSlice.reducer,
    profile: profileSlice.reducer,
    profileFollows: profileFollowsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
