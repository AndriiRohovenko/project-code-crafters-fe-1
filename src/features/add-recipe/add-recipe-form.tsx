import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { Controller, Resolver, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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
import { Icon } from '@/shared/ui/icon';

interface IngredientFormItem {
  id?: number;
  name: string;
  measure: string;
  img?: string;
}

export const AddRecipeForm = () => {
  const navigate = useNavigate();
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
      ingredients: [],
      preparation: '',
    },
  });

  const { title, description, category, area, time, ingredients, preparation } =
    useWatch({ control });

  // Only render non-empty ingredient items
  const activeIngredients = (ingredients || []).filter(
    (i) => !!i?.name && !!i?.measure
  );
  const hasIngredients = activeIngredients.length > 0;

  const isFormEmpty =
    !title &&
    !description &&
    !category &&
    !area &&
    !time &&
    (!ingredients || ingredients.length === 0) &&
    !preparation;

  const [isLoading, setIsLoading] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientMeasure, setNewIngredientMeasure] = useState('');

  // Image upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelectClick = () => {
    // Clear current selection before choosing a new one
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setImageFile(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    // Revoke old preview URL before replacing
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleClearForm = () => {
    reset({
      title: '',
      description: '',
      category: '',
      area: '',
      time: 10,
      ingredients: [],
      preparation: '',
    });
    setNewIngredientName('');
    setNewIngredientMeasure('');
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

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

      // Build multipart/form-data payload
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('categoryId', String(categoryId));
      formData.append('areaId', String(areaId));
      formData.append('instructions', data.preparation);
      if (data.description) formData.append('description', data.description);
      if (data.time) formData.append('time', String(data.time));
      if (ingredientsPayload.length) {
        formData.append('ingredients', JSON.stringify(ingredientsPayload));
      }
      // Attach image file if provided
      if (imageFile) {
        // Field name may vary on backend; using 'thumb' by default
        formData.append('thumb', imageFile);
      }

      const response = await createRecipes(formData);

      console.log('Recipe created successfully');

      // Extract recipe ID from response and redirect
      const recipeId = response.data?.recipe?.id;
      if (recipeId) {
        // Reset form and redirect to recipe detail page
        reset({
          title: '',
          description: '',
          category: '',
          area: '',
          time: 10,
          ingredients: [],
          preparation: '',
        });
        setNewIngredientName('');
        setNewIngredientMeasure('');
        setImageFile(null);
        setImagePreview(null);
        navigate(`/recipe/${recipeId}`);
      } else {
        throw new Error('Recipe created but ID not returned');
      }
    } catch (error) {
      console.error('Add recipe error:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to add recipe. Please try again.';
      window.alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] md:items-start md:gap-14"
    >
      {/* Left column – image upload */}
      <div>
        <div className="flex h-[260px] w-full items-center justify-center rounded-[40px] border border-dashed border-light-grey bg-white md:h-[300px]">
          <div className="text-black/70 flex flex-col items-center justify-center text-center text-sm">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Recipe preview"
                className="w-full rounded-3xl md:h-[300px]"
              />
            ) : (
              <button
                type="button"
                onClick={handleImageSelectClick}
                className="text-black/70 flex flex-col items-center justify-center text-center text-sm"
              >
                <Icon name="camera" size={49} className="mb-2" />
                <span>Upload a photo</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        {imagePreview && (
          <button
            type="button"
            onClick={handleImageSelectClick}
            className="mt-3 text-center text-sm font-medium text-black underline transition hover:opacity-80"
          >
            Upload another photo
          </button>
        )}
      </div>

      {/* Right column – form fields */}
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <BaseInput
            label="The name of the recipe"
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
          <div className="space-y-2">
            <label className="block text-sm font-bold uppercase text-black">
              Category
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field: { value, onChange } }) => (
                <BaseSelect
                  placeholder="Select a category"
                  required
                  options={categoryOptions}
                  value={value}
                  onChange={onChange}
                  error={errors.category?.message}
                />
              )}
            />
          </div>

          <div className="flex flex-col items-start">
            <label className="block text-sm font-bold uppercase text-black">
              Cooking time
            </label>
            <div className="flex gap-3 rounded-full bg-white px-6 py-3 text-sm text-black">
              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleTimeChange(-5)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-light-grey text-xl leading-none text-black transition hover:border-black"
                >
                  -
                </button>
                <span className="min-w-[48px] text-center">
                  {time || 0} min
                </span>
                <button
                  type="button"
                  onClick={() => handleTimeChange(5)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-light-grey text-xl leading-none text-black transition hover:border-black"
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
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold uppercase text-black">
              Area
            </label>
            <Controller
              name="area"
              control={control}
              render={({ field: { value, onChange } }) => (
                <BaseSelect
                  placeholder="Area"
                  required
                  options={areaOptions}
                  value={value}
                  onChange={onChange}
                  error={errors.area?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase text-black">
            Ingredients
          </h3>

          <div className="space-y-3">
            {/* Input row for adding new ingredient */}
            <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <BaseSelect
                placeholder="Add the ingredient"
                options={allIngredients
                  .filter((ing) => ing.name)
                  .map((ing) => ({
                    value: ing.name as string,
                    label: ing.name as string,
                  }))}
                value={newIngredientName}
                onChange={(value) => setNewIngredientName(value)}
              />

              <BaseInput
                placeholder="Quantity"
                value={newIngredientMeasure}
                onChange={(e) => setNewIngredientMeasure(e.target.value)}
              />
            </div>

            <Button
              type="button"
              variant="outline-grey"
              label="ADD INGREDIENT +"
              className="w-full md:w-auto"
              onClick={() => {
                if (!newIngredientName || !newIngredientMeasure) return;

                const selectedIngredient = allIngredients.find(
                  (ing) => ing.name === newIngredientName
                );

                if (selectedIngredient) {
                  const newItem: IngredientFormItem = {
                    id: selectedIngredient.id,
                    name: newIngredientName,
                    measure: newIngredientMeasure,
                    img: selectedIngredient.img,
                  };

                  const next = [
                    ...(ingredients || []),
                    newItem,
                  ] as IngredientFormItem[];
                  handleIngredientsChange(next);

                  // Reset input fields
                  setNewIngredientName('');
                  setNewIngredientMeasure('');
                }
              }}
            />

            {/* List of added ingredients */}
            {hasIngredients && (
              <div className="flex flex-wrap gap-3">
                {activeIngredients.map((item, index) => {
                  const ingredientItem = item as IngredientFormItem;
                  return (
                    <div
                      key={index}
                      className="relative flex items-center gap-3"
                    >
                      {ingredientItem.img && (
                        <div className="flex-shrink-0 rounded-xl border border-light-grey p-4">
                          <img
                            src={ingredientItem.img}
                            alt={ingredientItem.name}
                            className="h-8 w-8 object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-black">
                          {ingredientItem.name}
                        </p>
                        <p className="text-black/70 text-xs">
                          {ingredientItem.measure}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = (ingredients || []).filter(
                            (_, i) => i !== index
                          ) as IngredientFormItem[];
                          handleIngredientsChange(next);
                        }}
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-black transition hover:opacity-70"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {typeof errors.ingredients?.message === 'string' && (
              <p className="mt-1 px-4 text-sm text-red-500">
                {errors.ingredients.message}
              </p>
            )}
          </div>
        </div>

        {/* Preparation */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase text-black">
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
          <button
            type="button"
            onClick={handleClearForm}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-light-grey bg-white text-black transition hover:border-black"
            title="Clear form"
          >
            <Icon name="trash" size={20} />
          </button>
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
