import { Link } from 'react-router-dom';

import { FavoriteButton } from '@/features/favorites/favorite-button';
import { Icon } from '@/shared/ui/icon';

interface RecipePreviewItemProps {
  id: number;
  preview: string | undefined;
  title: string | undefined;
  description: string | undefined;
  author: {
    id?: number;
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
  return (
    <article className="flex w-[290px] flex-shrink-0 flex-col">
      {/* IMAGE */}
      <div className="h-[290px] w-full overflow-hidden rounded-[30px]">
        <img src={preview} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* CONTENT */}
      <div className="mt-4 flex flex-col gap-2">
        <h3 className="line-clamp-1 font-sans text-[18px] font-extrabold uppercase leading-[24px] tracking-[-0.02em] text-black md:text-[20px]">
          {title}
        </h3>

        <p className="text-black/70 line-clamp-2 min-h-[40px] text-sm">
          {description}
        </p>
      </div>
      {/* AUTHOR */}
      <div className="mt-2 flex items-center justify-between">
        {/* LEFT */}
        {author?.id ? (
          <Link
            to={`/profile/${author.id}`}
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
          >
            <img
              src={
                author?.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=200'
              }
              alt={author.name}
              className="h-8 w-8 rounded-full object-cover md:h-10 md:w-10"
            />

            <span className="font-sans text-[14px] font-bold leading-[24px] tracking-[-0.02em] text-black md:text-[16px]">
              {author.name}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <img
              src={
                author?.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=200'
              }
              alt={author?.name}
              className="h-8 w-8 rounded-full object-cover md:h-10 md:w-10"
            />

            <span className="font-sans text-[14px] font-bold leading-[24px] tracking-[-0.02em] text-black md:text-[16px]">
              {author?.name}
            </span>
          </div>
        )}

        {/* RIGHT */}
        <div className="flex gap-2">
          <FavoriteButton
            recipeId={id}
            variant="icon"
            className="border-black/10 hover:bg-black/5 flex size-[45px] items-center justify-center rounded-[30px] border transition-colors"
          />
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
