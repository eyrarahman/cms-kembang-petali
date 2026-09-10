import {
  getCategoriesFromDatabase,
  getCategoryByIdFromDatabase,
  getCategoryBySlugFromDatabase,
} from "../repositories/category.repository";

import { Category } from "../types/category.types";

export async function getCategories(): Promise<Category[]> {
  const categories = await getCategoriesFromDatabase();

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    type: category.type as Category["type"],
  }));
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const category =
    await getCategoryBySlugFromDatabase(slug);

  if (!category) {
    return null;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    type: category.type as Category["type"],
  };
}
export async function getCategoryById(
  categoryId: string
): Promise<Category | null> {
  const category =
    await getCategoryByIdFromDatabase(
      categoryId
    );

  if (!category) {
    return null;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    type: category.type as Category["type"],
  };
}