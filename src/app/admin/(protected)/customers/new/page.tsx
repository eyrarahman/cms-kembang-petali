import { CustomerForm } from "@/features/customers/components/CustomerForm";

export default function NewCustomerPage() {
    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-5xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Customer Management
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Add Customer
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Add customer information for
                        future orders and communication.
                    </p>
                </div>

                <CustomerForm />
            </div>
        </main>
    );
}