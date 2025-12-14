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
  },
});

export const { addUser, cleanUser } = userSlice.actions;
