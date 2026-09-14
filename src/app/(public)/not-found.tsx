import Link from "next/link";

export default function PublicNotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-rose-50 px-6">
            <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                    404
                </p>

                <h1 className="mt-4 text-3xl font-bold text-gray-900">
                    Page Not Found
                </h1>

                <p className="mt-4 text-sm leading-6 text-gray-500">
                    The page you&apos;re looking for
                    doesn&apos;t exist or may have
                    been moved.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/"
                        className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-600"
                    >
                        Back to Home
                    </Link>

                    <Link
                        href="/catalog"
                        className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-medium text-rose-500 transition hover:bg-rose-50"
                    >
                        Browse Catalog
                    </Link>
                </div>
            </div>
        </main>
    );
}