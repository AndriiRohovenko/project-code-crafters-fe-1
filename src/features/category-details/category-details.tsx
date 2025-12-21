import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { Icon } from '@/shared/ui/icon';
import { MainTitle } from '@/shared/ui/main-title';

import { CategoryDetailsList } from './category-details-list';

type CategoryDetailsProps = {
  categoryName: string;
};

export const CategoryDetails = ({ categoryName }: CategoryDetailsProps) => {
  const navigate = useNavigate();
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

  // Fetch category details when category is selected or filters change
  useEffect(() => {
    if (!selectedCategory?.id) return;

    dispatch(
      fetchCategoryDetails({
        categoryId: selectedCategory.id,
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
      <button
        onClick={() => navigate(-1)}
        className="text-dark mb-4 flex items-center gap-2 pt-8 text-[14px] font-bold leading-[18px] transition-opacity hover:opacity-70 md:pt-[100px] 2xl:pt-[124px]"
      >
        <Icon name="icon-back" size={16} />
        BACK
      </button>
      <MainTitle className="mb-4">{selectedCategory.name}</MainTitle>
      <p className="text-dark/50 mb-10 md:mb-12">
        Go on a taste journey, where every sip is a sophisticated creative
        chord, and every dessert is an expression of the most refined
        gastronomic desires.
      </p>

      <div className="flex flex-col gap-10 2xl:flex-row 2xl:gap-10">
        <div className="flex flex-col gap-3 md:flex-row md:gap-4 2xl:w-[260px] 2xl:flex-col">
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

        <div className="flex-1">
          <CategoryDetailsList />
        </div>
      </div>
    </Container>
  );
};
