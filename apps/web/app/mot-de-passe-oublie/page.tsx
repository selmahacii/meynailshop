'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSent(true);
            toast.success('Email de réinitialisation envoyé !');
        } catch (error) {
            toast.error('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FAF5EF] to-[#F5EFEA] flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h1 className="text-2xl font-serif text-encre mb-4">Email envoyé !</h1>

                        <p className="text-encre3 mb-6">
                            Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>.
                            Vérifiez votre boîte mail et cliquez sur le lien pour créer un nouveau mot de passe.
                        </p>

                        <p className="text-sm text-encre3/70 mb-6">
                            Si vous ne recevez pas l'email dans les 5 minutes, vérifiez votre dossier spam.
                        </p>

                        <div className="space-y-3">
                            <Link
                                href="/connexion"
                                className="block w-full bg-or text-encre py-3 px-6 rounded-lg font-semibold hover:bg-encre hover:text-creme transition-colors"
                            >
                                Retour à la connexion
                            </Link>

                            <button
                                onClick={() => setSent(false)}
                                className="block w-full text-encre3 hover:text-or transition-colors text-sm"
                            >
                                Renvoyer l'email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF5EF] to-[#F5EFEA] flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif text-encre mb-4">Mot de passe oublié</h1>
                        <p className="text-encre3">
                            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-encre3 mb-2">
                                Adresse Email *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-encre3" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-creme2 text-encre placeholder-encre3/50 focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all"
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold uppercase tracking-widest text-creme bg-rouge-deep hover:bg-rouge-mid focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-or transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Envoi en cours...
                                </span>
                            ) : (
                                'Envoyer le lien de réinitialisation'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link
                            href="/connexion"
                            className="inline-flex items-center text-sm text-encre3 hover:text-or transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à la connexion
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-encre3/70">
                        Vous n'avez pas de compte ?{' '}
                        <Link href="/inscription" className="text-or hover:underline">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}