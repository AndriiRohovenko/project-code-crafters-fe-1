import { useEffect, useState } from 'react';
import { useMemo } from 'react';

import {
  Area,
  Category,
  getAreas,
  getCategories,
  getIngredients,
  Ingredient,
} from '@/api/api.gen';
import {
  fetchCategoryDetails,
  selectCategoryDetailsLimit,
  selectCategoryDetailsPage,
} from '@/redux/categoryDetails/categoryDetails.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { BaseSelect, SelectOption } from '@/shared/ui/base-select';
import Container from '@/shared/ui/container';
import { MainTitle } from '@/shared/ui/main-title';

import { CategoryDetailsList } from './category-details-list';

type CategoryDetailsProps = {
  categoryName: string;
};

export const CategoryDetails = ({ categoryName }: CategoryDetailsProps) => {
  const dispatch = useAppDispatch();

  const page = useAppSelector(selectCategoryDetailsPage);
  const limit = useAppSelector(selectCategoryDetailsLimit);

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allAreas, setAllAreas] = useState<Area[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);

  const [areaOptions, setAreaOptions] = useState<SelectOption[]>([]);
  const [ingredientOptions, setIngredientOptions] = useState<SelectOption[]>(
    []
  );

  const [selectedArea, setSelectedArea] = useState<SelectOption | null>(null);
  const [selectedIngredient, setSelectedIngredient] =
    useState<SelectOption | null>(null);

  // Load options for selects
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categories, areas, ingredients] = await Promise.all([
          getCategories(),
          getAreas(),
          getIngredients(),
        ]);
        setAllCategories(categories);

        setAllAreas(areas);
        setAllIngredients(ingredients);

        setAreaOptions(
          areas
            .filter((a) => a.id && a.name)
            .map((a) => ({ value: String(a.id), label: a.name as string }))
        );

        setIngredientOptions(
          ingredients
            .filter((i) => i.id && i.name)
            .map((i) => ({ value: String(i.id), label: i.name as string }))
        );
      } catch (error) {
        console.error('Failed to load select options', error);
      }
    };

    void loadOptions();
  }, []);

  const selectedCategory = useMemo(() => {
    return allCategories.find(
      (c): c is Required<Pick<Category, 'id' | 'name'>> =>
        Boolean(c.id && c.name) &&
        c.name?.toLowerCase().replace(/\s+/g, '-') === categoryName
    );
  }, [allCategories, categoryName]);

  // Fetch category details when selects change
  useEffect(() => {
    if (!selectedArea && !selectedIngredient) return;

    dispatch(
      fetchCategoryDetails({
        categoryId: selectedCategory?.id ?? 0,
        areaId: selectedArea ? Number(selectedArea.value) : 0,
        ingredientId: selectedIngredient ? Number(selectedIngredient.value) : 0,
        page,
        limit,
      })
    );
  }, [
    selectedCategory?.id,
    dispatch,
    selectedArea,
    selectedIngredient,
    limit,
    page,
  ]);

  // Handle BaseSelect changes
  const handleAreaChange = (value: string) => {
    const area = allAreas.find((a) => String(a.id) === value);
    if (area)
      setSelectedArea({ value: String(area.id), label: String(area.name) });
  };

  const handleIngredientChange = (value: string) => {
    const ingredient = allIngredients.find((i) => String(i.id) === value);
    if (ingredient)
      setSelectedIngredient({
        value: String(ingredient.id),
        label: String(ingredient.name),
      });
  };
  if (!selectedCategory) return null;
  return (
    <Container>
      <MainTitle className="mb-16px md:mb-20px text-center">
        {selectedCategory.name}
      </MainTitle>
      <p>
        Go on a taste journey, where every sip is a sophisticated creative
        chord, and every dessert is an expression of the most refined
        gastronomic desires.
      </p>

      <div className="flex flex-col gap-8 2xl:flex-row 2xl:gap-10">
        <div className="flex flex-col gap-4 md:flex-row 2xl:w-[260px] 2xl:flex-col">
          <BaseSelect
            placeholder="Ingredients"
            options={ingredientOptions}
            value={selectedIngredient?.value}
            onChange={handleIngredientChange}
          />
          <BaseSelect
            placeholder="Area"
            options={areaOptions}
            value={selectedArea?.value}
            onChange={handleAreaChange}
          />
        </div>

        <div className="flex flex-col gap-8">
          <CategoryDetailsList />
        </div>
      </div>
    </Container>
  );
};
