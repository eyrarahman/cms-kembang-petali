"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DeleteCustomerButton } from "./DeleteCustomerButton";

import {
    Customer,
    CustomerStatus,
} from "../types/customer.types";

type AdminCustomersScreenProps = {
    customers: Customer[];
};

type StatusFilter =
    | "all"
    | CustomerStatus;

export function AdminCustomersScreen({
    customers,
}: AdminCustomersScreenProps) {
    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    const filteredCustomers =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return customers.filter(
                (customer) => {
                    const matchesSearch =
                        !query ||
                        customer.name
                            .toLowerCase()
                            .includes(query) ||
                        customer.customerCode
                            .toLowerCase()
                            .includes(query) ||
                        customer.phone
                            .toLowerCase()
                            .includes(query) ||
                        customer.email
                            ?.toLowerCase()
                            .includes(query);

                    const matchesStatus =
                        statusFilter === "all" ||
                        customer.status ===
                        statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            customers,
            search,
            statusFilter,
        ]);

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                            Customer Management
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-gray-900">
                            Customers
                        </h1>

                        <p className="mt-3 text-gray-600">
                            Manage customer information
                            for orders and communication.
                        </p>
                    </div>

                    <Link
                        href="/admin/customers/new"
                        className="shrink-0 rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white hover:bg-rose-600"
                    >
                        + Add Customer
                    </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search name, customer code, phone or email..."
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                    />

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target
                                    .value as StatusFilter
                            )
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                    >
                        <option value="all">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>
                    </select>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-rose-100 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-100 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Phone
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredCustomers.map(
                                    (customer) => (
                                        <tr key={customer.id}>
                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-gray-900">
                                                    {customer.name}
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-gray-500">
                                                    {
                                                        customer.customerCode
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-gray-700">
                                                {customer.phone}
                                            </td>

                                            <td className="px-6 py-5 text-sm text-gray-700">
                                                {customer.email ??
                                                    "—"}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                    {customer.status ===
                                                        "active"
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-4">
                                                    <Link
                                                        href={`/admin/customers/${customer.id}/edit`}
                                                        className="text-sm font-medium text-rose-500 hover:text-rose-600"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <DeleteCustomerButton
                                                        customerId={customer.id}
                                                        customerName={customer.name}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredCustomers.length ===
                        0 && (
                            <div className="p-12 text-center">
                                <p className="font-medium text-gray-600">
                                    No customers found.
                                </p>

                                <p className="mt-2 text-sm text-gray-400">
                                    {customers.length === 0
                                        ? "Add your first customer to get started."
                                        : "Try a different search or status filter."}
                                </p>
                            </div>
                        )}
                </div>

                <p className="mt-4 text-sm text-gray-400">
                    Showing{" "}
                    {filteredCustomers.length} of{" "}
                    {customers.length} customers
                </p>
            </div>
        </main>
    );
}