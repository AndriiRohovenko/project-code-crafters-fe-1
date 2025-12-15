import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CategoryItem } from '@/features/categories/category-item';
import { CategoryItemAll } from '@/features/categories/category-item-all';
import styles from '@/features/categories/category-list.module.css';
import { fetchCategories } from '@/redux/category.slice';
import { RootState } from '@/redux/store';

const CATEGORIES_AMOUNT = 11;

export const CategoryList = () => {
  const dispatch = useDispatch();
  const { items: categories, loading } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <nav>
      <ul className={styles.list}>
        {loading ? (
          <li>Loading...</li>
        ) : (
          categories.slice(0, CATEGORIES_AMOUNT).map((category) => (
            <li key={category.id}>
              <CategoryItem category={category.name} />
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
