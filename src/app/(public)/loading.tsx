export default function PublicLoading() {
    return (
        <main className="min-h-screen bg-rose-50">
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="animate-pulse">
                    <div className="h-4 w-32 rounded bg-rose-100" />

                    <div className="mt-5 h-10 max-w-xl rounded bg-rose-100" />

                    <div className="mt-4 h-5 max-w-2xl rounded bg-rose-100" />

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({
                            length: 6,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-2xl border border-rose-100 bg-white"
                            >
                                <div className="aspect-square bg-rose-100" />

                                <div className="space-y-3 p-5">
                                    <div className="h-5 w-3/4 rounded bg-gray-100" />

                                    <div className="h-4 w-1/2 rounded bg-gray-100" />

                                    <div className="h-5 w-1/3 rounded bg-gray-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}