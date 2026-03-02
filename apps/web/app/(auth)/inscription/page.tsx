'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            toast.success('Votre compte a été créé avec succès !');
            router.push('/connexion');
        }, 1500);
    };

    return (
        <div className="bg-white py-10 px-4 shadow-xl border border-creme2 sm:rounded-lg sm:px-10">
            <h2 className="text-center text-2xl font-serif text-encre mb-8">Rejoignez l'univers MEEY</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wider text-encre3 mb-2">
                            Prénom
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            className="appearance-none block w-full px-3 py-3 border border-creme2 text-encre placeholder-encre3/50 focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all"
                            placeholder="Sarah"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-encre3 mb-2">
                            Nom
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            className="appearance-none block w-full px-3 py-3 border border-creme2 text-encre placeholder-encre3/50 focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all"
                            placeholder="Naili"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-encre3 mb-2">
                        Adresse Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-encre3">
                            <Mail size={18} strokeWidth={1.5} />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-creme2 text-encre placeholder-encre3/50 focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all"
                            placeholder="votre@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-encre3 mb-2">
                        Téléphone
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-encre3">
                            <Phone size={18} strokeWidth={1.5} />
                        </div>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            required
                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-creme2 text-encre placeholder-encre3/50 focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all"
                            placeholder="05 XX XX XX XX"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-encre3 mb-2">
                        Mot de passe
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-encre3">
                            <Lock size={18} strokeWidth={1.5} />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-creme2 text-encre placeholder-encre3/50 focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <p className="mt-1 text-[10px] text-encre3/60 italic">8 caractères minimum, une majuscule et un chiffre.</p>
                </div>

                <div className="flex items-center">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-or focus:ring-or border-creme2 rounded cursor-pointer"
                    />
                    <label htmlFor="terms" className="ml-2 block text-xs text-encre3">
                        J'accepte les <Link href="/cgv" className="text-rouge-mid hover:underline">conditions générales</Link> et la politique de confidentialité.
                    </label>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-sm shadow-sm text-sm font-semibold uppercase tracking-widest text-creme bg-rouge-deep hover:bg-rouge-mid transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Création...' : 'Créer mon compte'}
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <Link
                    href="/connexion"
                    className="inline-flex items-center text-sm font-medium text-encre3 hover:text-or transition-colors group"
                >
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} />
                    Retour à la connexion
                </Link>
            </div>
        </div>
    );
}
