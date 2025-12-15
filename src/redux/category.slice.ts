import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import { Category, getCategories } from '@/api/api.gen';

interface CategoryState {
  items: Category[];
  loading: boolean;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async () => {
    return await getCategories();
  }
);

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<CategoryState>) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});
