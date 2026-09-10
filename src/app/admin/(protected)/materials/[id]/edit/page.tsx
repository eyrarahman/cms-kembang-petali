import { notFound } from "next/navigation";

import { MaterialForm } from "@/features/materials/components/MaterialForm";
import { getMaterialById } from "@/features/materials/services/material.service";

type EditMaterialPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditMaterialPage({
    params,
}: EditMaterialPageProps) {
    const { id } = await params;

    const material =
        await getMaterialById(id);

    if (!material) {
        notFound();
    }

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-5xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Costing
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Edit Material
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {material.materialCode} ·{" "}
                        {material.name}
                    </p>
                </div>

                <MaterialForm
                    mode="edit"
                    material={material}
                />
            </div>
        </main>
    );
}