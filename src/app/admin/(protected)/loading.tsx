export default function AdminLoading() {
    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="animate-pulse">
                    <div className="h-4 w-36 rounded bg-rose-100" />

                    <div className="mt-4 h-10 w-64 rounded bg-gray-100" />

                    <div className="mt-3 h-5 max-w-xl rounded bg-gray-100" />

                    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({
                            length: 4,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-rose-100 bg-white p-6"
                            >
                                <div className="h-4 w-24 rounded bg-gray-100" />
                                <div className="mt-4 h-8 w-20 rounded bg-gray-100" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 rounded-2xl border border-rose-100 bg-white p-6">
                        <div className="h-5 w-40 rounded bg-gray-100" />

                        <div className="mt-6 space-y-4">
                            {Array.from({
                                length: 5,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-12 rounded bg-gray-100"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}