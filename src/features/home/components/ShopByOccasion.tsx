import Image from "next/image";
import Link from "next/link";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Category } from "@/features/categories/types/category.types";

type ShopByOccasionProps = {
    categories: Category[];
};

export function ShopByOccasion({
    categories,
}: ShopByOccasionProps) {
    const occasionCategories =
        categories.filter(
            (category) =>
                category.type === "occasion"
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
                    {occasionCategories.map(
                        (category) => (
                            <Link
                                key={category.id}
                                href={`/category/${category.slug}`}
                                className="group overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* IMAGE */}
                                <div className="relative aspect-[2.35/1] overflow-hidden bg-rose-100">
                                    <Image
                                        src={`/assets/occasions/${category.slug}.png`}
                                        alt={
                                            category.name
                                        }
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>

                                {/* DETAILS */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 transition group-hover:text-rose-500">
                                        {
                                            category.name
                                        }
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Explore products for{" "}
                                        {category.name.toLowerCase()}
                                    </p>
                                </div>
                            </Link>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}