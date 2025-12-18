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
  }, [dispatch, tab, pagination.page, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    if (tab === 'recipes') {
      dispatch(setMyRecipesPage(newPage));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-0">
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 border-b border-[#bfbebe] py-5 md:gap-4 md:py-6"
          >
            <div className="h-[75px] w-[75px] flex-shrink-0 animate-pulse rounded-[15px] bg-gray-200 md:h-[85px] md:w-[85px]"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="flex gap-2 md:gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 md:h-11 md:w-11"></div>
              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 md:h-11 md:w-11"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-[15px] border border-[#e44848] bg-red-50 p-8">
        <div className="text-center">
          <p className="text-base font-semibold text-[#e44848] md:text-lg">
            {error}
          </p>
          <button
            onClick={() => {
              if (tab === 'recipes') {
                dispatch(fetchMyRecipes({ page: 1, limit: pagination.limit }));
              }
            }}
            className="mt-4 rounded-[30px] border border-[#050505] bg-white px-6 py-2 text-sm font-semibold text-[#050505] transition-colors hover:bg-[#050505] hover:text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (recipes.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-[15px] border border-dashed border-[#bfbebe] bg-gray-50 p-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <svg
              className="h-16 w-16 text-[#bfbebe] md:h-20 md:w-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p className="mb-2 text-base font-semibold text-[#050505] md:text-lg">
            {tab === 'recipes'
              ? 'You have no recipes yet'
              : 'You have no favorite recipes yet'}
          </p>
          <p className="text-sm text-[#1a1a1a]">
            {tab === 'recipes'
              ? 'Create your first recipe to share it with others'
              : 'Add recipes to favorites to quickly find them'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Recipe Cards */}
      <div className="border-t border-[#bfbebe]">
        {recipes.map((recipe) => (
          <ProfileRecipeCard
            key={recipe.id}
            recipe={recipe}
            mode={tab === 'recipes' ? 'myRecipes' : 'favorites'}
          />
        ))}
      </div>

      {/* Pagination - тільки для My Recipes */}
      {tab === 'recipes' && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#bfbebe] bg-white text-[#050505] transition-colors hover:border-[#050505] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            ←
          </button>

          {/* Page Numbers */}
          {[...Array(pagination.totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pagination.page === pageNum;

            const showPage =
              pageNum === 1 ||
              pageNum === pagination.totalPages ||
              Math.abs(pageNum - pagination.page) <= 1;

            if (!showPage) {
              if (
                pageNum === pagination.page - 2 ||
                pageNum === pagination.page + 2
              ) {
                return (
                  <span
                    key={pageNum}
                    className="flex h-10 w-10 items-center justify-center text-[#bfbebe]"
                  >
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#050505] text-white'
                    : 'border border-[#bfbebe] bg-white text-[#050505] hover:border-[#050505]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#bfbebe] bg-white text-[#050505] transition-colors hover:border-[#050505] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};
