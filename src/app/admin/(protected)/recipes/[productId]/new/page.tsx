import { notFound } from "next/navigation";

import { RecipeForm } from "@/features/recipes/components/RecipeForm";

import { getMaterials } from "@/features/materials/services/material.service";
import { getAdminProductById } from "@/features/products/services/product.service";

type NewRecipePageProps = {
    params: Promise<{
        productId: string;
    }>;
};

export default async function NewRecipePage({
    params,
}: NewRecipePageProps) {
    const { productId } =
        await params;

    const [
        product,
        allMaterials,
    ] = await Promise.all([
        getAdminProductById(
            productId
        ),
        getMaterials(),
    ]);

    if (!product) {
        notFound();
    }

    const activeMaterials =
        allMaterials.filter(
            (material) =>
                material.status ===
                "active"
        );

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Costing
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Create Recipe
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Define the materials and
                        production cost for this
                        product.
                    </p>
                </div>

                {activeMaterials.length >
                    0 ? (
                    <RecipeForm
                        product={product}
                        materials={
                            activeMaterials
                        }
                    />
                ) : (
                    <div className="mt-10 rounded-2xl border border-rose-100 bg-white p-8">
                        <p className="font-semibold text-gray-900">
                            No active materials
                            available.
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Add materials first before
                            creating a recipe.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}