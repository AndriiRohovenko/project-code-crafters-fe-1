import * as yup from 'yup';

export const addRecipeSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .max(100, 'Title must be at most 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .max(200, 'Description must be at most 200 characters'),
  category: yup.string().required('Category is required'),
  area: yup.string().required('Area is required'),
  time: yup
    .number()
    .typeError('Time must be a number')
    .required('Time is required')
    .min(1, 'Time must be at least 1 minute'),
  ingredients: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required('Ingredient name is required'),
        measure: yup.string().required('Quantity is required'),
      })
    )
    .min(1, 'Add at least one ingredient'),
  preparation: yup
    .string()
    .required('Recipe preparation is required')
    .max(1000, 'Preparation must be at most 1000 characters'),
});

export type AddRecipeFormData = yup.InferType<typeof addRecipeSchema>;
