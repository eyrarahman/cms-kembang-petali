import {
  createProductInDatabase,
  deleteProductFromDatabase,
  updateProductInDatabase,
} from "../repositories/product-admin.repository";

import {
  ProductFormData,
  ProductUpdateFormData,
} from "../types/product-form.types";

export async function createProduct(
  formData: ProductFormData
) {
  if (!formData.name.trim()) {
    throw new Error(
      "Product name is required."
    );
  }

  if (!formData.slug.trim()) {
    throw new Error(
      "Product slug is required."
    );
  }

  if (formData.sellingPrice < 0) {
    throw new Error(
      "Selling price cannot be negative."
    );
  }

  if (formData.images.length === 0) {
    throw new Error(
      "Please upload at least one product image."
    );
  }

  const hasPrimaryImage =
    formData.images.some(
      (image) => image.isPrimary
    );

  if (!hasPrimaryImage) {
    throw new Error(
      "Please select a main product image."
    );
  }

  return createProductInDatabase(
    formData
  );
}

export async function updateProduct(
  productId: string,
  formData: ProductUpdateFormData
) {
  if (!formData.name.trim()) {
    throw new Error(
      "Product name is required."
    );
  }

  if (!formData.slug.trim()) {
    throw new Error(
      "Product slug is required."
    );
  }

  if (formData.sellingPrice < 0) {
    throw new Error(
      "Selling price cannot be negative."
    );
  }

  const allImages = [
    ...formData.existingImages,
    ...formData.newImages,
  ];

  if (allImages.length === 0) {
    throw new Error(
      "Product must have at least one image."
    );
  }

  const primaryImageCount =
    allImages.filter(
      (image) => image.isPrimary
    ).length;

  if (primaryImageCount !== 1) {
    throw new Error(
      "Product must have exactly one main image."
    );
  }

  return updateProductInDatabase(
    productId,
    formData
  );
}
export async function deleteProduct(
  productId: string
) {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  return deleteProductFromDatabase(
    productId
  );
}