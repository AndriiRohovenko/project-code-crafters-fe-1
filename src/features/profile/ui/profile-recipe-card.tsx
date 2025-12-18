import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { Recipe, RecipePreviewDTO } from '@/api/api.gen';
import { removeFavorite } from '@/redux/favorites.slice';
import { useAppDispatch } from '@/redux/hooks';
import { deleteMyRecipe, fetchMyRecipes } from '@/redux/profile.slice';

interface ProfileRecipeCardProps {
  recipe: Recipe | RecipePreviewDTO;
  mode: 'myRecipes' | 'favorites';
}

export const ProfileRecipeCard = ({ recipe, mode }: ProfileRecipeCardProps) => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!recipe.id) return;

    const confirmMessage =
      mode === 'myRecipes'
        ? 'Are you sure you want to delete this recipe?'
        : 'Are you sure you want to remove this recipe from favorites?';

    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      if (mode === 'myRecipes') {
        await dispatch(deleteMyRecipe(recipe.id)).unwrap();
        dispatch(fetchMyRecipes({ page: 1, limit: 10 }));
      } else {
        await dispatch(removeFavorite(recipe.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const imageUrl = 'thumb' in recipe ? recipe.thumb : recipe.image || '';
  const description = 'description' in recipe ? recipe.description : '';

  return (
    <div className="group flex items-center gap-3 border-b border-[#bfbebe] py-5 last:border-b-0 md:gap-4 md:py-6">
      {/* Зображення */}
      <Link
        to={`/recipe/${recipe.id}`}
        className="relative flex-shrink-0 overflow-hidden rounded-[15px]"
      >
        <img
          src={imageUrl || '/placeholder-recipe.jpg'}
          alt={recipe.title}
          className="h-[75px] w-[75px] rounded-[15px] object-cover transition-transform group-hover:scale-105 md:h-[85px] md:w-[85px]"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-recipe.jpg';
          }}
        />
      </Link>

      {/* Контент */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <Link
          to={`/recipe/${recipe.id}`}
          className="mb-1 block font-['Mulish'] text-base font-extrabold uppercase leading-tight tracking-[-0.02em] text-[#050505] transition-colors hover:opacity-70 md:mb-2 md:text-lg"
        >
          {recipe.title}
        </Link>

        {description && (
          <p className="line-clamp-2 text-xs leading-relaxed tracking-[-0.02em] text-[#1a1a1a] md:text-sm">
            {description}
          </p>
        )}
      </div>

      {/* Кнопки дій */}
      <div className="flex flex-shrink-0 items-center gap-2 md:gap-3">
        {/* Кнопка переходу */}
        <Link
          to={`/recipe/${recipe.id}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#bfbebe] bg-white transition-all hover:border-[#050505] hover:bg-[#050505] hover:text-white md:h-11 md:w-11"
          title="View recipe"
        >
          <svg
            className="h-4 w-4 md:h-5 md:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </Link>

        {/* Кнопка видалення */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#bfbebe] bg-white transition-all hover:border-[#e44848] hover:bg-[#e44848] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 md:h-11 md:w-11"
          title={
            mode === 'myRecipes' ? 'Delete recipe' : 'Remove from favorites'
          }
        >
          <svg
            className="h-4 w-4 md:h-5 md:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
