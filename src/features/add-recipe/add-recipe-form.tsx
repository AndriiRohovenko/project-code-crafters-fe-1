import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, Resolver, useForm, useWatch } from 'react-hook-form';

import {
  Area,
  Category,
  createRecipes,
  getAreas,
  getCategories,
  getIngredients,
  Ingredient,
} from '@/api/api.gen';
import {
  AddRecipeFormData,
  addRecipeSchema,
} from '@/features/add-recipe/add-recipe-validation';
import { BaseInput } from '@/shared/ui/base-input';
import { BaseSelect } from '@/shared/ui/base-select';
import { Button } from '@/shared/ui/button';

interface IngredientFormItem {
  name: string;
  measure: string;
}

export const AddRecipeForm = () => {
  const resolver: Resolver<AddRecipeFormData> = yupResolver(
    addRecipeSchema
  ) as unknown as Resolver<AddRecipeFormData>;

  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [areaOptions, setAreaOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allAreas, setAllAreas] = useState<Area[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);

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

        setCategoryOptions(
          categories
            .filter((c) => c.id && c.name)
            .map((c) => ({
              value: String(c.id),
              label: c.name as string,
            }))
        );

        setAreaOptions(
          areas
            .filter((a) => a.id && a.name)
            .map((a) => ({
              value: String(a.id),
              label: a.name as string,
            }))
        );
      } catch (error) {
        console.error('Failed to load select options', error);
      }
    };

    void loadOptions();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddRecipeFormData>({
    mode: 'onSubmit',
    resolver,
    defaultValues: {
      title: '',
      description: '',
      category: '',
      area: '',
      time: 10,
      ingredients: [{ name: '', measure: '' }],
      preparation: '',
    },
  });

  const { title, description, category, area, time, ingredients, preparation } =
    useWatch({ control });

  const isFormEmpty =
    !title &&
    !description &&
    !category &&
    !area &&
    !time &&
    (!ingredients || ingredients.length === 0) &&
    !preparation;

  const [isLoading, setIsLoading] = useState(false);

  const handleTimeChange = (delta: number) => {
    const newTime = Math.max(1, (Number(time) || 0) + delta);
    setValue('time', newTime, { shouldValidate: true });
  };

  const handleIngredientsChange = (items: IngredientFormItem[]) => {
    setValue('ingredients', items, { shouldValidate: true });
  };

  const getCategoryId = (categoryValue: string): number | null => {
    const category = allCategories.find(
      (c) => c.id && String(c.id) === categoryValue
    );
    return category?.id ?? null;
  };

  const getAreaId = (areaValue: string): number | null => {
    const area = allAreas.find((a) => a.id && String(a.id) === areaValue);
    return area?.id ?? null;
  };

  const getIngredientIds = (
    ingredients: IngredientFormItem[]
  ): Array<{ ingredientId: number; measure: string }> => {
    return (
      ingredients
        ?.map((item) => {
          const matched = allIngredients.find((ing) => {
            return (
              ing.name?.toLowerCase().trim() === item.name.toLowerCase().trim()
            );
          });

          if (!matched?.id) {
            return undefined;
          }

          return { ingredientId: matched.id, measure: item.measure };
        })
        .filter(
          (
            value
          ): value is {
            ingredientId: number;
            measure: string;
          } => value !== undefined
        ) ?? []
    );
  };

  const onSubmit = async (data: AddRecipeFormData) => {
    setIsLoading(true);
    try {
      const categoryId = getCategoryId(data.category);
      const areaId = getAreaId(data.area);
      const ingredientsPayload = getIngredientIds(data.ingredients ?? []);

      if (!categoryId) {
        throw new Error('Invalid category selected');
      }

      if (!areaId) {
        throw new Error('Invalid area selected');
      }

      const payload = {
        title: data.title,
        categoryId,
        areaId,
        instructions: data.preparation,
        description: data.description,
        time: String(data.time),
        ingredients: ingredientsPayload.length ? ingredientsPayload : undefined,
      };

      await createRecipes(payload);

      console.log('Recipe created successfully');

      reset({
        title: '',
        description: '',
        category: '',
        area: '',
        time: 10,
        ingredients: [{ name: '', measure: '' }],
        preparation: '',
      });
    } catch (error) {
      console.error('Add recipe error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] md:items-start md:gap-14"
    >
      {/* Left column – image upload placeholder */}
      <div>
        <div className="flex h-[260px] w-full items-center justify-center rounded-[40px] border border-dashed border-light-grey bg-white md:h-[340px]">
          <button
            type="button"
            className="text-black/70 flex flex-col items-center justify-center text-center text-sm"
          >
            <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full border border-light-grey text-2xl">
              +
            </span>
            <span>Upload a photo</span>
          </button>
        </div>
      </div>

      {/* Right column – form fields */}
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <BaseInput
            label="The name of the recipe"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <div>
            <textarea
              className={`placeholder:text-black/70 h-[96px] w-full resize-none rounded-3xl border bg-white px-6 py-3 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black ${
                errors.description
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-light-grey'
              }`}
              placeholder="Enter a description of the dish"
              maxLength={200}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 px-4 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            name="category"
            control={control}
            render={({ field: { value, onChange } }) => (
              <BaseSelect
                label="Category"
                required
                options={categoryOptions}
                value={value}
                onChange={onChange}
                error={errors.category?.message}
              />
            )}
          />

          <div className="flex items-center gap-3 rounded-full border border-light-grey bg-white px-6 py-3 text-sm text-black">
            <span className="text-black/70">Cooking time</span>
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleTimeChange(-5)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-light-grey text-xl leading-none text-black transition hover:border-black"
              >
                -
              </button>
              <span className="min-w-[48px] text-center">{time || 0} min</span>
              <button
                type="button"
                onClick={() => handleTimeChange(5)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-light-grey text-xl leading-none text-black transition hover:border-black"
              >
                +
              </button>
            </div>
          </div>
          {errors.time && (
            <p className="mt-1 px-4 text-sm text-red-500">
              {errors.time.message}
            </p>
          )}

          <Controller
            name="area"
            control={control}
            render={({ field: { value, onChange } }) => (
              <BaseSelect
                label="Area"
                required
                options={areaOptions}
                value={value}
                onChange={onChange}
                error={errors.area?.message}
              />
            )}
          />
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold uppercase">Ingredients</h3>

          <div className="space-y-3">
            {ingredients?.map((item, index) => (
              <div
                key={index}
                className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_auto]"
              >
                <BaseSelect
                  label="Add the ingredient"
                  required
                  options={allIngredients
                    .filter((ing) => ing.name)
                    .map((ing) => ({
                      value: ing.name as string,
                      label: ing.name as string,
                    }))}
                  value={item?.name}
                  onChange={(value) => {
                    const next = [
                      ...(ingredients || []),
                    ] as IngredientFormItem[];
                    next[index] = {
                      ...next[index],
                      name: value,
                    };
                    handleIngredientsChange(next);
                  }}
                  error={
                    Array.isArray(errors.ingredients) &&
                    errors.ingredients[index]?.name?.message
                  }
                />

                <BaseInput
                  placeholder="Enter quantity"
                  value={item?.measure}
                  onChange={(e) => {
                    const next = [
                      ...(ingredients || []),
                    ] as IngredientFormItem[];
                    next[index] = {
                      ...next[index],
                      measure: e.target.value,
                    };
                    handleIngredientsChange(next);
                  }}
                  error={
                    Array.isArray(errors.ingredients) &&
                    errors.ingredients[index]?.measure?.message
                  }
                />

                <button
                  type="button"
                  onClick={() => {
                    const next = (ingredients || []).filter(
                      (_, i) => i !== index
                    ) as IngredientFormItem[];
                    handleIngredientsChange(
                      next.length ? next : [{ name: '', measure: '' }]
                    );
                  }}
                  className="mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-light-grey text-black transition hover:border-black"
                >
                  ×
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline-grey"
              label="Add ingredient"
              className="w-full md:w-auto"
              onClick={() => {
                const next = [...(ingredients || [])] as IngredientFormItem[];
                next.push({ name: '', measure: '' });
                handleIngredientsChange(next);
              }}
            />

            {typeof errors.ingredients?.message === 'string' && (
              <p className="mt-1 px-4 text-sm text-red-500">
                {errors.ingredients.message}
              </p>
            )}
          </div>
        </div>

        {/* Preparation */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold uppercase">
            Recipe preparation
          </h3>
          <div>
            <textarea
              className={`placeholder:text-black/70 h-[180px] w-full resize-none rounded-3xl border bg-white px-6 py-3 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black ${
                errors.preparation
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-light-grey'
              }`}
              placeholder="Enter recipe"
              maxLength={1000}
              {...register('preparation')}
            />
            {errors.preparation && (
              <p className="mt-1 px-4 text-sm text-red-500">
                {errors.preparation.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Button
            type="submit"
            label={isLoading ? 'Publishing...' : 'Publish'}
            disabled={isFormEmpty || isLoading}
            className="px-10"
          />
        </div>
      </div>
    </form>
  );
};
