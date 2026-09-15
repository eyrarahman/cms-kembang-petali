"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LogoutButton } from "@/features/auth/components/LogoutButton";

const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Products", href: "/admin/products" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Materials", href: "/admin/materials" },
    { name: "Product Recipes", href: "/admin/recipes" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Calendar", href: "/admin/calendar" },
    { name: "Customers", href: "/admin/customers" },
    { name: "Capacity", href: "/admin/capacity" },
    { name: "Settings", href: "/admin/settings" },
];

type AdminSidebarProps = {
    businessName: string;
};

export function AdminSidebar({
    businessName,
}: AdminSidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile menu button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="fixed left-4 top-4 z-40 rounded-xl border border-rose-100 bg-white p-3 shadow-sm md:hidden"
                aria-label="Open admin menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                </svg>
            </button>

            {/* Mobile overlay */}
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close admin menu"
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/30 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
                    border-r border-rose-100 bg-white
                    transition-transform duration-300 ease-in-out
                    md:sticky md:translate-x-0
                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                <div className="flex items-start justify-between border-b border-rose-100 px-6 py-6">
                    <div>
                        <Link
                            href="/admin/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="text-xl font-bold text-rose-500"
                        >
                            {businessName}
                        </Link>

                        <p className="mt-1 text-xs text-gray-400">
                            Admin CMS
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 md:hidden"
                        aria-label="Close menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                pathname.startsWith(`${item.href}/`);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-rose-50 text-rose-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="border-t border-rose-100 px-6 py-5">
                    <LogoutButton />
                </div>
            </aside>
        </>
    );
}