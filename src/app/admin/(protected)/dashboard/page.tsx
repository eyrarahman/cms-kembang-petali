export default function AdminDashboardPage() {
    return (
        <main className="px-8 py-10">
            <div className="mx-auto max-w-7xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Overview
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Dashboard
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Manage Kembang Petali business operations.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Products
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            0
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Orders
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            0
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Preparing
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            0
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Ready
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            0
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}