import HeroSection from '@/components/store/home/HeroSection';

export default function HomePage() {
    return (
        <div className="bg-creme min-h-screen">
            <HeroSection />

            {/* Featured Sections Scaffolding */}
            <section className="py-24 container mx-auto px-4">
                <div className="flex flex-col items-center mb-16">
                    <h2 className="font-serif text-4xl text-encre mb-4">Nos Catégories</h2>
                    <div className="w-20 h-1 bg-or"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {['Vernis Gel', 'Gel UV', 'Finition', 'Matériel', 'Décoration'].map((cat) => (
                        <div key={cat} className="group cursor-pointer relative aspect-[4/5] overflow-hidden bg-encre2">
                            <div className="absolute inset-0 bg-gradient-to-t from-encre via-transparent to-transparent z-10 opacity-70"></div>
                            <div className="absolute inset-0 flex items-end justify-center pb-8 z-20">
                                <span className="text-creme font-medium text-lg border-b border-transparent group-hover:border-or group-hover:text-or transition-all duration-300">
                                    {cat}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Best Sellers Scaffolding */}
            <section className="py-24 bg-creme2">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="font-serif text-4xl text-encre mb-2">Meilleures Ventes</h2>
                            <p className="text-encre3 text-sm">Les indispensables plébiscités par nos clientes</p>
                        </div>
                        <Link href="/catalogue" className="text-rouge-mid font-medium hover:text-rouge hover:underline">
                            Tout voir →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-4 shadow-sm group">
                                <div className="aspect-square bg-creme mb-6 overflow-hidden">
                                    {/* Placeholder for product image */}
                                </div>
                                <h3 className="font-serif text-lg mb-1 group-hover:text-or transition-colors">Produit Premium {i}</h3>
                                <p className="text-encre3 text-sm mb-4">Soin & Beauté</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-encre">1 800 DA</span>
                                    <button className="text-or hover:text-rouge-mid font-semibold text-sm">Ajouter</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

import Link from 'next/link';
