import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createFavoritesByrecipeId,
  deleteFavoritesByrecipeId,
  getFavorites,
  PaginatedFavoritesResponse,
  Recipe,
} from '@/api/api.gen';

import type { RootState } from './store';

// State shape
type FavoriteItem = Recipe & { image: string };

interface FavoritesState {
  items: FavoriteItem[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchFavorites = createAsyncThunk<
  PaginatedFavoritesResponse,
  void,
  { rejectValue: string }
>('favorites/fetchFavorites', async (_, { rejectWithValue }) => {
  try {
    const response = await getFavorites();
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch favorites'
    );
  }
});

export const addFavorite = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('favorites/addFavorite', async (recipeId, { rejectWithValue }) => {
  try {
    await createFavoritesByrecipeId(recipeId);
    return recipeId;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to add to favorites'
    );
  }
});

export const removeFavorite = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('favorites/removeFavorite', async (recipeId, { rejectWithValue }) => {
  try {
    await deleteFavoritesByrecipeId(recipeId);
    return recipeId;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to remove from favorites'
    );
  }
});

// Slice
export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFavorites.fulfilled,
        (state, action: PayloadAction<PaginatedFavoritesResponse>) => {
          if (action.payload && Array.isArray(action.payload.data)) {
            state.items = action.payload.data.map((item) => ({
              ...item,
              image: item.image || item.thumb || item.preview || '',
            }));
          } else {
            state.items = [];
          }
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch favorites';
      })

      // Add favorite
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addFavorite.fulfilled,
        (state, action: PayloadAction<number>) => {
          const recipeId = action.payload;
          const alreadyExists = state.items.some(
            (item) => item.id === recipeId
          );
          if (!alreadyExists) {
            // Add a placeholder item, will be replaced when fetchFavorites is called
            state.items.push({ id: recipeId, title: '', image: '' });
          }
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add to favorites';
      })

      // Remove favorite
      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeFavorite.fulfilled,
        (state, action: PayloadAction<number>) => {
          const recipeId = action.payload;
          state.items = state.items.filter((item) => item.id !== recipeId);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to remove from favorites';
      });
  },
});

// Actions
export const { clearFavorites } = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state: RootState) => state.favorites.items;
export const selectFavoritesLoading = (state: RootState) =>
  state.favorites.loading;
export const selectFavoritesError = (state: RootState) => state.favorites.error;
export const selectIsFavorite = (recipeId: number) => (state: RootState) =>
  Array.isArray(state.favorites.items) &&
  state.favorites.items.some((item) => item.id === recipeId);
