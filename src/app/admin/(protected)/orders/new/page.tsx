import { OrderForm } from "@/features/orders/components/OrderForm";

import { getCustomers } from "@/features/customers/services/customer.service";
import { getAdminProducts } from "@/features/products/services/product.service";

export default async function NewOrderPage() {
    const [
        customers,
        products,
    ] = await Promise.all([
        getCustomers(),
        getAdminProducts(),
    ]);

    const activeCustomers =
        customers.filter(
            (customer) =>
                customer.status ===
                "active"
        );

    const selectableProducts =
        products.filter(
            (product) =>
                product.status !==
                "hidden"
        );

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Order Management
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Add Order
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Create a new customer order
                        and manage fulfilment and
                        payment details.
                    </p>
                </div>

                {activeCustomers.length ===
                    0 ? (
                    <div className="mt-10 rounded-2xl border border-rose-100 bg-white p-8">
                        <p className="font-semibold text-gray-900">
                            No active customers.
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Add a customer before
                            creating an order.
                        </p>
                    </div>
                ) : (
                    <OrderForm
                        customers={
                            activeCustomers
                        }
                        products={
                            selectableProducts
                        }
                    />
                )}
            </div>
        </main>
    );
}