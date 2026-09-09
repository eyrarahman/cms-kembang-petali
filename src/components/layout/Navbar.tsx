import Link from "next/link";

export function Navbar() {
    return (
        <header className="border-b border-rose-100 bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-xl font-bold text-rose-500">
                    Kembang Petali
                </Link>

                <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
                    <Link href="/" className="hover:text-rose-500">
                        Home
                    </Link>

                    <Link href="/catalog" className="hover:text-rose-500">
                        Catalog
                    </Link>

                    <Link href="/about" className="hover:text-rose-500">
                        About
                    </Link>

                    <Link href="/contact" className="hover:text-rose-500">
                        Contact
                    </Link>
                </div>
            </nav>
        </header>
    );
}