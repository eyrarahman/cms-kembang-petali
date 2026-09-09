import {
  Product,
  ProductStatus,
} from "../types/product.types";

import { getProductImagePublicUrl } from "../utils/product.utils";

type CategoryRelation = {
  slug: string;
};

type ProductImageDatabaseRow = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
};

type ProductDatabaseRow = {
  id: string;
  product_code: string;
  name: string;
  slug: string;
  description: string | null;
  selling_price: number;
  status: string;
  featured: boolean;

  product_categories:
    | {
        categories:
          | CategoryRelation
          | CategoryRelation[]
          | null;
      }[]
    | null;

  product_images:
    | ProductImageDatabaseRow[]
    | null;
};

export function mapProductFromDatabase(
  product: ProductDatabaseRow
): Product {
  const categorySlugs =
    product.product_categories?.flatMap(
      (item) => {
        if (!item.categories) {
          return [];
        }

        if (
          Array.isArray(item.categories)
        ) {
          return item.categories.map(
            (category) => category.slug
          );
        }

        return [
          item.categories.slug,
        ];
      }
    ) ?? [];

  const images =
    product.product_images
      ?.map((image) => ({
        id: image.id,

        storagePath:
          image.storage_path,

        url:
          getProductImagePublicUrl(
            image.storage_path
          ),

        altText:
          image.alt_text ??
          undefined,

        isPrimary:
          image.is_primary,

        sortOrder:
          image.sort_order,
      }))
      .sort(
        (a, b) =>
          a.sortOrder -
          b.sortOrder
      ) ?? [];

  const mainImage =
    images.find(
      (image) =>
        image.isPrimary
    ) ?? images[0];

  return {
    id: product.id,

    productCode:
      product.product_code,

    name: product.name,

    slug: product.slug,

    price: Number(
      product.selling_price
    ),

    description:
      product.description ??
      undefined,

    categorySlugs,

    status:
      product.status as ProductStatus,

    featured:
      product.featured,

    images,

    mainImage,
  };
}