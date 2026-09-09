import { createClient } from "@/lib/supabase/client";

import { ProductFormData } from "../types/product-form.types";

const PRODUCT_IMAGES_BUCKET =
  "product-images";

function getFileExtension(
  mimeType: string
) {
  switch (mimeType) {
    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    case "image/jpeg":
    default:
      return "jpg";
  }
}

export async function createProductInDatabase(
  formData: ProductFormData
) {
  const supabase = createClient();

  const uploadedPaths: string[] = [];

  let createdProductId:
    | string
    | null = null;

  try {
    // 1. Create product
    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .insert({
        name: formData.name,
        slug: formData.slug,
        description:
          formData.description || null,
        selling_price:
          formData.sellingPrice,
        status: formData.status,
        featured: formData.featured,
      })
      .select(
        "id, product_code"
      )
      .single();

    if (productError) {
      throw new Error(
        productError.message
      );
    }

    createdProductId =
      product.id;

    // 2. Save product categories
    if (
      formData.categoryIds.length > 0
    ) {
      const categoryRows =
        formData.categoryIds.map(
          (categoryId) => ({
            product_id:
              product.id,

            category_id:
              categoryId,
          })
        );

      const {
        error: categoryError,
      } = await supabase
        .from(
          "product_categories"
        )
        .insert(categoryRows);

      if (categoryError) {
        throw new Error(
          categoryError.message
        );
      }
    }

    // 3. Upload product images
    const productImageRows = [];

    for (
      let index = 0;
      index <
      formData.images.length;
      index++
    ) {
      const image =
        formData.images[index];

      const extension =
        getFileExtension(
          image.file.type
        );

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const storagePath =
        `${product.id}/${fileName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from(
          PRODUCT_IMAGES_BUCKET
        )
        .upload(
          storagePath,
          image.file,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );

      if (uploadError) {
        throw new Error(
          `Failed to upload ${image.file.name}: ${uploadError.message}`
        );
      }

      uploadedPaths.push(
        storagePath
      );

      productImageRows.push({
        product_id:
          product.id,

        storage_path:
          storagePath,

        alt_text:
          formData.name,

        is_primary:
          image.isPrimary,

        sort_order:
          index,
      });
    }

    // 4. Save image information
    const {
      error: imageDatabaseError,
    } = await supabase
      .from("product_images")
      .insert(
        productImageRows
      );

    if (imageDatabaseError) {
      throw new Error(
        imageDatabaseError.message
      );
    }

    return product;
  } catch (error) {
    // Remove any uploaded files
    if (
      uploadedPaths.length > 0
    ) {
      await supabase.storage
        .from(
          PRODUCT_IMAGES_BUCKET
        )
        .remove(
          uploadedPaths
        );
    }

    // Remove incomplete product.
    // product_categories and
    // product_images will cascade delete.
    if (createdProductId) {
      await supabase
        .from("products")
        .delete()
        .eq(
          "id",
          createdProductId
        );
    }

    throw error;
  }
}