import { Recipe, User } from '@/api/api.gen';

export interface RecipeIngredient {
  id: number;
  name: string;
  img?: string;
  measure: string;
}

export interface RecipeDetail extends Recipe {
  owner?: User;
  ingredients?: RecipeIngredient[];
}
