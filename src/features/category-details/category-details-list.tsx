import { RecipeCard } from '@/features/category-details/recipe-card';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

export const CategoryDetailsList = () => {

  const { items: recipes, loading } = useAppSelector(
    (state: RootState) => state.categoryDetails
  );

  console.log(`recipes: ${JSON.stringify(recipes)}`);

  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {loading ? (
        <li>Loading...</li>
      ) : Array.isArray(recipes) && recipes.length > 0 ? (
        recipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard
              preview={recipe.thumb}
              title={recipe.title}
              description={recipe.description}
              author={{
                name: recipe.author?.name,
                avatar: recipe.author?.avatar,
              }}
            />
          </li>
        ))
      ) : (
        <li>Hello</li>
      )}
    </ul>
  );
};
