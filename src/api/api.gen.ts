/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from Swagger/OpenAPI specification
 *
 * To regenerate, run: npm run generate:api
 */

import { apiClient } from './bootstrap-fetch-client';

// =============================================================================
// Types
// =============================================================================

export interface User {
  /** Унікальний ідентифікатор користувача */
  id?: number;
  /** Ім'я користувача */
  name?: string;
  /** Email користувача */
  email?: string;
  /** URL аватара користувача */
  avatar?: string;
  /** Дата створення */
  createdAt?: string;
  /** Дата оновлення */
  updatedAt?: string;
}

export interface Recipe {
  /** Унікальний ідентифікатор рецепта */
  id?: number;
  /** Назва рецепта */
  title?: string;
  /** ID категорії рецепта */
  categoryId?: number;
  /** ID регіону кухні */
  areaId?: number;
  image: string;
  /** Інструкції приготування */
  instructions?: string;
  /** Опис рецепта */
  description?: string;
  /** URL зображення рецепта */
  thumb?: string;
  /** URL превью зображення */
  preview?: string;
  /** Час приготування */
  time?: string;
  /** Посилання на YouTube відео */
  youtube?: string;
  /** Теги рецепта */
  tags?: string[];
  author?: Author;
  createdAt?: string;
  updatedAt?: string;
}

export interface Author {
  /** ID автора */
  id?: number;
  /** Ім'я автора */
  name?: string;
  /** URL аватара */
  avatar?: string;
}

export interface Category {
  /** Унікальний ідентифікатор категорії */
  id?: number;
  /** Назва категорії */
  name?: string;
  /** URL зображення категорії */
  thumb?: string;
}

export interface Ingredient {
  /** Унікальний ідентифікатор інгредієнта */
  id?: number;
  /** Назва інгредієнта */
  name?: string;
  /** Опис інгредієнта */
  desc?: string;
  /** URL зображення інгредієнта */
  img?: string;
}

export interface Area {
  /** Унікальний ідентифікатор регіону */
  id?: number;
  /** Назва регіону кухні */
  name?: string;
}

export interface Testimonial {
  /** Унікальний ідентифікатор відгука */
  id?: number;
  /** Ім'я автора відгука */
  owner?: string;
  /** Текст відгука */
  comment?: string;
}

export interface RegisterRequest {
  /** Ім'я користувача (від 2 до 50 символів) */
  name: string;
  /** Email користувача */
  email: string;
  /** Пароль (від 6 до 32 символів) */
  password: string;
}

export interface LoginRequest {
  /** Email користувача */
  email: string;
  /** Пароль користувача */
  password: string;
}

export interface AuthResponse {
  /** JWT токен для авторизації */
  token?: string;
  user?: User;
}

export interface Error {
  /** Повідомлення про помилку */
  message?: string;
}

export interface FollowRequest {
  /** ID користувача для підписки */
  followingId: number;
}

export interface RecipePreviewDTO {
  /** ID рецепта (превʼю) */
  id: number;
  /** Назва рецепта (превʼю) */
  title: string;
  /** URL thumb (превʼю) */
  image: string | null;
}

export interface FollowUserDTO extends User {
  /** Кількість рецептів користувача */
  recipesCount: number;
  /** Превʼю рецептів (до 4) */
  recipesPreview: RecipePreviewDTO[];
}

export interface FollowerUserDTO extends FollowUserDTO {
  /** Чи підписаний поточний користувач на цього юзера */
  isFollowing: boolean;
}

export interface PaginationQuery {
  /** Номер сторінки */
  page?: number;
  /** Кількість елементів на сторінці */
  limit?: number;
}

