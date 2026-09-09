import { ProductForm } from "@/features/products/components/ProductForm";
import { getCategories } from "@/features/categories/services/category.service";

export default async function NewProductPage() {
    const categories =
        await getCategories();

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-5xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Catalog Management
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Add Product
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Add a new product to the
                        Kembang Petali catalog.
                    </p>
                </div>

                <ProductForm
                    categories={categories}
                />
            </div>
        </main>
    );
}