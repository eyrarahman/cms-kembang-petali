import { notFound } from "next/navigation";

import { OrderForm } from "@/features/orders/components/OrderForm";

import { getCustomers } from "@/features/customers/services/customer.service";

import { getAdminProducts } from "@/features/products/services/product.service";

import { getOrderById } from "@/features/orders/services/order.service";

type EditOrderPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditOrderPage({
    params,
}: EditOrderPageProps) {
    const { id } = await params;

    const [
        order,
        customers,
        products,
    ] = await Promise.all([
        getOrderById(id),
        getCustomers(),
        getAdminProducts(),
    ]);

    if (!order) {
        notFound();
    }

    const selectableCustomers =
        customers.filter(
            (customer) =>
                customer.status ===
                "active" ||
                customer.id ===
                order.customerId
        );

    const existingProductIds =
        new Set(
            order.items
                .map(
                    (item) =>
                        item.productId
                )
                .filter(
                    (
                        productId
                    ): productId is string =>
                        Boolean(productId)
                )
        );

    const selectableProducts =
        products.filter(
            (product) =>
                product.status !==
                "hidden" ||
                existingProductIds.has(
                    product.id
                )
        );

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Order Management
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Edit Order
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {order.orderCode} ·{" "}
                        {order.customerName}
                    </p>
                </div>

                <OrderForm
                    mode="edit"
                    order={order}
                    customers={
                        selectableCustomers
                    }
                    products={
                        selectableProducts
                    }
                />
            </div>
        </main>
    );
}