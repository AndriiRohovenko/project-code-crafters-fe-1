import { FavoriteButton } from '@/features/favorites/favorite-button';
import { RecipeDetail } from '@/shared/types/recipe';

interface RecipePreparationProps {
  recipe: RecipeDetail;
}

const RecipePreparation = ({ recipe }: RecipePreparationProps) => {
  const paragraphs =
    recipe.instructions
      ?.split(/\r?\n\s*\r?\n/)
      .filter((p) => p.trim() !== '') || [];

  return (
    <div className="flex w-full flex-col gap-5 p-0 md:mt-8 2xl:mt-10">
      <h3 className="font-['Mulish'] text-lg font-extrabold uppercase leading-[1.33] text-[var(--color-main)] md:text-xl md:leading-[1.2]">
        RECIPE PREPARATION
      </h3>
      {paragraphs.map((text, idx) => (
        <p
          key={idx}
          className="text-sm leading-[1.4] tracking-[-0.02em] text-[var(--color-text)] md:text-base md:leading-[1.5]"
        >
          {text}
        </p>
      ))}

      <div className="mt-3 md:mt-5">
        <FavoriteButton recipeId={recipe.id!} className="w-auto self-start" />
      </div>
    </div>
  );
};

export default RecipePreparation;
