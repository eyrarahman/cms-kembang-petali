import { SectionHeader } from "@/components/ui/SectionHeader";
import { CategoryCard } from "@/features/categories/components/CategoryCard";
import { Category } from "@/features/categories/types/category.types";

type ShopByOccasionProps = {
    categories: Category[];
};

export function ShopByOccasion({
    categories,
}: ShopByOccasionProps) {
    const occasionCategories = categories.filter(
        (category) => category.type === "occasion"
    );

    return (
        <section className="bg-rose-50 px-6 py-20">
            <div className="mx-auto max-w-7xl">
                <SectionHeader
                    eyebrow="Find The Perfect Gift"
                    title="Shop by Occasion"
                    description="Cari hadiah yang sesuai mengikut majlis dan hari istimewa."
                />

{occasionCategories.length > 0 ? (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {occasionCategories.map((category) => (
            <CategoryCard
                key={category.id}
                category={category}
            />
        ))}
    </div>
) : (
    <div className="mt-10 rounded-2xl border border-rose-100 bg-white p-10 text-center">
        <p className="font-medium text-gray-700">
            No occasion categories yet.
        </p>

        <p className="mt-2 text-sm text-gray-500">
            More gift occasions will be available soon.
        </p>
    </div>
)}
            </div>
        </section>
    );
}