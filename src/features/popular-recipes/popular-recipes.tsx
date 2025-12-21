import { useEffect, useState } from 'react';

import { getRecipesPopular, Recipe } from '@/api/api.gen';

export const PopularRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getRecipesPopular({ limit: 4 });
        setRecipes(data);
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : 'Something went wrong while loading popular recipes.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopular();
  }, []);

  console.log(recipes);

  return (
    <section className="max-w-[1280px]py-[64px] mx-auto md:py-[100px] 2xl:py-[120px]">
      <div className="mb-6 md:mb-8">
        <h2 className="font-sans text-[18px] font-extrabold uppercase leading-[28px] tracking-[-0.02em] md:text-[24px]">
          Popular recipes
        </h2>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 2xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="border-light-grey/40 h-[320px] rounded-2xl border bg-white p-4"
            >
              <div className="bg-black/5 h-full w-full animate-pulse rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="border-light-grey/40 rounded-2xl border bg-white p-6">
          <p className="text-sm text-black">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 2xl:grid-cols-4">
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              <h1>Hello world</h1>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularRecipes;
