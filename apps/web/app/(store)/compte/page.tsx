'use client';

import { useState } from 'react';
import { User, Phone, Mail, Edit2, Loader2, Save, X, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { AuthAPI } from '@/lib/api/client';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user, setUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    if (!user) {
        return (
            <div className="bg-white p-12 border border-creme2 shadow-sm flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-or mb-4" size={32} />
                <p className="text-encre3 text-sm">Chargement de votre profil...</p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await AuthAPI.updateProfile(formData);
            if (res.success) {
                toast.success('Profil mis à jour avec succès');
                setUser(res.data);
                setIsEditing(false);
            } else {
                toast.error(res.error || 'Erreur lors de la mise à jour');
            }
        } catch (err) {
            toast.error('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="bg-white p-8 border border-creme2 shadow-sm">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-creme2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rouge-brand/10 flex items-center justify-center text-rouge-brand">
                        <User size={20} />
                    </div>
                    <h2 className="font-serif text-2xl text-encre">Mes Informations</h2>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 border border-creme2 text-[10px] font-black uppercase tracking-[0.2em] text-encre hover:bg-creme transition-all flex items-center rounded-sm"
                    >
                        <Edit2 size={12} className="mr-2" />
                        Modifier
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-encre3 hover:text-rouge transition-all"
                        >
                            Annuler
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-8">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-encre3">Prénom</label>
                        <div className="relative group">
                            <User size={16} className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                                isEditing ? "text-or" : "text-encre3/40"
                            )} />
                            <input
                                name="firstName"
                                type="text"
                                disabled={!isEditing}
                                value={formData.firstName}
                                onChange={handleChange}
                                className={cn(
                                    "w-full pl-12 pr-4 py-4 border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-or rounded-sm",
                                    isEditing 
                                        ? "border-or bg-white text-encre shadow-sm"
                                        : "border-transparent bg-creme2/20 text-encre3 font-medium cursor-not-allowed"
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-encre3">Nom</label>
                        <div className="relative group">
                            <User size={16} className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                                isEditing ? "text-or" : "text-encre3/40"
                            )} />
                            <input
                                name="lastName"
                                type="text"
                                disabled={!isEditing}
                                value={formData.lastName}
                                onChange={handleChange}
                                className={cn(
                                    "w-full pl-12 pr-4 py-4 border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-or rounded-sm",
                                    isEditing 
                                        ? "border-or bg-white text-encre shadow-sm"
                                        : "border-transparent bg-creme2/20 text-encre3 font-medium cursor-not-allowed"
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-encre3">Adresse Email</label>
                        <div className="relative group">
                            <Mail size={16} className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                                isEditing ? "text-or" : "text-encre3/40"
                            )} />
                            <input
                                name="email"
                                type="email"
                                disabled={!isEditing || true} // Email modification often disabled for security
                                value={formData.email}
                                className={cn(
                                    "w-full pl-12 pr-4 py-4 border text-sm transition-all focus:outline-none rounded-sm",
                                    "border-transparent bg-creme2/20 text-encre3 font-medium cursor-not-allowed"
                                )}
                                title="L'adresse email ne peut pas être modifiée"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-encre3">Téléphone</label>
                        <div className="relative group">
                            <Phone size={16} className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                                isEditing ? "text-or" : "text-encre3/40"
                            )} />
                            <input
                                name="phone"
                                type="tel"
                                disabled={!isEditing}
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="07xx xx xx xx"
                                className={cn(
                                    "w-full pl-12 pr-4 py-4 border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-or rounded-sm",
                                    isEditing 
                                        ? "border-or bg-white text-encre shadow-sm"
                                        : "border-transparent bg-creme2/20 text-encre3 font-medium cursor-not-allowed"
                                )}
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="md:col-span-2 flex justify-end pt-4">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="bg-encre hover:bg-rouge-deep text-creme px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-50 flex items-center gap-3 rounded-sm"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Enregistrer les modifications
                            </button>
                        </div>
                    )}
                </form>

                <div className="bg-rouge-brand/5 p-8 border border-rouge-brand/10 group mt-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="font-serif text-xl text-encre mb-2">Sécurité du compte</h3>
                            <p className="text-xs text-encre3 font-medium opacity-70">Protégez votre compte en mettant régulièrement à jour votre mot de passe.</p>
                        </div>
                        <button className="px-8 py-3 border-2 border-rouge-brand text-rouge-brand hover:bg-rouge-brand hover:text-creme transition-all text-[10px] font-black uppercase tracking-widest rounded-sm group-hover:shadow-md">
                            Changer mon mot de passe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
