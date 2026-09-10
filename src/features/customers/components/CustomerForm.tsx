"use client";

import {
    FocusEvent,
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import {
    checkCustomerPhoneDuplicates,
    createCustomer,
    updateCustomer,
} from "../services/customer-admin.service";

import {
    Customer,
    CustomerStatus,
} from "../types/customer.types";

type CustomerFormProps = {
    mode?: "create" | "edit";
    customer?: Customer;
};

export function CustomerForm({
    mode = "create",
    customer,
}: CustomerFormProps) {
    const router = useRouter();

    const [name, setName] =
        useState(
            customer?.name ?? ""
        );

    const [phone, setPhone] =
        useState(
            customer?.phone ?? ""
        );

    const [email, setEmail] =
        useState(
            customer?.email ?? ""
        );

    const [status, setStatus] =
        useState<CustomerStatus>(
            customer?.status ?? "active"
        );

    const [notes, setNotes] =
        useState(
            customer?.notes ?? ""
        );

    const [
        duplicateCustomers,
        setDuplicateCustomers,
    ] = useState<Customer[]>([]);

    const [
        isCheckingPhone,
        setIsCheckingPhone,
    ] = useState(false);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function handlePhoneBlur(
        event: FocusEvent<HTMLInputElement>
    ) {
        const value =
            event.target.value.trim();

        if (!value) {
            setDuplicateCustomers([]);
            return;
        }

        try {
            setIsCheckingPhone(true);

            const duplicates =
                await checkCustomerPhoneDuplicates(
                    value,
                    customer?.id
                );
            setDuplicateCustomers(
                duplicates
            );
        } catch (error) {
            console.error(
                "Unable to check phone:",
                error
            );
        } finally {
            setIsCheckingPhone(false);
        }
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const formData = {
                name,
                phone,
                email,
                status,
                notes,
            };

            if (
                mode === "edit" &&
                customer
            ) {
                await updateCustomer(
                    customer.id,
                    formData
                );
            } else {
                await createCustomer(
                    formData
                );
            }

            router.push(
                "/admin/customers"
            );

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                setError(
                    error.message
                );
            } else {
                setError(
                    "Unable to create customer."
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-8"
        >
            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Customer Information
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Customer Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            required
                            placeholder="Example: Nur Aina"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Phone
                        </label>

                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(event) => {
                                setPhone(
                                    event.target.value
                                );

                                setDuplicateCustomers(
                                    []
                                );
                            }}
                            onBlur={
                                handlePhoneBlur
                            }
                            required
                            placeholder="Example: 0123456789"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                        />

                        {isCheckingPhone && (
                            <p className="mt-2 text-xs text-gray-400">
                                Checking phone number...
                            </p>
                        )}
                    </div>
                </div>

                {duplicateCustomers.length >
                    0 && (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm font-semibold text-amber-800">
                                This phone number is
                                already used by:
                            </p>

                            <div className="mt-2 space-y-1">
                                {duplicateCustomers.map(
                                    (customer) => (
                                        <p
                                            key={
                                                customer.id
                                            }
                                            className="text-sm text-amber-700"
                                        >
                                            {
                                                customer.customerCode
                                            }{" "}
                                            — {customer.name}
                                        </p>
                                    )
                                )}
                            </div>

                            <p className="mt-3 text-xs text-amber-700">
                                You can still save this
                                customer if the phone
                                number is intentionally
                                shared.
                            </p>
                        </div>
                    )}

                <div className="mt-6">
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        placeholder="Optional"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                    />
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="status"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>

                    <select
                        id="status"
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target
                                    .value as CustomerStatus
                            )
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400 md:max-w-sm"
                    >
                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>
                    </select>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="notes"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Notes
                    </label>

                    <textarea
                        id="notes"
                        rows={4}
                        value={notes}
                        onChange={(event) =>
                            setNotes(
                                event.target.value
                            )
                        }
                        placeholder="Optional notes about this customer..."
                        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                    />
                </div>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                        router.push(
                            "/admin/customers"
                        )
                    }
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Saving..."
                        : mode === "edit"
                            ? "Update Customer"
                            : "Save Customer"}
                </Button>
            </div>
        </form>
    );
}