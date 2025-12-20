import { Recipe, User } from '@/api/api.gen';

export interface RecipeIngredient {
  id: number;
  name: string;
  img?: string;
  measure: string;
}

export interface RecipeDetail extends Recipe {
  // Backend may return a resolved category name alongside categoryId
  category?: string;
  author: User;
  ingredients?: RecipeIngredient[];
}
