import { notFound } from "next/navigation";

import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { getCategoryById } from "@/features/categories/services/category.service";

type EditCategoryPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditCategoryPage({
    params,
}: EditCategoryPageProps) {
    const { id } = await params;

    const category =
        await getCategoryById(id);

    if (!category) {
        notFound();
    }

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-4xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Catalog Management
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Edit Category
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Update category information.
                    </p>
                </div>

                <CategoryForm
                    mode="edit"
                    category={category}
                />
            </div>
        </main>
    );
}