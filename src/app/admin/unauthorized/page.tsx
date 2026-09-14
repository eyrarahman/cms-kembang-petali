import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-rose-50 px-6">
            <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                    Access Denied
                </p>

                <h1 className="mt-4 text-3xl font-bold text-gray-900">
                    Admin access required.
                </h1>

                <p className="mt-4 text-sm leading-6 text-gray-500">
                    Your account is authenticated,
                    but it does not have permission
                    to access the Admin CMS.
                </p>

                <Link
                    href="/"
                    className="mt-8 inline-block rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-600"
                >
                    Back to Website
                </Link>
            </div>
        </main>
    );
}