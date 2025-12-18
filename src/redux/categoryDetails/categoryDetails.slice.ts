import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { getRecipesSearch, Recipe } from '@/api/api.gen';

import {
  CATEGORY_DETAILS_DEFAULT_LIMIT,
  CATEGORY_DETAILS_DEFAULT_PAGE,
  CATEGORY_DETAILS_DEFAULT_TOTAL,
  CATEGORY_DETAILS_DEFAULT_TOTAL_PAGES,
} from './categoryDetails.constants';

type CategoryDetailsArgs = {
  query: string;
  categoryId: number;
  areaId: number;
  page: number;
  limit: number;
};

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

interface CategoryDetailsState {
  items: Recipe[];
  loading: boolean;
  itemsMeta: Meta;
}

type CategoryDetailsResponse = {
  recipes: Recipe[];
  total: number;
  page: number;
  totalPages: number;
};

const defaultMeta: Meta = {
  page: CATEGORY_DETAILS_DEFAULT_PAGE,
  limit: CATEGORY_DETAILS_DEFAULT_LIMIT,
  total: CATEGORY_DETAILS_DEFAULT_TOTAL,
  totalPages: CATEGORY_DETAILS_DEFAULT_TOTAL_PAGES,
};

const initialState: CategoryDetailsState = {
  items: [],
  itemsMeta: { ...defaultMeta },
  loading: false,
};

export const fetchCategoryDetails = createAsyncThunk<
  CategoryDetailsResponse,
  CategoryDetailsArgs
>(
  'category-details/fetchAll',
  async ({ query, categoryId, areaId, page, limit }) => {
    const response = (await getRecipesSearch({
      query,
      categoryId,
      areaId,
      page,
      limit,
    })) as unknown as CategoryDetailsResponse;

    return response;
  }
);

export const categoryDetailsSlice = createSlice({
  name: 'category-details',
  initialState,
  reducers: {
    setCategoryDetailsPage(state, action: PayloadAction<number>) {
      state.itemsMeta.page = action.payload;
    },
    // якщо захочеш керувати лімітом з UI
    setCategoryDetailsLimit(state, action: PayloadAction<number>) {
      state.itemsMeta.limit = action.payload;
      state.itemsMeta.page = 1;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<CategoryDetailsState>) => {
    builder
      .addCase(fetchCategoryDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.recipes;
        state.itemsMeta.total = action.payload.total;
        state.itemsMeta.page = action.payload.page;
        state.itemsMeta.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCategoryDetails.rejected, (state) => {
        state.loading = false;
      });
  },
});
