import { notFound } from "next/navigation";

import { OrderDetailScreen } from "@/features/orders/components/OrderDetailScreen";
import { getOrderById } from "@/features/orders/services/order.service";

type OrderDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function OrderDetailPage({
    params,
}: OrderDetailPageProps) {
    const { id } = await params;

    const order =
        await getOrderById(id);

    if (!order) {
        notFound();
    }

    return (
        <OrderDetailScreen
            order={order}
        />
    );
}