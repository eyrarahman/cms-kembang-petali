import Link from "next/link";

import { Material } from "../types/material.types";
import { DeleteMaterialButton } from "./DeleteMaterialButton";

type AdminMaterialsScreenProps = {
    materials: Material[];
};

function getCategoryLabel(
    category: Material["category"]
) {
    switch (category) {
        case "flower":
            return "Flower";

        case "wrapping":
            return "Wrapping";

        case "ribbon":
            return "Ribbon";

        case "decoration":
            return "Decoration";

        case "packaging":
            return "Packaging";

        case "gift":
            return "Gift";

        case "other":
            return "Other";
    }
}

function getStatusLabel(
    status: Material["status"]
) {
    switch (status) {
        case "active":
            return "Active";

        case "inactive":
            return "Inactive";
    }
}

export function AdminMaterialsScreen({
    materials,
}: AdminMaterialsScreenProps) {
    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                            Costing
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-gray-900">
                            Materials
                        </h1>

                        <p className="mt-3 text-gray-600">
                            Manage materials and purchase costs used
                            for product costing.
                        </p>
                    </div>

                    <Link
                        href="/admin/materials/new"
                        className="shrink-0 rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white hover:bg-rose-600"
                    >
                        + Add Material
                    </Link>
                </div>

                <div className="mt-10 overflow-hidden rounded-2xl border border-rose-100 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-100 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Material
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Purchase
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Unit Cost
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {materials.map(
                                    (material) => (
                                        <tr key={material.id}>
                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-gray-900">
                                                    {material.name}
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-gray-500">
                                                    {material.materialCode}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-gray-700">
                                                {getCategoryLabel(
                                                    material.category
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-medium text-gray-900">
                                                    RM{" "}
                                                    {material.purchasePrice.toFixed(
                                                        2
                                                    )}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    for{" "}
                                                    {material.purchaseQuantity}{" "}
                                                    {material.baseUnit}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-rose-500">
                                                    RM{" "}
                                                    {material.unitCost.toFixed(
                                                        2
                                                    )}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    / {material.baseUnit}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                    {getStatusLabel(
                                                        material.status
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-right">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-end gap-4">
                                                        <Link
                                                            href={`/admin/materials/${material.id}/edit`}
                                                            className="text-sm font-medium text-rose-500 hover:text-rose-600"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <DeleteMaterialButton
                                                            materialId={material.id}
                                                            materialName={material.name}
                                                        />
                                                    </div>
                                                </td>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {materials.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="font-medium text-gray-600">
                                No materials yet.
                            </p>

                            <p className="mt-2 text-sm text-gray-400">
                                Add your first material to start
                                calculating product costs.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}