import { notFound } from "next/navigation";

import { RecipeForm } from "@/features/recipes/components/RecipeForm";

import { getMaterials } from "@/features/materials/services/material.service";

import { getAdminProductById } from "@/features/products/services/product.service";

import { getRecipeByProductId } from "@/features/recipes/services/recipe.service";

type EditRecipePageProps = {
    params: Promise<{
        productId: string;
    }>;
};

export default async function EditRecipePage({
    params,
}: EditRecipePageProps) {
    const { productId } =
        await params;

    const [
        product,
        materials,
        recipe,
    ] = await Promise.all([
        getAdminProductById(
            productId
        ),

        getMaterials(),

        getRecipeByProductId(
            productId
        ),
    ]);

    if (!product || !recipe) {
        notFound();
    }

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
                        for {product.name}.
                    </p>
                </div>

                <RecipeForm
                    mode="edit"
                    product={product}
                    recipe={recipe}
                    materials={materials}
                />
            </div>
        </main>
    );
}