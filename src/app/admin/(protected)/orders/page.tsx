import { AdminOrdersScreen } from "@/features/orders/components/AdminOrdersScreen";
import { getOrders } from "@/features/orders/services/order.service";

export default async function AdminOrdersPage() {
    const orders =
        await getOrders();

    return (
        <AdminOrdersScreen
            orders={orders}
        />
    );
}