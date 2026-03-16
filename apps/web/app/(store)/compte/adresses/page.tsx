'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Home, Briefcase, User as UserIcon, Phone, Map, Navigation, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { apiGet, apiPost, apiDelete } from '@/lib/api/client';

interface Address {
    id: string;
    label: string;
    fullName: string;
    phone: string;
    wilaya: string;
    commune: string;
    address: string;
    postalCode: string;
    isDefault: boolean;
}

export default function AddressBookPage() {
    const { user } = useAuthStore();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        label: 'Maison',
        fullName: '',
        phone: '',
        wilaya: '',
        commune: '',
        address: '',
        postalCode: '',
        isDefault: false
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ 
                ...prev, 
                fullName: `${user.firstName} ${user.lastName}`, 
                phone: user.phone || '' 
            }));
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await apiGet<Address[]>(`/api/users/${user.id}/addresses`);
            if (res.success) {
                setAddresses(res.data || []);
            }
        } catch (error) {
            console.error('Fetch addresses error:', error);
            toast.error('Erreur lors de la récupération des adresses');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const res = await apiPost<Address>(`/api/users/${user.id}/addresses`, formData);

            if (res.success) {
                toast.success('Adresse ajoutée avec succès');
                setIsAdding(false);
                fetchAddresses();
                // Reset form
                setFormData({
                    label: 'Maison',
                    fullName: `${user.firstName} ${user.lastName}`,
                    phone: user.phone || '',
                    wilaya: '',
                    commune: '',
                    address: '',
                    postalCode: '',
                    isDefault: false
                });
            } else {
                toast.error(res.error || 'Erreur lors de l\'ajout');
            }
        } catch (error) {
            toast.error('Erreur réseau');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user) return;
        setRemovingId(id);
        try {
            const res = await apiDelete(`/api/users/${user.id}/addresses/${id}`);
            if (res.success) {
                toast.success('Adresse supprimée');
                setAddresses(prev => prev.filter(a => a.id !== id));
            }
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        } finally {
            setRemovingId(null);
        }
    };

    const getIcon = (label: string) => {
        switch (label.toLowerCase()) {
            case 'maison': return <Home size={18} />;
            case 'travail':
            case 'bureau': return <Briefcase size={18} />;
            default: return <MapPin size={18} />;
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-creme2">
                <AlertCircle size={40} className="text-encre3/30 mb-4" />
                <p className="text-encre3">Veuillez vous connecter pour voir vos adresses.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 border border-creme2 shadow-sm min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-creme2 gap-4">
                <h2 className="font-serif text-2xl text-encre">Carnet d'adresses</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center space-x-2 bg-or hover:bg-rouge-deep text-creme px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-md active:scale-95"
                    >
                        <Plus size={16} />
                        <span>Nouvelle Adresse</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode='popLayout'>
                    {isAdding && (
                        <motion.div
                            key="add-form"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="md:col-span-2 bg-creme2/30 p-8 border border-or/20 rounded-sm mb-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-serif text-xl text-encre">Ajouter une adresse</h3>
                                <button onClick={() => setIsAdding(false)} className="text-encre3 hover:text-rouge-brand text-xs font-bold uppercase tracking-widest">Annuler</button>
                            </div>

                            <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-encre3 mb-2">Type d'adresse</label>
                                    <div className="flex space-x-4">
                                        {['Maison', 'Travail', 'Autre'].map(l => (
                                            <button
                                                key={l}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, label: l })}
                                                className={`flex items-center space-x-2 px-4 py-2 border text-xs font-bold transition-all ${formData.label === l ? 'bg-or border-or text-white' : 'border-creme2 text-encre3 hover:border-or/50'}`}
                                            >
                                                {getIcon(l)}
                                                <span>{l}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-encre3 mb-2">Nom Complet</label>
                                    <div className="relative">
                                        <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3/50" />
                                        <input
                                            required
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-creme2 text-sm focus:ring-1 focus:ring-or focus:border-or outline-none transition-all"
                                            placeholder="Ex: Sarah Naili"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-encre3 mb-2">Téléphone</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3/50" />
                                        <input
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-creme2 text-sm focus:ring-1 focus:ring-or focus:border-or outline-none transition-all"
                                            placeholder="Ex: 0550XXXXXX"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-encre3 mb-2">Wilaya</label>
                                    <div className="relative">
                                        <Map size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3/50" />
                                        <input
                                            required
                                            value={formData.wilaya}
                                            onChange={e => setFormData({ ...formData, wilaya: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-creme2 text-sm focus:ring-1 focus:ring-or focus:border-or outline-none transition-all"
                                            placeholder="Ex: Alger"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-encre3 mb-2">Commune</label>
                                    <div className="relative">
                                        <Navigation size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3/50" />
                                        <input
                                            required
                                            value={formData.commune}
                                            onChange={e => setFormData({ ...formData, commune: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-creme2 text-sm focus:ring-1 focus:ring-or focus:border-or outline-none transition-all"
                                            placeholder="Ex: Kouba"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-encre3 mb-2">Adresse Précise</label>
                                    <textarea
                                        required
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-3 border border-creme2 text-sm focus:ring-1 focus:ring-or focus:border-or outline-none transition-all min-h-[100px]"
                                        placeholder="Numéro de rue, bâtiment, étage..."
                                    />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={formData.isDefault}
                                        onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                                        className="w-4 h-4 text-or focus:ring-or border-creme2 rounded cursor-pointer"
                                    />
                                    <label htmlFor="isDefault" className="text-sm text-encre3 cursor-pointer">Définir comme adresse par défaut</label>
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-rouge-deep hover:bg-rouge-mid text-white py-4 text-xs font-bold uppercase tracking-widest shadow-lg transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Ajouter l'adresse</span>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {!loading && addresses.length === 0 && !isAdding && (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="md:col-span-2 text-center py-20 border-2 border-dashed border-creme2 rounded-sm"
                        >
                            <div className="w-16 h-16 bg-creme2 flex items-center justify-center rounded-full mx-auto mb-6 text-encre3/30">
                                <MapPin size={32} />
                            </div>
                            <h3 className="font-serif text-xl text-encre mb-2">Aucune adresse enregistrée</h3>
                            <p className="text-sm text-encre3 max-w-sm mx-auto mb-8">Ajoutez une adresse pour faciliter vos prochaines commandes.</p>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="text-or hover:text-rouge-brand font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2 mx-auto"
                            >
                                <Plus size={16} />
                                <span>Ajouter ma première adresse</span>
                            </button>
                        </motion.div>
                    )}

                    {addresses.map((address) => (
                        <motion.div
                            key={address.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            layout
                            className={`relative p-6 border transition-all duration-300 group ${address.isDefault ? 'border-or bg-or/5 shadow-md' : 'border-creme2 hover:border-or/40 hover:shadow-sm'}`}
                        >
                            {address.isDefault && (
                                <div className="absolute top-4 right-4 flex items-center space-x-1 text-or px-2 py-0.5 bg-white border border-or/20 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm">
                                    <CheckCircle2 size={10} />
                                    <span>Par défaut</span>
                                </div>
                            )}

                            <div className="flex items-center space-x-3 mb-4 text-or">
                                <div className="w-10 h-10 bg-white border border-or/10 rounded-full flex items-center justify-center shadow-sm group-hover:bg-or group-hover:text-white transition-all">
                                    {getIcon(address.label)}
                                </div>
                                <div>
                                    <h4 className="font-serif text-lg text-encre leading-none mb-1">{address.label}</h4>
                                    <p className="text-[10px] uppercase font-black text-encre3/50 tracking-[0.2em]">{address.fullName}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-start text-sm text-encre3">
                                    <Navigation size={14} className="mt-1 mr-3 shrink-0 text-or/60" />
                                    <p>{address.address}, {address.commune}, {address.wilaya}</p>
                                </div>
                                <div className="flex items-center text-sm text-encre3">
                                    <Phone size={14} className="mr-3 shrink-0 text-or/60" />
                                    <p>{address.phone}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-creme2">
                                <button className="text-[10px] font-bold uppercase tracking-widest text-encre3 hover:text-or transition-colors">Modifier</button>
                                <button
                                    onClick={() => handleDelete(address.id)}
                                    disabled={removingId === address.id}
                                    className="text-[10px] font-bold uppercase tracking-widest text-rouge-mid hover:text-rouge transition-colors flex items-center space-x-1"
                                >
                                    {removingId === address.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={14} />}
                                    <span>Supprimer</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {loading && addresses.length === 0 && !isAdding && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-or mb-4" size={32} />
                    <p className="text-sm text-encre3">Chargement de vos adresses...</p>
                </div>
            )}
        </div>
    );
}
