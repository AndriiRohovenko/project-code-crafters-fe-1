import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { deleteRecipesByid, getRecipesMyRecipes, Recipe } from '@/api/api.gen';

import type { RootState } from './store';

// State shape
interface ProfileState {
  myRecipes: {
    items: Recipe[];
    loading: boolean;
    error: string | null;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const initialState: ProfileState = {
  myRecipes: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  },
};

// Async thunks
export const fetchMyRecipes = createAsyncThunk<
  {
    recipes: Recipe[];
    total: number;
    page: number;
    totalPages: number;
  },
  { page?: number; limit?: number },
  { rejectValue: string }
>(
  'profile/fetchMyRecipes',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getRecipesMyRecipes({ page, limit });
    return {
        recipes: response.recipes || [],
        total: response.total || 0,
        page: response.page || page,
        totalPages: response.totalPages || 0,
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch recipes'
    );
  }
});

export const deleteMyRecipe = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('profile/deleteMyRecipe', async (recipeId, { rejectWithValue }) => {
  try {
    await deleteRecipesByid(recipeId);
    return recipeId;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to delete recipe'
    );
  }
});

// Slice
export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setMyRecipesPage: (state, action: PayloadAction<number>) => {
      state.myRecipes.pagination.page = action.payload;
    },
    clearMyRecipes: (state) => {
      state.myRecipes.items = [];
      state.myRecipes.error = null;
      state.myRecipes.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my recipes
      .addCase(fetchMyRecipes.pending, (state) => {
        state.myRecipes.loading = true;
        state.myRecipes.error = null;
      })
      .addCase(fetchMyRecipes.fulfilled, (state, action) => {
        state.myRecipes.loading = false;
        state.myRecipes.items = action.payload.recipes;
        state.myRecipes.pagination = {
          page: action.payload.page,
          limit: state.myRecipes.pagination.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchMyRecipes.rejected, (state, action) => {
        state.myRecipes.loading = false;
        state.myRecipes.error = action.payload || 'Failed to fetch recipes';
      })

      // Delete recipe
      .addCase(deleteMyRecipe.pending, (state) => {
        state.myRecipes.loading = true;
        state.myRecipes.error = null;
      })
      .addCase(deleteMyRecipe.fulfilled, (state, action) => {
        state.myRecipes.loading = false;
        state.myRecipes.items = state.myRecipes.items.filter(
          (recipe) => recipe.id !== action.payload
        );
        state.myRecipes.pagination.total -= 1;
      })
      .addCase(deleteMyRecipe.rejected, (state, action) => {
        state.myRecipes.loading = false;
        state.myRecipes.error = action.payload || 'Failed to delete recipe';
      });
  },
});

// Actions
export const { setMyRecipesPage, clearMyRecipes } = profileSlice.actions;

// Selectors
export const selectMyRecipes = (state: RootState) => state.profile.myRecipes.items;
export const selectMyRecipesLoading = (state: RootState) =>
  state.profile.myRecipes.loading;
export const selectMyRecipesError = (state: RootState) =>
  state.profile.myRecipes.error;
export const selectMyRecipesPagination = (state: RootState) =>
  state.profile.myRecipes.pagination;