export interface PaginatedFollowingResponse {
  data: FollowUserDTO[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginatedFollowersResponse {
  data: FollowerUserDTO[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginatedFavoritesResponse {
  data: Recipe[];
  meta: PaginationMeta;
}

// Additional types
export interface RecipeIngredient {
  id: number;
  measure: string;
}

export interface CreateRecipeData {
  title: string;
  category: string;
  area?: string;
  instructions: string;
  description?: string;
  time?: string;
  ingredients?: RecipeIngredient[];
}

// =============================================================================
// API Functions
// =============================================================================

// --- Areas ---

/**
 * Отримати список всіх регіонів кухонь
 */
export const getAreas = async (): Promise<Area[]> => {
  const response = await apiClient.get('/areas');
  return response.data;
};

// --- Authentication ---

/**
 * Реєстрація нового користувача
 */
export const createAuthRegister = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

/**
 * Вхід користувача в систему
 */
export const createAuthLogin = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

/**
 * Вихід користувача з системи
 */
export const createAuthLogout = async (): Promise<void> => {
  const response = await apiClient.post('/auth/logout', {});
  return response.data;
};

// --- Categories ---

/**
 * Отримати список всіх категорій рецептів
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data;
};

// --- Favorites ---

/**
 * Get a paginated list of the current user's favorite recipes
 */
export const getFavorites = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedFavoritesResponse> => {
  const response = await apiClient.get('/favorites', { params });
  return response.data;
};

/**
 * Add a recipe to favorites
 */
export const createFavoritesByrecipeId = async (
  recipeId: number
): Promise<Recipe> => {
  const response = await apiClient.post(`/favorites/${recipeId}`, {});
  return response.data;
};

/**
 * Remove a recipe from favorites
 */
export const deleteFavoritesByrecipeId = async (
  recipeId: number
): Promise<void> => {
  const response = await apiClient.delete(`/favorites/${recipeId}`);
  return response.data;
};

// --- Ingredients ---

/**
 * Отримати список всіх інгредієнтів
 */
export const getIngredients = async (): Promise<Ingredient[]> => {
  const response = await apiClient.get('/ingredients');
  return response.data;
};

// --- Recipes ---

/**
 * Пошук рецептів за запитом
 */
export const getRecipesSearch = async (params?: {
  query?: string;
  ingredientId?: number;
  categoryId?: number;
  areaId?: number;
  page?: number;
  limit?: number;
}): Promise<Recipe[]> => {
  const response = await apiClient.get('/recipes/search', { params });
  return response.data;
};

/**
 * Отримати популярні рецепти
 */
export const getRecipesPopular = async (params?: {
  limit?: number;
}): Promise<Recipe[]> => {
  const response = await apiClient.get('/recipes/popular', { params });
  return response.data;
};

/**
 * Отримати власні рецепти користувача
 */
export const getRecipesMyRecipes = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  recipes?: Recipe[];
  total?: number;
  page?: number;
  totalPages?: number;
}> => {
  const response = await apiClient.get('/recipes/my-recipes', { params });
  return response.data;
};

/**
 * Отримати рецепт по ID
 */
export const getRecipesByid = async (id: number): Promise<Recipe> => {
  const response = await apiClient.get(`/recipes/${id}`);
  return response.data;
};

/**
 * Видалити власний рецепт
 */
export const deleteRecipesByid = async (id: number): Promise<void> => {
  const response = await apiClient.delete(`/recipes/${id}`);
  return response.data;
};

/**
 * Створити новий рецепт
 */
export const createRecipes = async (
  data: FormData
): Promise<{
  status?: string;
  data?: {
    recipe?: Recipe;
  };
}> => {
  const response = await apiClient.post('/recipes', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// --- Testimonials ---

/**
 * Отримати список всіх відгуків
 */
export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await apiClient.get('/testimonials');
  return response.data;
};

// --- Users ---

/**
 * Отримати список всіх користувачів
 */
export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{
  users?: User[];
  page?: number;
  limit?: number;
  total?: number;
}> => {
  const response = await apiClient.get('/users', { params });
  return response.data;
};

/**
 * Отримати дані поточного авторизованого користувача
 */
export const getUsersCurrent = async (): Promise<User> => {
  const response = await apiClient.get('/users/current');
  return response.data;
};

/**
 * Отримати список підписок авторизованого користувача
 */
export const getUsersCurrentFollowing = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedFollowingResponse> => {
  const response = await apiClient.get('/users/current/following', { params });
  return response.data;
};

/**
 * Підписатися на користувача
 */
export const createUsersFollow = async (
  data: FollowRequest
): Promise<{
  message?: string;
}> => {
  const response = await apiClient.post('/users/follow', data);
  return response.data;
};

/**
 * Відписатися від користувача
 */
export const deleteUsersUnfollow = async (
  data: FollowRequest
): Promise<{
  message?: string;
}> => {
  const response = await apiClient.delete('/users/unfollow', { data });
  return response.data;
};

/**
 * Upload user avatar
 */
export const updateUsersAvatar = async (data: FormData): Promise<User> => {
  const response = await apiClient.put('/users/avatar', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Отримати користувача по ID
 */
export const getUsersByid = async (id: number): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

/**
 * Отримати список підписників користувача
 */
export const getUsersByidFollowers = async (
  id: number,
  params?: {
    page?: number;
    limit?: number;
  }
): Promise<PaginatedFollowersResponse> => {
  const response = await apiClient.get(`/users/${id}/followers`, { params });
  return response.data;
};
