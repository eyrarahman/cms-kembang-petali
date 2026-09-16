import {
  createRecipeInDatabase,
  updateRecipeInDatabase,
  linkRecipeToProductInDatabase,
  downloadRecipeReferenceImage,
} from "../repositories/recipe-admin.repository";

import { RecipeFormData } from "../types/recipe-form.types";
import {
  createProduct,
  deleteProduct,
} from "@/features/products/services/product-admin.service";


function validateRecipeForm(
  formData: RecipeFormData
) {
  if (!formData.name.trim()) {
    throw new Error(
      "Recipe name is required."
    );
  }

  if (formData.items.length === 0) {
    throw new Error(
      "Please add at least one material."
    );
  }

  const invalidItem =
    formData.items.some(
      (item) =>
        !item.materialId ||
        item.quantity <= 0
    );

  if (invalidItem) {
    throw new Error(
      "All materials must have a valid quantity."
    );
  }

  const materialIds =
    formData.items.map(
      (item) =>
        item.materialId
    );

  if (
    new Set(materialIds).size !==
    materialIds.length
  ) {
    throw new Error(
      "The same material cannot be added twice."
    );
  }

  if (
    !Number.isFinite(
      formData.laborCost
    ) ||
    formData.laborCost < 0
  ) {
    throw new Error(
      "Labor cost must be a valid number and cannot be negative."
    );
  }

  if (
    !Number.isFinite(
      formData.otherCost
    ) ||
    formData.otherCost < 0
  ) {
    throw new Error(
      "Other cost must be a valid number and cannot be negative."
    );
  }

  if (
    !Number.isFinite(
      formData.wastagePercent
    ) ||
    formData.wastagePercent < 0 ||
    formData.wastagePercent > 100
  ) {
    throw new Error(
      "Wastage must be between 0 and 100%."
    );
  }

  if (
    !Number.isFinite(
      formData.targetMarginPercent
    ) ||
    formData.targetMarginPercent < 0 ||
    formData.targetMarginPercent >= 100
  ) {
    throw new Error(
      "Target margin must be between 0 and less than 100%."
    );
  }
}

async function prepareProductImages(
  formData: RecipeFormData
) {
  if (
    !formData.product ||
    formData.product.imageMode ===
    "none"
  ) {
    return [];
  }

  let imageFile:
    | File
    | undefined =
    formData.referenceImage;

  if (
    !imageFile &&
    formData.existingReferenceImagePath
  ) {
    imageFile =
      await downloadRecipeReferenceImage(
        formData.existingReferenceImagePath
      );
  }

  if (!imageFile) {
    throw new Error(
      "Please upload a reference image or choose 'Do not add image to product'."
    );
  }

  return [
    {
      id: crypto.randomUUID(),

      file: imageFile,

      previewUrl: "",

      isPrimary:
        formData.product.imageMode ===
        "main",
    },
  ];
}

export async function createRecipe(
  formData: RecipeFormData
) {
  validateRecipeForm(
    formData
  );

  if (
    !formData.addToProduct
  ) {
    return createRecipeInDatabase(
      formData
    );
  }

  if (!formData.product) {
    throw new Error(
      "Product information is required."
    );
  }

  const productData =
    formData.product;

  if (
    !productData.name.trim()
  ) {
    throw new Error(
      "Product name is required."
    );
  }

  if (
    !productData.slug.trim()
  ) {
    throw new Error(
      "Product slug is required."
    );
  }

  if (
    !Number.isFinite(
      productData.sellingPrice
    ) ||
    productData.sellingPrice < 0
  ) {
    throw new Error(
      "Selling price must be a valid number and cannot be negative."
    );
  }

  const productImages =
    await prepareProductImages(
      formData
    );

  let createdProduct:
    Awaited<
      ReturnType<
        typeof createProduct
      >
    > | null = null;

  try {
    createdProduct =
      await createProduct({
        name:
          productData.name,

        slug:
          productData.slug,

        description: "",

        sellingPrice:
          productData.sellingPrice,

        status:
          productData.status,

        featured:
          productData.featured,

        categoryIds:
          productData.categoryIds,

        images:
          productImages,
      });

    const recipe =
      await createRecipeInDatabase(
        formData
      );

    await linkRecipeToProductInDatabase(
      recipe.id,
      createdProduct.id
    );

    return recipe;
  } catch (error) {
    if (createdProduct) {
      await deleteProduct(
        createdProduct.id
      );
    }

    throw error;
  }
}

export async function updateRecipe(
  recipeId: string,
  formData: RecipeFormData
) {
  if (!recipeId) {
    throw new Error(
      "Recipe ID is required."
    );
  }

  validateRecipeForm(
    formData
  );

  // Normal recipe update only
  if (
    !formData.addToProduct
  ) {
    return updateRecipeInDatabase(
      recipeId,
      formData
    );
  }

  if (!formData.product) {
    throw new Error(
      "Product information is required."
    );
  }

  const productData =
    formData.product;

  if (
    !productData.name.trim()
  ) {
    throw new Error(
      "Product name is required."
    );
  }

  if (
    !productData.slug.trim()
  ) {
    throw new Error(
      "Product slug is required."
    );
  }

  if (
    !Number.isFinite(
      productData.sellingPrice
    ) ||
    productData.sellingPrice < 0
  ) {
    throw new Error(
      "Selling price must be a valid number and cannot be negative."
    );
  }

  const productImages =
    await prepareProductImages(
      formData
    );

  let createdProduct:
    Awaited<
      ReturnType<
        typeof createProduct
      >
    > | null = null;

  try {
    createdProduct =
      await createProduct({
        name:
          productData.name,

        slug:
          productData.slug,

        description: "",

        sellingPrice:
          productData.sellingPrice,

        status:
          productData.status,

        featured:
          productData.featured,

        categoryIds:
          productData.categoryIds,

        images:
          productImages,
      });

    await updateRecipeInDatabase(
      recipeId,
      formData
    );

    await linkRecipeToProductInDatabase(
      recipeId,
      createdProduct.id
    );

    return createdProduct;
  } catch (error) {
    if (createdProduct) {
      await deleteProduct(
        createdProduct.id
      );
    }

    throw error;
  }
}