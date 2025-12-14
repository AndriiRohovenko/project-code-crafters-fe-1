import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = Record<string, unknown>;

interface UserState {
  user: User | undefined;
}

const initialState: UserState = {
  user: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    cleanUser: (state) => {
      state.user = undefined;
    },
  },
});

export const { addUser, cleanUser } = userSlice.actions;
