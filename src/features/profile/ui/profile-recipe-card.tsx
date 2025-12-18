import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { Recipe, RecipePreviewDTO } from '@/api/api.gen';
import { useAppDispatch } from '@/redux/hooks';
import { deleteMyRecipe, fetchMyRecipes } from '@/redux/profile.slice';
import { Icon } from '@/shared/ui/icon';
import { IconButton } from '@/shared/ui/icon-button';

interface ProfileRecipeCardProps {
  recipe: Recipe | RecipePreviewDTO;
  showActions?: boolean;
}

export const ProfileRecipeCard = ({
  recipe,
  showActions = false,
}: ProfileRecipeCardProps) => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!recipe.id) return;

    const confirmed = window.confirm(
      'Ви впевнені, що хочете видалити цей рецепт?'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteMyRecipe(recipe.id)).unwrap();
      // Оновлюємо список після видалення
      dispatch(fetchMyRecipes({ page: 1, limit: 10 }));
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      alert('Не вдалося видалити рецепт');
    } finally {
      setIsDeleting(false);
    }
  };

  const imageUrl = 'thumb' in recipe ? recipe.thumb : recipe.image || '';

  return (
    <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md md:gap-4 md:p-4">
      {/* Зображення */}
      <img
        src={imageUrl || '/placeholder-recipe.jpg'}
        alt={recipe.title}
        className="h-20 w-20 flex-shrink-0 rounded-lg object-cover md:h-24 md:w-24"
        onError={(e) => {
          e.currentTarget.src = '/placeholder-recipe.jpg';
        }}
      />

      {/* Інформація */}
      <div className="flex flex-1 flex-col">
        <Link
          to={`/recipe/${recipe.id}`}
          className="hover:text-primary mb-2 text-base font-bold uppercase md:text-lg"
        >
          {recipe.title}
        </Link>

        {'description' in recipe && recipe.description && (
          <p className="line-clamp-2 flex-1 text-xs text-gray-600 md:text-sm">
            {recipe.description}
          </p>
        )}
      </div>

      {/* Кнопки дій */}
      {showActions && (
        <div className="flex items-center gap-2">
          <IconButton
            icon={<Icon name="trash" size={18} />}
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-full p-2 hover:bg-red-50"
            title="Видалити"
          />
        </div>
      )}
    </div>
  );
};
