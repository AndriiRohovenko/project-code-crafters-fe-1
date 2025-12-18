import { useEffect } from 'react';

import {
  selectFavorites,
  selectFavoritesError,
  selectFavoritesLoading,
} from '@/redux/favorites.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchMyRecipes,
  selectMyRecipes,
  selectMyRecipesError,
  selectMyRecipesLoading,
  selectMyRecipesPagination,
  setMyRecipesPage,
} from '@/redux/profile.slice';

import { ProfileRecipeCard } from './profile-recipe-card';

interface ProfileRecipesListProps {
  tab: 'recipes' | 'favorites';
}

export const ProfileRecipesList = ({ tab }: ProfileRecipesListProps) => {
  const dispatch = useAppDispatch();

  // My Recipes
  const myRecipes = useAppSelector(selectMyRecipes);
  const myRecipesLoading = useAppSelector(selectMyRecipesLoading);
  const myRecipesError = useAppSelector(selectMyRecipesError);
  const pagination = useAppSelector(selectMyRecipesPagination);

  // Favorites
  const favorites = useAppSelector(selectFavorites);
  const favoritesLoading = useAppSelector(selectFavoritesLoading);
  const favoritesError = useAppSelector(selectFavoritesError);

  // Визначаємо активні дані
  const recipes = tab === 'recipes' ? myRecipes : favorites;
  const loading = tab === 'recipes' ? myRecipesLoading : favoritesLoading;
  const error = tab === 'recipes' ? myRecipesError : favoritesError;

  // Завантажуємо рецепти при зміні сторінки або вкладки
  useEffect(() => {
    if (tab === 'recipes') {
      dispatch(
        fetchMyRecipes({ page: pagination.page, limit: pagination.limit })
      );
    }
    // Favorites вже завантажуються при логіні
  }, [dispatch, tab, pagination.page, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    if (tab === 'recipes') {
      dispatch(setMyRecipesPage(newPage));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-gray-500">Завантаження...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-gray-500">
          {tab === 'recipes'
            ? 'У вас ще немає рецептів'
            : 'У вас ще немає обраних рецептів'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 md:space-y-6">
        {recipes.map((recipe) => (
          <ProfileRecipeCard
            key={recipe.id}
            recipe={recipe}
            showActions={tab === 'recipes'}
          />
        ))}
      </div>

      {/* Пагінація тільки для My Recipes */}
      {tab === 'recipes' && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="rounded border border-gray-300 px-3 py-2 text-sm disabled:opacity-50 md:px-4"
          >
            ←
          </button>

          {[...Array(pagination.totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`rounded px-3 py-2 text-sm md:px-4 ${
                  pagination.page === pageNum
                    ? 'bg-black text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="rounded border border-gray-300 px-3 py-2 text-sm disabled:opacity-50 md:px-4"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};
