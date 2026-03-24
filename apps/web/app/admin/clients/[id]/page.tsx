'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ChevronLeft, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    ShoppingBag, 
    Calendar, 
    Star, 
    Loader, 
    AlertCircle,
    ExternalLink,
    TrendingUp,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ClientsAPI } from '@/lib/api/client';
import { formatPrice } from '@/lib/utils/currency';

export default function AdminClientDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [client, setClient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchClientDetails();
    }, [id]);

    const fetchClientDetails = async () => {
        try {
            setLoading(true);
            const result = await ClientsAPI.getById(id as string);
            if (result.success) {
                setClient(result.data);
            } else {
                setError(result.error || 'Impossible de charger les détails du client');
            }
        } catch (err) {
            setError('Erreur réseau lors du chargement des détails');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <Loader className="w-10 h-10 text-or animate-spin mx-auto mb-4" />
                    <p className="text-encre3 font-bold uppercase tracking-widest text-[10px]">Chargement du profil client...</p>
                </div>
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="w-16 h-16 text-rouge mx-auto mb-6" />
                <h2 className="text-2xl font-serif text-encre mb-4">Oups ! Quelque chose s'est mal passé</h2>
                <p className="text-encre3 mb-8">{error || 'Le client est introuvable'}</p>
                <button 
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-encre text-creme rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-rouge-deep transition-all"
                >
                    Retour à la liste
                </button>
            </div>
        );
    }

    const totalOrders = client.orders?.length || 0;
    const totalSpent = client.orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => router.back()}
                    className="p-2 hover:bg-creme rounded-full transition-colors text-encre3"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-serif text-encre">{client.firstName} {client.lastName}</h1>
                    <div className="flex items-center space-x-3 mt-1">
                        <span className="text-encre3 text-[10px] uppercase tracking-widest font-bold">Profil Client</span>
                        <span className="w-1 h-1 bg-creme2 rounded-full"></span>
                        <span className="text-[10px] text-or font-black uppercase tracking-widest">Client depuis {new Date(client.createdAt).getFullYear()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Infos & Stats */}
                <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden">
                        <div className="p-8 pb-0 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rouge-deep to-rouge-mid flex items-center justify-center text-creme text-3xl font-bold shadow-xl mb-6">
                                {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                            </div>
                            <h2 className="text-xl font-bold text-encre">{client.firstName} {client.lastName}</h2>
                            <span className="text-xs font-medium text-encre3 mt-1 italic">{client.email}</span>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="flex items-center space-x-4 group">
                                <div className="w-10 h-10 rounded-sm bg-creme flex items-center justify-center text-encre3 border border-creme2 group-hover:bg-or/10 group-hover:text-or transition-colors">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase font-black tracking-widest text-encre3">Téléphone</p>
                                    <p className="text-sm font-bold text-encre">{client.phone || 'Non renseigné'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 group">
                                <div className="w-10 h-10 rounded-sm bg-creme flex items-center justify-center text-encre3 border border-creme2 group-hover:bg-or/10 group-hover:text-or transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase font-black tracking-widest text-encre3">Adresse par défaut</p>
                                    <p className="text-sm font-bold text-encre">
                                        {client.addresses?.[0]?.city || 'Aucune adresse enregistrée'} {client.addresses?.[0]?.wilaya ? `(${client.addresses[0].wilaya})` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Boxes */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white rounded-sm border border-creme2 p-6 flex items-center space-x-4 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-rouge-brand/10 flex items-center justify-center text-rouge-brand">
                                <ShoppingBag size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-encre3">Total Commandes</p>
                                <p className="text-2xl font-bold text-encre">{totalOrders}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-sm border border-creme2 p-6 flex items-center space-x-4 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <TrendingUp size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-encre3">Dépenses Totales</p>
                                <p className="text-2xl font-bold text-encre">{formatPrice(totalSpent)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order History */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-sm border border-creme2 shadow-lg">
                        <div className="p-6 border-b border-creme2 flex items-center justify-between">
                            <h2 className="font-serif text-xl text-encre">Historique d'achat</h2>
                            <div className="flex items-center text-encre3 space-x-2">
                                <Clock size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{totalOrders} commande(s)</span>
                            </div>
                        </div>

                        {client.orders && client.orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-creme/30 text-[9px] uppercase tracking-widest text-encre3 font-black border-b border-creme2">
                                        <tr>
                                            <th className="px-6 py-4 text-left">N° Commande</th>
                                            <th className="px-6 py-4 text-left">Date</th>
                                            <th className="px-6 py-4 text-center">Quantité</th>
                                            <th className="px-6 py-4 text-center">Total</th>
                                            <th className="px-6 py-4 text-center">Statut</th>
                                            <th className="px-6 py-4 text-right">Détails</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-creme2">
                                        {client.orders.map((order: any) => (
                                            <tr key={order.id} className="hover:bg-creme/5 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-bold text-encre">#{order.orderNumber || order.id.substring(0, 8)}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-xs text-encre3">
                                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-xs font-bold text-encre3">{order.itemCount || order.items?.length || 0} art.</span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <p className="text-sm font-black text-encre">{formatPrice(order.total)}</p>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm border",
                                                        getStatusColor(order.status)
                                                    )}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Link 
                                                        href={`/admin/commandes/${order.id}`}
                                                        className="inline-flex items-center justify-center p-2 text-encre3 hover:text-or hover:bg-or/10 rounded-sm transition-all"
                                                        title="Voir la commande"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-20 text-center">
                                <ShoppingBag className="w-16 h-16 text-creme2 mx-auto mb-4 opacity-20" strokeWidth={1} />
                                <p className="font-serif text-lg text-encre3 italic">Ce client n'a pas encore passé de commande.</p>
                            </div>
                        )}
                    </div>

                    {/* Additional Sections Placeholder (Reviews, etc.) */}
                    <div className="bg-creme/30 rounded-sm border border-dashed border-creme2 p-8 flex items-center justify-center text-encre3">
                        <div className="text-center">
                            <Star size={32} className="mx-auto mb-3 opacity-20" />
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Avis & Récompenses Fidelity</p>
                            <p className="text-[10px] mt-1 font-medium opacity-60">Prochainement disponible</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
