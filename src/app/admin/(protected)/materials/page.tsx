import { AdminMaterialsScreen } from "@/features/materials/components/AdminMaterialsScreen";
import { getMaterials } from "@/features/materials/services/material.service";

export default async function AdminMaterialsPage() {
    const materials =
        await getMaterials();

    return (
        <AdminMaterialsScreen
            materials={materials}
        />
    );
}