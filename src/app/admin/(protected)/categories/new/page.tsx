import { CategoryForm } from "@/features/categories/components/CategoryForm";

export default function NewCategoryPage() {
    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-4xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Catalog Management
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Add Category
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Add a new category for product filtering.
                    </p>
                </div>

                <CategoryForm />
            </div>
        </main>
    );
}