import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
    children: ReactNode;
    variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}: ButtonProps) {
    const baseClass =
        "rounded-full px-6 py-3 font-medium transition";

    const variantClass = {
        primary:
            "bg-rose-500 text-white hover:bg-rose-600",

        secondary:
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    };

    return (
        <button
            className={`${baseClass} ${variantClass[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}