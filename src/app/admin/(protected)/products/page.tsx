import { AdminProductsScreen } from "@/features/products/components/AdminProductsScreen";
import { getAdminProducts } from "@/features/products/services/product.service";

export default async function AdminProductsPage() {
    const products = await getAdminProducts();

    return (
        <AdminProductsScreen
            products={products}
        />
    );
}