import Link from "next/link";
import { Category } from "../types/category.types";

type CategoryCardProps = {
    category: Category;
};

export function CategoryCard({
    category,
}: CategoryCardProps) {
    return (
        <Link
            href={`/category/${category.slug}`}
            className="group rounded-2xl border border-rose-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
            <div className="flex h-40 items-center justify-center rounded-xl bg-rose-50">
                <span className="text-sm font-medium text-rose-400">
                    {category.name}
                </span>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-rose-500">
                    {category.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    Explore products for {category.name.toLowerCase()}
                </p>
            </div>
        </Link>
    );
}