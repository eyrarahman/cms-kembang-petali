import { MaterialForm } from "@/features/materials/components/MaterialForm";

export default function NewMaterialPage() {
    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-5xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Costing
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Add Material
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Add a material and its purchase cost for product costing.
                    </p>
                </div>

                <MaterialForm />
            </div>
        </main>
    );
}