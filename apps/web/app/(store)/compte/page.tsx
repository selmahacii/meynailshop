'use client';

import { useState } from 'react';
import { User, Phone, Mail, Edit2, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useAuthStore();

    if (!user) {
        return (
            <div className="bg-white p-12 border border-creme2 shadow-sm flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-or mb-4" size={32} />
                <p className="text-encre3 text-sm">Chargement de votre profil...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 border border-creme2 shadow-sm">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-creme2">
                <h2 className="font-serif text-2xl text-encre">Mes Informations</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs font-bold uppercase tracking-widest text-or hover:text-rouge-mid transition-colors flex items-center"
                >
                    <Edit2 size={14} className="mr-2" />
                    {isEditing ? 'Annuler' : 'Modifier'}
                </button>
            </div>

            <div className="space-y-6">
                {/* Profile Info Form */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-encre3 mb-2">Prénom</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3" />
                            <input
                                type="text"
                                disabled={!isEditing}
                                defaultValue={user.firstName}
                                className={`w-full pl-10 pr-4 py-3 border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-or ${isEditing
                                        ? 'border-creme2 bg-white text-encre'
                                        : 'border-transparent bg-creme2/50 text-encre3'
                                    }`}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-encre3 mb-2">Nom</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3" />
                            <input
                                type="text"
                                disabled={!isEditing}
                                defaultValue={user.lastName}
                                className={`w-full pl-10 pr-4 py-3 border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-or ${isEditing
                                        ? 'border-creme2 bg-white text-encre'
                                        : 'border-transparent bg-creme2/50 text-encre3'
                                    }`}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-encre3 mb-2">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3" />
                            <input
                                type="email"
                                disabled={!isEditing}
                                defaultValue={user.email}
                                className={`w-full pl-10 pr-4 py-3 border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-or ${isEditing
                                        ? 'border-creme2 bg-white text-encre'
                                        : 'border-transparent bg-creme2/50 text-encre3'
                                    }`}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-encre3 mb-2">Téléphone</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3" />
                            <input
                                type="tel"
                                disabled={!isEditing}
                                defaultValue={user.phone || ''}
                                placeholder="Non renseigné"
                                className={`w-full pl-10 pr-4 py-3 border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-or ${isEditing
                                        ? 'border-creme2 bg-white text-encre'
                                        : 'border-transparent bg-creme2/50 text-encre3'
                                    }`}
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="md:col-span-2 flex justify-end mt-4">
                            <button className="bg-rouge-deep hover:bg-rouge-mid text-creme px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-md">
                                Enregistrer les modifications
                            </button>
                        </div>
                    )}
                </form>

                <div className="bg-encre2 p-6 rounded-sm mt-8 border border-creme2">
                    <h3 className="font-serif text-lg text-or mb-2">Changer le mot de passe</h3>
                    <p className="text-xs text-creme3 mb-4">Pour des raisons de sécurité, nous vous conseillons de changer régulièrement votre mot de passe.</p>
                    <button className="border border-or text-or hover:bg-or hover:text-rouge-deep px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all">
                        Modifier
                    </button>
                </div>
            </div>
        </div>
    );
}
