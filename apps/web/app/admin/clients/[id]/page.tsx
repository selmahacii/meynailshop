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
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="text-center">
                    <Loader className="w-10 h-10 text-or animate-spin mx-auto mb-4" />
                    <p className="text-encre3 font-bold uppercase tracking-widest text-[10px]">Chargement du profil client...</p>
                </div>
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="text-center py-20 px-4">
                <AlertCircle className="w-16 h-16 text-rouge mx-auto mb-6" />
                <h2 className="text-2xl font-serif text-encre mb-4">Oups ! Profil introuvable</h2>
                <p className="text-encre3 mb-8 max-w-md mx-auto">{error || 'Le client est introuvable ou a été supprimé'}</p>
                <button 
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-encre text-creme rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-rouge-deep transition-all"
                >
                    Retour à la liste
                </button>
            </div>
        );
    }

    const totalOrders = client.orders?.length || 0;
    const totalSpent = client.orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            {/* Header - More responsive layout */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button 
                    onClick={() => router.back()}
                    className="p-2 w-fit hover:bg-creme rounded-full transition-colors text-encre3 border border-creme2"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-serif text-encre leading-tight">{client.firstName} {client.lastName}</h1>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="text-encre3 text-[10px] uppercase font-black tracking-widest bg-creme2/40 px-2 py-0.5 rounded-sm">Profil Client</span>
                        <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-or" />
                            <span className="text-[10px] text-or font-black uppercase tracking-widest">Membre depuis {new Date(client.createdAt).getFullYear()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                {/* Left Column: Infos & Stats */}
                <div className="space-y-6 md:space-y-8 h-fit">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden">
                        <div className="p-8 pb-6 flex flex-col items-center border-b border-creme2/50 bg-creme/10">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#390102] to-rouge-brand flex items-center justify-center text-creme text-3xl font-bold shadow-2xl mb-6 ring-4 ring-white">
                                {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                            </div>
                            <h2 className="text-xl font-bold text-encre text-center">{client.firstName} {client.lastName}</h2>
                            <span className="text-xs font-semibold text-rouge-brand mt-1 italic opacity-80">{client.email}</span>
                        </div>
                        
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="flex items-center space-x-4 group">
                                <div className="w-10 h-10 rounded-sm bg-creme flex items-center justify-center text-or/60 border border-creme2 group-hover:bg-or/10 group-hover:text-or transition-colors shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-encre3">Téléphone</p>
                                    <p className="text-sm font-bold text-encre truncate">{client.phone || 'Non renseigné'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 group">
                                <div className="w-10 h-10 rounded-sm bg-creme flex items-center justify-center text-or/60 border border-creme2 group-hover:bg-or/10 group-hover:text-or transition-colors shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-encre3">Destination par défaut</p>
                                    <p className="text-sm font-bold text-encre leading-snug">
                                        {client.addresses?.[0]?.city || 'Algérie'} {client.addresses?.[0]?.wilaya ? `(${client.addresses[0].wilaya})` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Boxes with improved responsive grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                        <div className="bg-white rounded-sm border border-creme2 p-6 flex items-center space-x-4 shadow-xl hover:border-or/40 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-rouge-brand/10 flex items-center justify-center text-rouge-brand group-hover:scale-110 transition-transform">
                                <ShoppingBag size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-encre3">Commandes</p>
                                <p className="text-2xl font-black text-encre">{totalOrders}</p>
                            </div>
                        </div>
                        <div className="bg-[#1A0A0A] rounded-sm border border-black p-6 flex items-center space-x-4 shadow-xl hover:bg-black transition-all group">
                            <div className="w-12 h-12 rounded-full bg-gold-brand/10 flex items-center justify-center text-gold-brand group-hover:scale-110 transition-transform">
                                <TrendingUp size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-creme/40">Dépenses Totales</p>
                                <p className="text-2xl font-black text-gold-brand">{formatPrice(totalSpent)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order History */}
                <div className="xl:col-span-2 space-y-6 md:space-y-8">
                    <div className="bg-white rounded-sm border border-creme2 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-creme2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="font-serif text-xl text-encre">Historique d'achat</h2>
                            <div className="flex items-center text-encre3 space-x-2 bg-creme/40 px-4 py-1.5 rounded-full border border-creme2/50 w-fit">
                                <Clock size={16} className="text-or/70" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{totalOrders} commande(s)</span>
                            </div>
                        </div>

                        {client.orders && client.orders.length > 0 ? (
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full min-w-[600px]">
                                    <thead className="bg-creme/30 text-[9px] uppercase tracking-widest text-encre3 font-black border-b border-creme2">
                                        <tr>
                                            <th className="px-6 py-5 text-left">N° Commande</th>
                                            <th className="px-6 py-5 text-left">Date</th>
                                            <th className="px-6 py-5 text-center">Articles</th>
                                            <th className="px-6 py-5 text-center">Total</th>
                                            <th className="px-6 py-5 text-center">Statut</th>
                                            <th className="px-6 py-5 text-right whitespace-nowrap">Détails</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-creme2">
                                        {client.orders.map((order: any, idx: number) => (
                                            <tr key={order.id} className="hover:bg-creme/5 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-bold text-encre">#{order.orderNumber || order.id.substring(0, 8)}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-xs text-encre3 font-medium">
                                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-xs font-bold text-encre3 px-2 py-0.5 bg-creme2/30 rounded-sm">
                                                        {order.itemCount || order.items?.length || 1}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <p className="text-sm font-black text-encre">{formatPrice(order.total)}</p>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm border shadow-sm",
                                                        getStatusColor(order.status)
                                                    )}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Link 
                                                        href={`/admin/commandes/${order.id}`}
                                                        className="inline-flex items-center justify-center p-2.5 text-encre3 hover:text-white hover:bg-[#390102] border border-creme2 rounded-sm transition-all shadow-sm"
                                                        title="Voir la commande"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-20 text-center">
                                <ShoppingBag className="w-16 h-16 text-creme2 mx-auto mb-6 opacity-20" strokeWidth={1} />
                                <p className="font-serif text-xl text-encre opacity-60 italic max-w-sm mx-auto">
                                    Ce client n'a pas encore passé de commande chez MEEY.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Placeholder for future features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-white rounded-sm border border-creme2 p-8 flex flex-col items-center justify-center text-encre3 text-center shadow-lg">
                            <Star size={32} className="text-or/30 mb-4" strokeWidth={1.5} />
                            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-encre">Derniers Avis</p>
                            <p className="text-[10px] mt-2 font-medium italic opacity-50">Aucun avis publié pour le moment.</p>
                        </div>
                        <div className="bg-creme/20 rounded-sm border border-dashed border-creme2 p-8 flex flex-col items-center justify-center text-encre3 text-center">
                            <Calendar size={32} className="text-encre3/20 mb-4" strokeWidth={1.5} />
                            <p className="text-[10px] uppercase font-black tracking-[0.2em]">Fidélité & Points</p>
                            <p className="text-[10px] mt-2 font-medium opacity-50">Activation prochaine du programme.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


