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

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {occasionCategories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}