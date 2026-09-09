import { mapProductFromDatabase } from "../mappers/product.mapper";
import {
  getAdminProductByIdFromDatabase,
  getAdminProductsFromDatabase,
  getFeaturedProductsFromDatabase,
  getProductBySlugFromDatabase,
  getProductsFromDatabase,
} from "../repositories/product.repository";

export async function getProducts() {
  const products = await getProductsFromDatabase();

  return products.map(mapProductFromDatabase);
}

export async function getProductsByCategorySlug(
  categorySlug: string
) {
  const products = await getProducts();

  return products.filter((product) =>
    product.categorySlugs.includes(categorySlug)
  );
}

export async function getProductBySlug(
  slug: string
) {
  const product =
    await getProductBySlugFromDatabase(slug);

  if (!product) {
    return null;
  }

  return mapProductFromDatabase(product);
}

export async function getFeaturedProducts() {
  const products =
    await getFeaturedProductsFromDatabase();

  return products.map(mapProductFromDatabase);
}

export async function getAdminProducts() {
  const products =
    await getAdminProductsFromDatabase();

  return products.map(mapProductFromDatabase);
}

export async function getAdminProductById(
  productId: string
) {
  const product =
    await getAdminProductByIdFromDatabase(
      productId
    );

  if (!product) {
    return null;
  }

  return mapProductFromDatabase(
    product
  );
}