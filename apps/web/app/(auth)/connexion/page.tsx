'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/authStore';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';
    const setUser = useAuthStore((state) => state.setUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call the real API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Include cookies
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message || 'Connexion échouée');
                setLoading(false);
                return;
            }

            const result = await response.json();
            const authData = result.data || result;
            
            // Extract accessToken and user data from the flat object
            const accessToken = authData.accessToken;
            // The rest of the object is the user data
            const { accessToken: _, refreshToken: __, ...userData } = authData;

            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                document.cookie = `accessToken=${accessToken}; path=/; max-age=86400`;
            }

            if (userData && userData.id) {
                setUser(userData as any);
                toast.success(`Bienvenue, ${userData.firstName || 'Administrateur'} !`);
                
                // Explicit redirect based on role
                if (userData.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push(redirectUrl);
                }
            } else {
                toast.error('Données utilisateur invalides');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Erreur de connexion. Essayez à nouveau.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-white py-10 px-4 shadow-xl border border-creme2 sm:rounded-lg sm:px-10">
            <h2 className="text-center text-2xl font-serif text-encre mb-8">Bonjour, ravie de vous revoir !</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-creme2 text-encre placeholder-encre3/50 focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all"
                            placeholder="votre@email.com"
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
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="appearance-none block w-full pl-10 pr-10 py-3 border border-creme2 text-encre placeholder-encre3/50 focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-encre3 hover:text-or transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-or focus:ring-or border-creme2 rounded cursor-pointer"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-encre3 cursor-pointer">
                            Se souvenir de moi
                        </label>
                    </div>

                    <div className="text-sm">
                        <Link href="/mot-de-passe-oublie" className="font-medium text-rouge-mid hover:text-rouge transition-colors">
                            Oublié ?
                        </Link>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-sm shadow-sm text-sm font-semibold uppercase tracking-widest text-creme bg-rouge-deep hover:bg-rouge-mid focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-or transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Connexion...
                            </span>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-creme2"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-encre3">Pas encore de compte ?</span>
                    </div>
                </div>

                <div className="mt-6 flex flex-col space-y-3">
                    <Link
                        href="/inscription"
                        className="w-full flex justify-center py-3 px-4 border border-rouge-deep text-rouge-deep text-sm font-semibold uppercase tracking-widest hover:bg-rouge-deep hover:text-creme transition-all duration-300 group"
                    >
                        Créer un compte
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="bg-white py-10 px-4 shadow-xl border border-creme2 sm:rounded-lg sm:px-10">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-or mx-auto"></div>
                    <p className="mt-4 text-encre3">Chargement...</p>
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
