import { AdminProductsScreen } from "@/features/products/components/AdminProductsScreen";

import { getAdminProducts } from "@/features/products/services/product.service";
import { getBusinessSettings } from "@/features/settings/services/settings.service";

export default async function AdminProductsPage() {
    const [
        products,
        settings,
    ] = await Promise.all([
        getAdminProducts(),
        getBusinessSettings(),
    ]);

    return (
        <AdminProductsScreen
            products={products}
            businessName={
                settings.businessName
            }
        />
    );
}