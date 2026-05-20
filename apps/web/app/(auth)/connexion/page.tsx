'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/authStore';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';
    const setUser = useAuthStore((state) => state.setUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

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
                const message = error.message || 'Connexion échouée';
                toast.error(message);
                setErrorMsg(message);
                setLoading(false);
                return;
            }

            const result = await response.json();


            // Handle nesting: NestJS often wraps in a 'data' property
            let authData = result.data || result;
            
            // Sometimes it's double wrapped or uses a different structure
            if (authData && authData.user) {
                // Scenario: { accessToken: '...', user: { ... } }
                const userToStore = authData.user;
                const token = authData.accessToken;
                




                if (token) {
                    localStorage.setItem('accessToken', token);
                    document.cookie = `accessToken=${token}; path=/; max-age=259200`;
                }
                
                setUser(userToStore);
                toast.success(`Bienvenue, ${userToStore.firstName || 'Utilisateur'} !`);
                
                if (userToStore.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push(redirectUrl);
                }
            } else {
                // Scenario: Flat object or other structure

                const accessToken = authData.accessToken;
                
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    document.cookie = `accessToken=${accessToken}; path=/; max-age=259200`;
                }

                // If authData itself looks like a user (has id/email/role)
                if (authData.id || authData.email || authData.role) {
                    setUser(authData);
                    toast.success(`Bienvenue !`);
                    
                    if (authData.role === 'admin') {
                        router.push('/admin');
                    } else {
                        router.push(redirectUrl);
                    }
                } else {

                    toast.error('Erreur: Données utilisateur introuvables');
                }
            }
        } catch (error) {

            const message = 'Erreur de connexion. Essayez à nouveau.';
            toast.error(message);
            setErrorMsg(message);
            setLoading(false);
        }
    };

    return (
        <div className="bg-white py-12 px-6 sm:px-10 shadow-2xl border border-gold-brand/10 sm:rounded-2xl bg-gradient-to-b from-white to-creme/25 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-or via-gold-brand to-rouge-brand" />
            <div className="text-center mb-8">
                <span className="font-italiana text-3xl font-normal leading-none text-rouge-brand tracking-[0.2em] block">
                    MEEY
                </span>
                <span className="font-playfair text-[9px] font-normal italic tracking-[0.3em] uppercase text-or leading-none mt-2 block">
                    Nail Shop
                </span>
                <p className="font-playfair italic text-[11px] text-encre3/60 mt-2 mb-6">Maison de Beauté Ongulaire</p>
                <div className="w-16 h-[1px] bg-gold-brand/20 mx-auto mb-6"></div>
                <h2 className="font-italiana text-xl text-encre font-bold tracking-[0.05em] uppercase">Ravi de vous revoir</h2>
            </div>

            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50/50 border-l-4 border-red-500 rounded-r-lg flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle size={18} className="text-red-500 shrink-0" />
                    <p className="text-[11px] font-bold uppercase tracking-tight text-red-900">{errorMsg}</p>
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-encre3 mb-2">
                        Adresse Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-encre3/60">
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
                            className="appearance-none block w-full pl-10 pr-3 py-3.5 border border-gold-brand/15 rounded-lg text-encre bg-creme/10 placeholder-encre3/35 focus:bg-white focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all duration-300 shadow-sm"
                            placeholder="votre@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-encre3 mb-2">
                        Mot de passe
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-encre3/60">
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
                            className="appearance-none block w-full pl-10 pr-10 py-3.5 border border-gold-brand/15 rounded-lg text-encre bg-creme/10 placeholder-encre3/35 focus:bg-white focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all duration-300 shadow-sm"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-encre3/60 hover:text-or transition-colors"
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
                            className="h-4 w-4 text-or focus:ring-or border-gold-brand/20 rounded cursor-pointer"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-xs text-encre3 cursor-pointer">
                            Se souvenir de moi
                        </label>
                    </div>

                    <div className="text-xs">
                        <Link href="/mot-de-passe-oublie" className="font-semibold text-rouge-mid hover:text-rouge transition-colors">
                            Oublié ?
                        </Link>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-md text-xs font-semibold uppercase tracking-widest text-creme bg-rouge-brand hover:bg-or hover:text-rouge-brand transition-all duration-300 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''
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
                        <div className="w-full border-t border-gold-brand/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-encre3/60 font-medium">Pas encore de compte ?</span>
                    </div>
                </div>

                <div className="mt-6 flex flex-col space-y-3">
                    <Link
                        href="/inscription"
                        className="w-full flex justify-center py-3.5 px-4 border border-rouge-brand text-rouge-brand rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-rouge-brand hover:text-creme transition-all duration-300 group"
                    >
                        Créer un compte
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
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
