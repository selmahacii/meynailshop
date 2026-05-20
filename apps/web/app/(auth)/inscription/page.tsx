'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/authStore';
import { AuthAPI } from '@/lib/api/client';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        terms: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
        if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
        if (!formData.email.includes('@')) newErrors.email = 'Email invalide';
        if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
        if (formData.password.length < 8) newErrors.password = 'Au moins 8 caractères';
        if (!formData.terms) newErrors.terms = 'Vous devez accepter les conditions';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Veuillez corriger les erreurs');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
            };

            const res = await AuthAPI.register(payload);
            if (res.success) {
                // backend returns created user and tokens
                const data = res.data;
                if (data && data.user) {
                    setUser(data.user as any);
                }
                if (data && data.accessToken) {
                    try { localStorage.setItem('accessToken', data.accessToken); } catch (e) {}
                }
                toast.success('Compte créé avec succès !');
                router.push('/connexion?registered=true');
            } else {
                toast.error(res.error || 'Erreur lors de la création du compte');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Erreur lors de la création du compte');
        } finally {
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
                <h2 className="font-italiana text-xl text-encre font-bold tracking-[0.05em] uppercase">Rejoignez l'univers MEEY</h2>
            </div>

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
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className={`appearance-none block w-full px-3.5 py-3 border rounded-lg text-encre bg-creme/10 placeholder-encre3/35 focus:bg-white focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all duration-300 shadow-sm ${
                                errors.firstName ? 'border-rouge' : 'border-gold-brand/15'
                            }`}
                            placeholder="Sarah"
                        />
                        {errors.firstName && <p className="text-rouge text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-encre3 mb-2">
                            Nom
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className={`appearance-none block w-full px-3.5 py-3 border rounded-lg text-encre bg-creme/10 placeholder-encre3/35 focus:bg-white focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all duration-300 shadow-sm ${
                                errors.lastName ? 'border-rouge' : 'border-gold-brand/15'
                            }`}
                            placeholder="Naili"
                        />
                        {errors.lastName && <p className="text-rouge text-xs mt-1">{errors.lastName}</p>}
                    </div>
                </div>

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
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg text-encre bg-creme/10 placeholder-encre3/35 focus:bg-white focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all duration-300 shadow-sm ${
                                errors.email ? 'border-rouge' : 'border-gold-brand/15'
                            }`}
                            placeholder="votre@email.com"
                        />
                    </div>
                    {errors.email && <p className="text-rouge text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-encre3 mb-2">
                        Téléphone
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-encre3/60">
                            <Phone size={18} strokeWidth={1.5} />
                        </div>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg text-encre bg-creme/10 placeholder-encre3/35 focus:bg-white focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all duration-300 shadow-sm ${
                                errors.phone ? 'border-rouge' : 'border-gold-brand/15'
                            }`}
                            placeholder="05 XX XX XX XX"
                        />
                    </div>
                    {errors.phone && <p className="text-rouge text-xs mt-1">{errors.phone}</p>}
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
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg text-encre bg-creme/10 placeholder-encre3/35 focus:bg-white focus:outline-none focus:ring-1 focus:ring-or focus:border-or sm:text-sm transition-all duration-300 shadow-sm ${
                                errors.password ? 'border-rouge' : 'border-gold-brand/15'
                            }`}
                            placeholder="••••••••"
                        />
                    </div>
                    <p className="mt-1.5 text-[10px] text-encre3/60 italic">8 caractères minimum, une majuscule et un chiffre.</p>
                    {errors.password && <p className="text-rouge text-xs mt-1">{errors.password}</p>}
                </div>

                <div className="flex items-center">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={formData.terms}
                        onChange={handleChange}
                        className="h-4 w-4 text-or focus:ring-or border-gold-brand/20 rounded cursor-pointer"
                    />
                    <label htmlFor="terms" className="ml-2 block text-xs text-encre3 cursor-pointer">
                        J'accepte les <Link href="/cgv" className="text-rouge-mid hover:underline font-semibold">conditions générales</Link> et la politique de confidentialité.
                    </label>
                </div>
                {errors.terms && <p className="text-rouge text-xs">{errors.terms}</p>}

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-md text-xs font-semibold uppercase tracking-widest text-creme bg-rouge-brand hover:bg-or hover:text-rouge-brand transition-all duration-300 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Création...' : 'Créer mon compte'}
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <Link
                    href="/connexion"
                    className="inline-flex items-center text-xs font-semibold text-encre3 hover:text-or transition-colors uppercase tracking-widest group"
                >
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} />
                    Retour à la connexion
                </Link>
            </div>
        </div>
    );
}
