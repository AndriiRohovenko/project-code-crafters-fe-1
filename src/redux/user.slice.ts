import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@/api/api.gen';

const initialState = null as User | null;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (_state, action: PayloadAction<User>) => {
      return action.payload;
    },
    cleanUser: () => {
      return null;
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      if (state) {
        state.avatar = action.payload;
      }
    },
  },
});

export const { addUser, cleanUser, updateUserAvatar } = userSlice.actions;
