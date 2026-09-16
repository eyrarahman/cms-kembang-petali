import { notFound } from "next/navigation";

import { RecipeForm } from "@/features/recipes/components/RecipeForm";
import { getMaterials } from "@/features/materials/services/material.service";
import { getRecipeById } from "@/features/recipes/services/recipe.service";
import { getAdminProductById } from "@/features/products/services/product.service";
import { getCategories } from "@/features/categories/services/category.service";

type EditRecipePageProps = {
    params: Promise<{
        recipeId: string;
    }>;
};

export default async function EditRecipePage({
    params,
}: EditRecipePageProps) {
    const { recipeId } =
        await params;

    const recipe =
        await getRecipeById(
            recipeId
        );

    if (!recipe) {
        notFound();
    }

    const [
        allMaterials,
        categories,
        product,
    ] = await Promise.all([
        getMaterials(),
        getCategories(),

        recipe.productId
            ? getAdminProductById(
                recipe.productId
            )
            : Promise.resolve(null),
    ]);

    const recipeMaterialIds =
        new Set(
            recipe.items.map(
                (item) =>
                    item.materialId
            )
        );

    const availableMaterials =
        allMaterials.filter(
            (material) =>
                material.status ===
                "active" ||
                recipeMaterialIds.has(
                    material.id
                )
        );

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Costing
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Edit Recipe
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Update materials and costing
                        for {recipe.name}.
                    </p>
                </div>

                <RecipeForm
                    mode="edit"
                    recipe={recipe}
                    product={
                        product ?? undefined
                    }
                    materials={
                        availableMaterials
                    }
                    categories={
                        categories
                    }
                />
            </div>
        </main>
    );
}