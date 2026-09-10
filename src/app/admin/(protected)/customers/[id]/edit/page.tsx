import { notFound } from "next/navigation";

import { CustomerForm } from "@/features/customers/components/CustomerForm";
import { getCustomerById } from "@/features/customers/services/customer.service";

type EditCustomerPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditCustomerPage({
    params,
}: EditCustomerPageProps) {
    const { id } = await params;

    const customer =
        await getCustomerById(id);

    if (!customer) {
        notFound();
    }

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-5xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Customer Management
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Edit Customer
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {customer.customerCode} ·{" "}
                        {customer.name}
                    </p>
                </div>

                <CustomerForm
                    mode="edit"
                    customer={customer}
                />
            </div>
        </main>
    );
}