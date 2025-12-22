import { useEffect } from 'react';

import { CategoryItem } from '@/features/categories/category-item';
import { CategoryItemAll } from '@/features/categories/category-item-all';
import styles from '@/features/categories/category-list.module.css';
import { fetchCategories } from '@/redux/category.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Loader from '@/shared/ui/loader';

const CATEGORIES_AMOUNT = 11;

export const CategoryList = () => {
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <nav>
      <ul className={styles.list}>
        {loading ? (
          <li className="flex w-full justify-center">
            <Loader fullPage={false} />
          </li>
        ) : (
          categories.slice(0, CATEGORIES_AMOUNT).map((category) => (
            <li key={category.id}>
              <CategoryItem category={category.name ?? 'Unknown'} />
            </li>
          ))
        )}
        <li>
          <CategoryItemAll />
        </li>
      </ul>
    </nav>
  );
};
