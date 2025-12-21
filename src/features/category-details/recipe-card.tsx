import { Link } from 'react-router-dom';

import {
  addFavorite,
  removeFavorite,
  selectIsFavorite,
} from '@/redux/favorites.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Icon } from '@/shared/ui/icon';

interface RecipePreviewItemProps {
  id: number;
  preview: string | undefined;
  title: string | undefined;
  description: string | undefined;
  author: {
    name: string | undefined;
    avatar: string | undefined;
  };
}

export const RecipeCard = ({
  id,
  preview,
  title,
  description,
  author,
}: RecipePreviewItemProps) => {
  const dispatch = useAppDispatch();

  const isFavorite = useAppSelector(selectIsFavorite(id));

  const handleFavoriteClick = () => {
    if (!id) return;
    if (isFavorite) {
      dispatch(removeFavorite(id));
    } else {
      dispatch(addFavorite(id));
    }
  };
  return (
    <article className="flex w-[290px] flex-shrink-0 flex-col">
      {/* IMAGE */}
      <div className="h-[290px] w-full overflow-hidden rounded-[30px]">
        <img src={preview} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* CONTENT */}
      <div className="mt-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <p className="text-black/70 text-sm">{description}</p>
      </div>

      {/* AUTHOR */}
      <div className="mt-4 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {author.avatar && (
            <img
              src={author.avatar}
              alt={author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
          <span className="text-sm font-medium text-black">{author.name}</span>
        </div>

        {/* RIGHT */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label="Add to favorites"
            className="border-black/10 hover:bg-black/5 flex size-[45px] items-center justify-center rounded-[30px] border transition-colors"
          >
            <Icon
              size={18}
              name="heart"
              className={isFavorite ? 'fill-red-500 text-red-500' : ''}
            />
          </button>
          <Link
            to={`/recipe/${id}`}
            aria-label="Open recipe"
            className="border-black/10 hover:bg-black/5 flex size-[45px] items-center justify-center rounded-[30px] border transition-colors"
          >
            <Icon size={18} name="arrow-up-right" />
          </Link>
        </div>
      </div>
    </article>
  );
};
