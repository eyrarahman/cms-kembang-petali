import {
  mapProductRecipeFromDatabase,
  mapProductRecipeSummary,
} from "../mappers/recipe.mapper";

import {
  getProductRecipesFromDatabase,
  getRecipeByIdFromDatabase,
} from "../repositories/recipe.repository";

export async function getProductRecipeSummaries() {
  const recipes =
    await getProductRecipesFromDatabase();

  return recipes.map(
    mapProductRecipeSummary
  );
}

export async function getRecipeById(
  recipeId: string
) {
  const recipe =
    await getRecipeByIdFromDatabase(
      recipeId
    );

  if (!recipe) {
    return null;
  }

  return mapProductRecipeFromDatabase(
    recipe
  );
}