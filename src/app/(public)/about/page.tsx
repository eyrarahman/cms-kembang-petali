import { Navbar } from "@/components/layout/Navbar";

import { getBusinessSettings } from "@/features/settings/services/settings.service";

export default async function AboutPage() {
    const settings =
        await getBusinessSettings();

    return (
        <main className="min-h-screen bg-rose-50">
            <Navbar
                businessName={
                    settings.businessName
                }
            />

            <section className="px-6 py-16">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center">
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                            About Us
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
                            About{" "}
                            {settings.businessName}
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
                            Creating meaningful gifts
                            for every special moment.
                        </p>
                    </div>

                    <div className="mt-12 rounded-3xl border border-rose-100 bg-white p-8 sm:p-10">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Our Story
                        </h2>

                        <div className="mt-5 space-y-4 leading-7 text-gray-600">
                            <p>
                                {settings.businessName}{" "}
                                menyediakan pelbagai
                                pilihan bouquet dan
                                hadiah istimewa yang
                                sesuai untuk pelbagai
                                majlis dan kenangan
                                bermakna.
                            </p>

                            <p>
                                Setiap tempahan
                                disediakan dengan
                                teliti supaya setiap
                                hadiah bukan sekadar
                                cantik, tetapi turut
                                membawa makna kepada
                                penerimanya.
                            </p>

                            <p>
                                Daripada graduation,
                                birthday, anniversary
                                sehingga surprise
                                untuk insan tersayang,
                                kami berharap dapat
                                menjadi sebahagian
                                daripada setiap
                                momen istimewa anda.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                        <AboutCard
                            title="Thoughtful"
                            description="Hadiah yang dipilih dan disediakan untuk menjadikan setiap momen lebih bermakna."
                        />

                        <AboutCard
                            title="Personal"
                            description="Pelbagai pilihan produk yang boleh disesuaikan mengikut majlis dan penerima."
                        />

                        <AboutCard
                            title="Made With Care"
                            description="Setiap tempahan diberi perhatian dari penyediaan sehingga siap untuk diberikan."
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

type AboutCardProps = {
    title: string;
    description: string;
};

function AboutCard({
    title,
    description,
}: AboutCardProps) {
    return (
        <div className="rounded-2xl border border-rose-100 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
                {description}
            </p>
        </div>
    );
}