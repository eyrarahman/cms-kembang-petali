import Link from "next/link";
import { Dancing_Script } from "next/font/google";

type NavbarProps = {
    businessName: string;
    variant?: "default" | "hero";
};

const dancingScript = Dancing_Script({
    subsets: ["latin"],
    weight: ["600", "700"],
});


export function Navbar({
    businessName,
    variant = "default",
}: NavbarProps) {
    const isHero =
        variant === "hero";

    return (
        <header
            className={
                isHero
                    ? "bg-[#9f3658]"
                    : "border-b border-rose-100 bg-white"
            }
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link
                    href="/"
                    className={`${dancingScript.className} text-3xl font-bold transition ${isHero
                        ? "text-white hover:text-rose-100"
                        : "text-rose-500 hover:text-rose-600"
                        }`}
                >
                    {businessName}
                </Link>

                <div
                    className={`flex items-center gap-6 text-sm font-medium ${isHero
                        ? "text-rose-100"
                        : "text-gray-700"
                        }`}
                >
                    <Link
                        href="/"
                        className={
                            isHero
                                ? "transition hover:text-white"
                                : "transition hover:text-rose-500"
                        }
                    >
                        Home
                    </Link>

                    <Link
                        href="/catalog"
                        className={
                            isHero
                                ? "transition hover:text-white"
                                : "transition hover:text-rose-500"
                        }
                    >
                        Catalog
                    </Link>

                    <Link
                        href="/about"
                        className={
                            isHero
                                ? "transition hover:text-white"
                                : "transition hover:text-rose-500"
                        }
                    >
                        About
                    </Link>

                    <Link
                        href="/contact"
                        className={
                            isHero
                                ? "transition hover:text-white"
                                : "transition hover:text-rose-500"
                        }
                    >
                        Contact
                    </Link>
                </div>
            </nav>
        </header>
    );
}