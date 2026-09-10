import { createClient } from "@/lib/supabase/client";

import {
  ProductFormData,
  ProductUpdateFormData,
} from "../types/product-form.types";

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

export async function updateProductInDatabase(
  productId: string,
  formData: ProductUpdateFormData
) {
  const supabase = createClient();

  const uploadedNewPaths: string[] = [];

  try {
    // ---------------------------------------
    // 1. Upload new images to Storage first
    // ---------------------------------------

    const newImageRows = [];

    for (
      let index = 0;
      index < formData.newImages.length;
      index++
    ) {
      const image =
        formData.newImages[index];

      const extension =
        getFileExtension(
          image.file.type
        );

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const storagePath =
        `${productId}/${fileName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
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

      uploadedNewPaths.push(
        storagePath
      );

      newImageRows.push({
        product_id: productId,
        storage_path: storagePath,
        alt_text: formData.name,
        is_primary:
          image.isPrimary,

        sort_order:
          formData.existingImages.length +
          index,
      });
    }

    // ---------------------------------------
    // 2. Update product information
    // ---------------------------------------

    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .update({
        name: formData.name,
        slug: formData.slug,
        description:
          formData.description || null,

        selling_price:
          formData.sellingPrice,

        status: formData.status,
        featured: formData.featured,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", productId)
      .select(
        "id, product_code"
      )
      .single();

    if (productError) {
      throw new Error(
        productError.message
      );
    }

    // ---------------------------------------
    // 3. Update categories
    // ---------------------------------------

    const {
      error: deleteCategoryError,
    } = await supabase
      .from("product_categories")
      .delete()
      .eq(
        "product_id",
        productId
      );

    if (deleteCategoryError) {
      throw new Error(
        deleteCategoryError.message
      );
    }

    if (
      formData.categoryIds.length > 0
    ) {
      const categoryRows =
        formData.categoryIds.map(
          (categoryId) => ({
            product_id:
              productId,

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

    // ---------------------------------------
    // 4. Reset existing main image
    // ---------------------------------------

    // Important:
    // We reset everything to false first
    // because database allows only ONE
    // primary image per product.

    const {
      error: resetPrimaryError,
    } = await supabase
      .from("product_images")
      .update({
        is_primary: false,
      })
      .eq(
        "product_id",
        productId
      );

    if (resetPrimaryError) {
      throw new Error(
        resetPrimaryError.message
      );
    }

    // ---------------------------------------
    // 5. Delete removed image records
    // ---------------------------------------

    if (
      formData.deletedImages.length > 0
    ) {
      const deletedImageIds =
        formData.deletedImages.map(
          (image) => image.id
        );

      const {
        error: deleteImageError,
      } = await supabase
        .from("product_images")
        .delete()
        .eq(
          "product_id",
          productId
        )
        .in(
          "id",
          deletedImageIds
        );

      if (deleteImageError) {
        throw new Error(
          deleteImageError.message
        );
      }
    }

    // ---------------------------------------
    // 6. Update remaining existing images
    // ---------------------------------------

    for (
      let index = 0;
      index <
      formData.existingImages.length;
      index++
    ) {
      const image =
        formData.existingImages[index];

      const {
        error: imageUpdateError,
      } = await supabase
        .from("product_images")
        .update({
          is_primary:
            image.isPrimary,

          sort_order:
            index,

          alt_text:
            image.altText ??
            formData.name,
        })
        .eq(
          "id",
          image.id
        )
        .eq(
          "product_id",
          productId
        );

      if (imageUpdateError) {
        throw new Error(
          imageUpdateError.message
        );
      }
    }

    // ---------------------------------------
    // 7. Insert new image records
    // ---------------------------------------

    if (
      newImageRows.length > 0
    ) {
      const {
        error: newImageError,
      } = await supabase
        .from("product_images")
        .insert(newImageRows);

      if (newImageError) {
        throw new Error(
          newImageError.message
        );
      }
    }

    // ---------------------------------------
    // 8. Remove deleted files from Storage
    // ---------------------------------------

    if (
      formData.deletedImages.length > 0
    ) {
      const deletedStoragePaths =
        formData.deletedImages.map(
          (image) =>
            image.storagePath
        );

      const {
        error: storageDeleteError,
      } = await supabase.storage
        .from(
          PRODUCT_IMAGES_BUCKET
        )
        .remove(
          deletedStoragePaths
        );

      if (storageDeleteError) {
        console.error(
          "Unable to remove old product images from Storage:",
          storageDeleteError
        );
      }
    }

    return product;
  } catch (error) {
    // If newly uploaded images fail
    // during update, clean those files.

    if (
      uploadedNewPaths.length > 0
    ) {
      await supabase.storage
        .from(
          PRODUCT_IMAGES_BUCKET
        )
        .remove(
          uploadedNewPaths
        );
    }

    throw error;
  }
}

export async function deleteProductFromDatabase(
  productId: string
) {
  const supabase = createClient();

  // 1. Get image paths before deleting product
  const {
    data: productImages,
    error: imageQueryError,
  } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", productId);

  if (imageQueryError) {
    throw new Error(
      imageQueryError.message
    );
  }

  const storagePaths =
    productImages?.map(
      (image) => image.storage_path
    ) ?? [];

  // 2. Delete product
  const {
    error: productDeleteError,
  } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (productDeleteError) {
    throw new Error(
      productDeleteError.message
    );
  }

  // product_categories and product_images
  // database rows are deleted automatically
  // because of ON DELETE CASCADE.

  // 3. Remove actual files from Storage
  if (storagePaths.length > 0) {
    const {
      error: storageDeleteError,
    } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove(storagePaths);

    if (storageDeleteError) {
      console.error(
        "Product deleted, but some image files could not be removed:",
        storageDeleteError
      );
    }
  }
}