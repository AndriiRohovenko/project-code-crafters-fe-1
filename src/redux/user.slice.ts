import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = Record<string, unknown>;

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    cleanUser: (state) => {
      state.user = null;
    },
  },
});

export const { addUser, cleanUser } = userSlice.actions;
