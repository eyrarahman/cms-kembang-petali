import {
    mapProductRecipeFromDatabase,
    mapProductRecipeSummary,
  } from "../mappers/recipe.mapper";
  
  import {
    getProductRecipesFromDatabase,
    getRecipeByProductIdFromDatabase,
  } from "../repositories/recipe.repository";

export async function getProductRecipeSummaries() {
  const products =
    await getProductRecipesFromDatabase();

  return products.map(
    mapProductRecipeSummary
  );
}

export async function getRecipeByProductId(
    productId: string
  ) {
    const recipe =
      await getRecipeByProductIdFromDatabase(
        productId
      );
  
    if (!recipe) {
      return null;
    }
  
    return mapProductRecipeFromDatabase(
      recipe
    );
  }