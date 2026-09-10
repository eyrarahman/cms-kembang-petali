import { AdminCustomersScreen } from "@/features/customers/components/AdminCustomersScreen";
import { getCustomers } from "@/features/customers/services/customer.service";

export default async function AdminCustomersPage() {
    const customers =
        await getCustomers();

    return (
        <AdminCustomersScreen
            customers={customers}
        />
    );
}