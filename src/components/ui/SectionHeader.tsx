type SectionHeaderProps = {
    eyebrow?: string;
    title: string;
    description?: string;
};

export function SectionHeader({
    eyebrow,
    title,
    description,
}: SectionHeaderProps) {
    return (
        <div className="mx-auto max-w-2xl text-center">
            {eyebrow && (
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                    {eyebrow}
                </p>
            )}

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {title}
            </h2>

            {description && (
                <p className="mt-4 text-gray-600">
                    {description}
                </p>
            )}
        </div>
    );
}