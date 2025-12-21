import { useEffect } from 'react';

import {
  fetchFavorites,
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
import { ListSkeleton } from '@/shared/ui/loaders/list-skeleton';
import { EmptyState } from '@/shared/ui/states/empty-state';

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

  // If after a change the current page becomes empty, auto-step back
  useEffect(() => {
    if (tab !== 'recipes') return;
    if (myRecipesLoading) return;
    if (pagination.page > 1 && myRecipes.length === 0) {
      dispatch(setMyRecipesPage(pagination.page - 1));
    }
  }, [tab, myRecipesLoading, myRecipes.length, pagination.page, dispatch]);

  // Завантажуємо рецепти при зміні сторінки або вкладки
  useEffect(() => {
    if (tab === 'recipes') {
      dispatch(
        fetchMyRecipes({ page: pagination.page, limit: pagination.limit })
      );
    } else if (tab === 'favorites') {
      dispatch(fetchFavorites());
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
    return <ListSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-[15px] border border-[var(--color-error)] bg-red-50 p-8">
        <div className="text-center">
          <p className="text-base font-semibold text-[var(--color-error)] md:text-lg">
            {error}
          </p>
          <button
            onClick={() => {
              if (tab === 'recipes') {
                dispatch(fetchMyRecipes({ page: 1, limit: pagination.limit }));
              }
            }}
            className="mt-4 rounded-[30px] border border-black bg-white px-6 py-2 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (recipes.length === 0) {
    const text =
      tab === 'recipes'
        ? 'Nothing has been added to your recipes list yet. Please browse our recipes and add your favorites for easy access in the future.'
        : 'Nothing has been added to your favorite recipes list yet. Please browse our recipes and add your favorites for easy access in the future.';

    return <EmptyState text={text} />;
  }

  return (
    <div>
      {/* Recipe Cards */}
      <div className="border-t border-light-grey">
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-light-grey bg-white text-black transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
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
                    className="flex h-10 w-10 items-center justify-center text-light-grey"
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
                    ? 'bg-black text-white'
                    : 'border border-light-grey bg-white text-black hover:border-black'
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-light-grey bg-white text-black transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};
