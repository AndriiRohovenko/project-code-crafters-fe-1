import { useNavigate } from 'react-router-dom';

import { RecipeDetail } from '@/shared/types/recipe';

interface RecipeMainInfoProps {
  recipe: RecipeDetail;
}

const RecipeMainInfo = ({ recipe }: RecipeMainInfoProps) => {
  const { title, time, description, category, author } = recipe;
  const navigate = useNavigate();

  const handleAuthorClick = () => {
    if (author?.id) {
      navigate(`/profile/${author.id}`);
    }
  };

  return (
    <div>
      <h3 className="mb-3 font-['Mulish'] text-lg font-extrabold uppercase leading-[1.3] text-[var(--color-main)] md:text-2xl md:leading-[1.15]">
        {title}
      </h3>

      <div className="mb-5 flex flex-wrap gap-2">
        {category && (
          <span className="rounded-[30px] border border-[var(--color-placeholder)] px-[18px] py-2.5 text-sm font-medium leading-[18px] tracking-[-0.02em] text-[var(--color-placeholder)]">
            {category}
          </span>
        )}
        {time && (
          <span className="rounded-[30px] border border-[var(--color-placeholder)] px-[18px] py-2.5 text-sm font-medium leading-[18px] tracking-[-0.02em] text-[var(--color-placeholder)]">
            {`${time} min`}
          </span>
        )}
      </div>

      <p className="mb-6 text-sm leading-[1.4] tracking-[-0.02em] text-[var(--color-text)] md:text-base md:leading-[1.5]">
        {description}
      </p>

      <div className="mt-6">
        {author && (
          <button
            className="mb-8 flex cursor-pointer items-center gap-4 border-none bg-transparent p-0 outline-none md:mb-10"
            onClick={handleAuthorClick}
          >
            <img
              src={
                author?.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=200'
              }
              alt={`Avatar ${author?.name}`}
              className="h-8 w-8 shrink-0 rounded-full bg-[var(--color-placeholder)] object-cover md:h-10 md:w-10"
              onError={(e) => {
                e.currentTarget.src =
                  'https://www.gravatar.com/avatar/?d=mp&s=200';
              }}
            />
            <div className="flex flex-col items-start text-[var(--color-text)]">
              <span className="text-xs font-medium leading-[1.5] text-[var(--color-placeholder)] md:text-sm">
                Created by:
              </span>
              <p className="font-['Mulish'] text-sm font-bold leading-[1.4] md:text-base">
                {author?.name}
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeMainInfo;
