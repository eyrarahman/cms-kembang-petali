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
                    eyebrow="Kembang Petali"
                    title="Untuk Setiap Momen"
                    description="Cari hadiah yang sesuai untuk hari istimewa."
                />

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {occasionCategories.map(
                        (category) => (
                            <Link
                                key={category.id}
                                href={`/category/${category.slug}`}
                                className="group relative overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* IMAGE */}
                                <div className="relative h-65 overflow-hidden bg-rose-100 sm:h-70 lg:h-75">
                                    <Image
                                        src={`/assets/occasions/${category.slug}.png`}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover object-center transition duration-500 group-hover:scale-105"
                                    />
                                </div>

                                {/* CURVED BOTTOM */}
                                <div className="relative -mt-12 h-27.5">
                                    <svg
                                        viewBox="0 0 500 120"
                                        preserveAspectRatio="none"
                                        className="absolute inset-0 h-full w-full"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M0,48 C120,5 230,105 500,40 L500,120 L0,120 Z"
                                            fill="white"
                                        />
                                    </svg>

                                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 pb-5">
                                        <h3 className="text-2xl font-semibold text-gray-900 transition group-hover:text-rose-500">
                                            {category.name}
                                        </h3>

                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-rose-100 transition duration-300 group-hover:translate-x-1 group-hover:bg-rose-50">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="h-5 w-5 text-rose-500"
                                            >
                                                <path
                                                    d="M5 12h14M13 6l6 6-6 6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}