import { AdminRecipesScreen } from "@/features/recipes/components/AdminRecipesScreen";
import { getProductRecipeSummaries } from "@/features/recipes/services/recipe.service";

export default async function AdminRecipesPage() {
    const products =
        await getProductRecipeSummaries();

    return (
        <AdminRecipesScreen
            products={products}
        />
    );
}