"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/features/auth/components/LogoutButton";

const menuItems = [
    {
        name: "Dashboard",
        href: "/admin/dashboard",
    },
    {
        name: "Products",
        href: "/admin/products",
    },
    {
        name: "Categories",
        href: "/admin/categories",
    },
    {
        name: "Materials",
        href: "/admin/materials",
    },
    {
        name: "Product Recipes",
        href: "/admin/recipes",
    },
    {
        name: "Orders",
        href: "/admin/orders",
    },
    {
        name: "Calendar",
        href: "/admin/calendar",
    },
    {
        name: "Customers",
        href: "/admin/customers",
    },
    {
        name: "Capacity",
        href: "/admin/capacity",
    },
    {
        name: "Settings",
        href: "/admin/settings",
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-rose-100 bg-white">
            <div className="border-b border-rose-100 px-6 py-6">
                <Link
                    href="/admin/dashboard"
                    className="text-xl font-bold text-rose-500"
                >
                    Kembang Petali
                </Link>

                <p className="mt-1 text-xs text-gray-400">
                    Admin CMS
                </p>
            </div>

            <nav className="flex-1 px-4 py-6">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
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
    );
}