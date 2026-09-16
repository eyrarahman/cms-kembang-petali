import { createClient } from "@/lib/supabase/client";

import { RecipeFormData } from "../types/recipe-form.types";


const RECIPE_IMAGE_BUCKET =
  "product-images";

async function uploadRecipeReferenceImage(
  supabase: ReturnType<typeof createClient>,
  recipeId: string,
  file: File
) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() || "jpg";

  const filePath =
    `recipes/${recipeId}/${crypto.randomUUID()}.${extension}`;

  const { error } =
    await supabase.storage
      .from(
        RECIPE_IMAGE_BUCKET
      )
      .upload(
        filePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

  if (error) {
    throw new Error(
      `Unable to upload reference image: ${error.message}`
    );
  }

  return filePath;
}

export async function createRecipeInDatabase(
  formData: RecipeFormData
) {
  const supabase = createClient();

  let createdRecipeId:
    string | null = null;

  let uploadedReferenceImagePath:
    string | null = null;

  try {
    const {
      data: recipe,
      error: recipeError,
    } = await supabase
      .from("product_recipes")
      .insert({
        name:
          formData.name.trim(),

        product_id: null,

        reference_image_path:
          formData.existingReferenceImagePath ??
          null,

        labor_cost:
          formData.laborCost,

        wastage_percent:
          formData.wastagePercent,

        other_cost:
          formData.otherCost,

        target_margin_percent:
          formData.targetMarginPercent,

        notes:
          formData.notes || null,
      })
      .select("id")
      .single();

    if (recipeError) {
      throw new Error(
        recipeError.message
      );
    }

    createdRecipeId = recipe.id;

    let uploadedReferenceImagePath:
      string | null = null;

    if (formData.referenceImage) {
      uploadedReferenceImagePath =
        await uploadRecipeReferenceImage(
          supabase,
          recipe.id,
          formData.referenceImage
        );

      const {
        error:
        referenceImageUpdateError,
      } = await supabase
        .from("product_recipes")
        .update({
          reference_image_path:
            uploadedReferenceImagePath,
        })
        .eq(
          "id",
          recipe.id
        );

      if (
        referenceImageUpdateError
      ) {
        throw new Error(
          referenceImageUpdateError.message
        );
      }
    }

    const recipeItems =
      formData.items.map(
        (item, index) => ({
          recipe_id: recipe.id,
          material_id:
            item.materialId,
          quantity:
            item.quantity,
          sort_order: index,
        })
      );

    const {
      error: itemsError,
    } = await supabase
      .from(
        "product_recipe_items"
      )
      .insert(recipeItems);

    if (itemsError) {
      throw new Error(
        itemsError.message
      );
    }

    return recipe;
  } catch (error) {

    if (
      uploadedReferenceImagePath
    ) {
      await supabase.storage
        .from(
          RECIPE_IMAGE_BUCKET
        )
        .remove([
          uploadedReferenceImagePath,
        ]);
    }
    if (createdRecipeId) {
      await supabase
        .from("product_recipes")
        .delete()
        .eq(
          "id",
          createdRecipeId
        );
    }

    throw error;
  }
}
export async function updateRecipeInDatabase(
  recipeId: string,
  formData: RecipeFormData
) {
  const supabase = createClient();

  const oldReferenceImagePath =
    formData.existingReferenceImagePath ??
    null;

  let newReferenceImagePath =
    oldReferenceImagePath;

  let uploadedNewImagePath:
    string | null = null;

  try {
    if (formData.referenceImage) {
      uploadedNewImagePath =
        await uploadRecipeReferenceImage(
          supabase,
          recipeId,
          formData.referenceImage
        );

      newReferenceImagePath =
        uploadedNewImagePath;
    }

    // Update recipe information
    const { error: recipeError } =
      await supabase
        .from("product_recipes")
        .update({
          name:
            formData.name.trim(),

          reference_image_path:
            newReferenceImagePath,

          labor_cost:
            formData.laborCost,

          wastage_percent:
            formData.wastagePercent,

          other_cost:
            formData.otherCost,

          target_margin_percent:
            formData.targetMarginPercent,

          notes:
            formData.notes || null,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", recipeId);

    if (recipeError) {
      throw new Error(
        recipeError.message
      );
    }

    // Remove old recipe items
    const {
      error: deleteItemsError,
    } = await supabase
      .from("product_recipe_items")
      .delete()
      .eq("recipe_id", recipeId);

    if (deleteItemsError) {
      throw new Error(
        deleteItemsError.message
      );
    }

    // Insert current items
    const recipeItems =
      formData.items.map(
        (item, index) => ({
          recipe_id: recipeId,
          material_id:
            item.materialId,
          quantity:
            item.quantity,
          sort_order: index,
        })
      );

    const {
      error: itemsError,
    } = await supabase
      .from(
        "product_recipe_items"
      )
      .insert(recipeItems);

    if (itemsError) {
      throw new Error(
        itemsError.message
      );
    }

    if (
      uploadedNewImagePath &&
      oldReferenceImagePath &&
      oldReferenceImagePath !==
      uploadedNewImagePath
    ) {
      await supabase.storage
        .from(
          RECIPE_IMAGE_BUCKET
        )
        .remove([
          oldReferenceImagePath,
        ]);
    }
  } catch (error) {
    if (
      uploadedNewImagePath
    ) {
      await supabase.storage
        .from(
          RECIPE_IMAGE_BUCKET
        )
        .remove([
          uploadedNewImagePath,
        ]);
    }

    throw error;
  }
}

export async function linkRecipeToProductInDatabase(
  recipeId: string,
  productId: string
) {
  const supabase =
    createClient();

  const { error } =
    await supabase
      .from(
        "product_recipes"
      )
      .update({
        product_id:
          productId,
        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        recipeId
      );

  if (error) {
    throw new Error(
      error.message
    );
  }
}

export async function downloadRecipeReferenceImage(
  storagePath: string
) {
  const supabase = createClient();

  const {
    data,
    error,
  } = await supabase.storage
    .from("product-images")
    .download(storagePath);

  if (error) {
    throw new Error(
      `Unable to read recipe reference image: ${error.message}`
    );
  }

  const fileName =
    storagePath
      .split("/")
      .pop() ??
    "recipe-reference.jpg";

  return new File(
    [data],
    fileName,
    {
      type:
        data.type ||
        "image/jpeg",
    }
  );
}
