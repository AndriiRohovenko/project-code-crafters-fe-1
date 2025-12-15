import { RecipeDetail } from '@/shared/types/recipe';
import Message from '@/shared/ui/message';

import RecipeIngredients from './recipe-ingredients';
import RecipeMainInfo from './recipe-main-info';
import RecipePreparation from './recipe-preparation';

interface RecipeInfoProps {
  recipe: RecipeDetail | null;
}

const RecipeInfo = ({ recipe }: RecipeInfoProps) => {
  if (!recipe) {
    return <Message>Recipe not found.</Message>;
  }

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-8 2xl:flex-row 2xl:gap-10">
        <div className="w-full shrink-0 2xl:w-[550px]">
          <div className="h-[318px] w-full overflow-hidden rounded-[30px] md:h-[400px]">
            <img
              src={recipe.thumb}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="w-full">
          <RecipeMainInfo recipe={recipe} />
          <RecipeIngredients ingredients={recipe.ingredients} />
          <RecipePreparation recipe={recipe} />
        </div>
      </div>
    </>
  );
};

export default RecipeInfo;
