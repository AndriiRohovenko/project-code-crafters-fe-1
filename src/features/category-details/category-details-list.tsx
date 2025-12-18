import { useEffect } from 'react';

import styles from '@/features/categories/category-list.module.css';
import { RecipeCard } from '@/features/category-details/recipe-card';
import { fetchCategoryDetails } from '@/redux/categoryDetails/categoryDetails.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

export const CategoryDetailsList = () => {
  const dispatch = useAppDispatch();

  const { items: recipes, loading } = useAppSelector(
    (state: RootState) => state.categoryDetails
  );

  console.log(`recipes: ${JSON.stringify(recipes)}`);

  useEffect(() => {
    dispatch(
      fetchCategoryDetails({
        query: '',
        categoryId: 1,
        areaId: 1,
        page: 1,
        limit: 12,
      })
    );
  }, [dispatch]);

  return (
    <ul className={styles.list}>
      {loading ? (
        <li>Loading...</li>
      ) : Array.isArray(recipes) && recipes.length > 0 ? (
        recipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard
              preview={recipe.preview}
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
