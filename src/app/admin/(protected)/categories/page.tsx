import { AdminCategoriesScreen } from "@/features/categories/components/AdminCategoriesScreen";
import { getCategories } from "@/features/categories/services/category.service";

export default async function AdminCategoriesPage() {
    const categories =
        await getCategories();

    return (
        <AdminCategoriesScreen
            categories={categories}
        />
    );
}