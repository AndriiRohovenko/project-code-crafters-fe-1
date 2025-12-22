import { RecipeCard } from '@/features/category-details/recipe-card';
import { setCategoryDetailsPage } from '@/redux/categoryDetails/categoryDetails.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Loader from '@/shared/ui/loader';
import { Pagination } from '@/shared/ui/pagination/pagination';

export const CategoryDetailsList = () => {
  const dispatch = useAppDispatch();

  const {
    items: recipes,
    loading,
    itemsMeta: meta,
  } = useAppSelector((state: RootState) => state.categoryDetails);

  const onPageChange = (nextPage: number) => {
    dispatch(setCategoryDetailsPage(nextPage));
  };
  return (
    <div>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {loading ? (
          <li className="col-span-full">
            <Loader fullPage={false} />
          </li>
        ) : Array.isArray(recipes) && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <li key={recipe.id}>
              <RecipeCard
                id={recipe.id || 0}
                preview={recipe.thumb}
                title={recipe.title}
                description={recipe.description}
                author={{
                  name: recipe.author?.name,
                  avatar: recipe.author?.avatar,
                  id: recipe.author?.id,
                }}
              />
            </li>
          ))
        ) : (
          <li>Recipes list is empty</li>
        )}
      </ul>
      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
