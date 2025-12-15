import { RecipeIngredient } from '@/shared/types/recipe';

interface RecipeIngredientsProps {
  ingredients?: RecipeIngredient[];
}

const RecipeIngredients = ({ ingredients = [] }: RecipeIngredientsProps) => {
  if (!ingredients.length) {
    return null;
  }

  return (
    <section className="mb-8">
      <h3 className="mb-5 font-['Mulish'] text-lg font-extrabold uppercase leading-[1.33] text-[var(--color-main)] md:text-xl md:leading-[1.2]">
        Ingredients:
      </h3>
      <ul className="flex w-full flex-wrap gap-4 md:gap-5">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient.id || ingredient.name}
            className="flex w-full max-w-[152px] shrink-0 flex-row items-center gap-2.5 md:max-w-[178px] md:gap-3.5"
          >
            <img
              src={ingredient.img || '/images/default-ingredient.png'}
              alt={ingredient.name}
              className="h-[75px] w-[75px] rounded-[15px] border border-[var(--color-secondary)] p-2.5 md:h-[90px] md:w-[90px] md:p-[15px]"
            />
            <div>
              <p className="font-medium leading-5 tracking-[-0.28px] text-[var(--color-main)]">
                {ingredient.name}
              </p>
              <p className="font-medium leading-5 tracking-[-0.28px] text-[var(--color-secondary)]">
                {ingredient.measure}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecipeIngredients;
