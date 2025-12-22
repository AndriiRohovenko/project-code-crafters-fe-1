import { useEffect, useState } from 'react';

import { getRecipesSearch, type Recipe } from '@/api/api.gen';
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
import { ListSkeleton } from '@/shared/ui/loaders/list-skeleton';
import { EmptyState } from '@/shared/ui/states/empty-state';

import { ProfileRecipeCard } from './profile-recipe-card';

interface ProfileRecipesListProps {
  tab: 'recipes' | 'favorites';
  userId?: number;
  isOwnProfile?: boolean;
}

export const ProfileRecipesList = ({
  tab,
  userId,
  isOwnProfile = true,
}: ProfileRecipesListProps) => {
  const dispatch = useAppDispatch();

  // My Recipes (own profile - from Redux)
  const myRecipes = useAppSelector(selectMyRecipes);
  const myRecipesLoading = useAppSelector(selectMyRecipesLoading);
  const myRecipesError = useAppSelector(selectMyRecipesError);
  const pagination = useAppSelector(selectMyRecipesPagination);

  // Favorites
  const favorites = useAppSelector(selectFavorites);
  const favoritesLoading = useAppSelector(selectFavoritesLoading);
  const favoritesError = useAppSelector(selectFavoritesError);

  // Other user's recipes (from API)
  const [otherUserRecipes, setOtherUserRecipes] = useState<Recipe[]>([]);
  const [otherUserLoading, setOtherUserLoading] = useState(false);
  const [otherUserError, setOtherUserError] = useState<string | null>(null);
  const [otherUserPage, setOtherUserPage] = useState(1);
  const [otherUserPagination, setOtherUserPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 4,
  });

  // Визначаємо активні дані
  const recipes =
    tab === 'recipes'
      ? isOwnProfile
        ? myRecipes
        : otherUserRecipes
      : favorites;
  const loading =
    tab === 'recipes'
      ? isOwnProfile
        ? myRecipesLoading
        : otherUserLoading
      : favoritesLoading;
  const error =
    tab === 'recipes'
      ? isOwnProfile
        ? myRecipesError
        : otherUserError
      : favoritesError;
  const currentPagination = isOwnProfile ? pagination : otherUserPagination;

  // Завантажуємо рецепти при зміні сторінки або вкладки
  useEffect(() => {
    if (tab === 'recipes') {
      if (isOwnProfile) {
        dispatch(
          fetchMyRecipes({ page: pagination.page, limit: pagination.limit })
        );
      } else if (userId) {
        // Fetch other user's recipes using search endpoint
        const fetchOtherUserRecipes = async () => {
          setOtherUserLoading(true);
          setOtherUserError(null);
          try {
            const recipesData = await getRecipesSearch({
              userId,
              page: otherUserPage,
              limit: 12, // Default limit as per backend spec
            });
            setOtherUserRecipes(recipesData);
            // Note: Search endpoint returns Recipe[] without pagination metadata
            // Calculate pagination based on returned results
            const hasMore = recipesData.length === 12;
            setOtherUserPagination({
              total: recipesData.length,
              page: otherUserPage,
              totalPages: hasMore ? otherUserPage + 1 : otherUserPage,
              limit: 12,
            });
          } catch (err) {
            console.error('Error fetching user recipes:', err);
            setOtherUserError('Failed to load recipes');
          } finally {
            setOtherUserLoading(false);
          }
        };
        fetchOtherUserRecipes();
      }
    }
  }, [
    dispatch,
    tab,
    pagination.page,
    pagination.limit,
    isOwnProfile,
    userId,
    otherUserPage,
    otherUserPagination.limit,
  ]);

  const handlePageChange = (newPage: number) => {
    if (tab === 'recipes') {
      if (isOwnProfile) {
        dispatch(setMyRecipesPage(newPage));
      } else {
        setOtherUserPage(newPage);
      }
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
                if (isOwnProfile) {
                  dispatch(
                    fetchMyRecipes({ page: 1, limit: pagination.limit })
                  );
                } else {
                  setOtherUserPage(1);
                }
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
        ? isOwnProfile
          ? 'Nothing has been added to your recipes list yet. Please browse our recipes and add your favorites for easy access in the future.'
          : 'This user has not added any recipes yet.'
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
            mode={
              tab === 'recipes'
                ? isOwnProfile
                  ? 'myRecipes'
                  : 'viewOnly'
                : 'favorites'
            }
          />
        ))}
      </div>

      {/* Pagination - тільки для My Recipes */}
      {tab === 'recipes' && currentPagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPagination.page - 1)}
            disabled={currentPagination.page === 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-light-grey bg-white text-black transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            ←
          </button>

          {/* Page Numbers */}
          {[...Array(currentPagination.totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = currentPagination.page === pageNum;

            const showPage =
              pageNum === 1 ||
              pageNum === currentPagination.totalPages ||
              Math.abs(pageNum - currentPagination.page) <= 1;

            if (!showPage) {
              if (
                pageNum === currentPagination.page - 2 ||
                pageNum === currentPagination.page + 2
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
            onClick={() => handlePageChange(currentPagination.page + 1)}
            disabled={currentPagination.page === currentPagination.totalPages}
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
