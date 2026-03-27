'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    FileText,
    Printer,
    MoreVertical,
    ChevronRight,
    Loader,
    Home,
    Briefcase,
    RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { OrdersAPI } from '@/lib/api/client';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const result = await OrdersAPI.getById(id as string);
            if (result.success) {
                setOrder(result.data);
            } else {
                setError(result.error || 'Commande introuvable');
            }
        } catch (err) {
            setError('Erreur lors de la récupération de la commande');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        try {
            setUpdating(true);
            const result = await OrdersAPI.updateStatus(id as string, newStatus);
            if (result.success) {
                setOrder(result.data);
                
                // Signal to sidebar/other components to refresh counts
                window.dispatchEvent(new Event('orderUpdated'));
                
                // If the status involves stock (cancelled/returned), trigger stock update too
                if (['cancelled', 'returned'].includes(newStatus)) {
                    window.dispatchEvent(new Event('stockUpdated'));
                }
            } else {
                alert(result.error || 'Erreur lors du changement de statut');
            }
        } catch (err) {
            alert('Erreur technique');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
            case 'confirmed': return { label: 'Confirmée', color: 'bg-indigo-100 text-indigo-700', icon: CheckCircle2 };
            case 'processing': return { label: 'Préparation', color: 'bg-purple-100 text-purple-700', icon: Package };
            case 'shipped': return { label: 'Expédiée', color: 'bg-blue-100 text-blue-700', icon: Truck };
            case 'delivered': return { label: 'Livrée', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
            case 'returned': return { label: 'Retournée', color: 'bg-rouge-deep/10 text-rouge-mid', icon: RotateCcw };
            case 'cancelled': return { label: 'Annulée', color: 'bg-red-100 text-red-700', icon: XCircle };
            case 'refunded': return { label: 'Remboursée', color: 'bg-gray-100 text-gray-700', icon: RotateCcw };
            default: return { label: status, color: 'bg-gray-100 text-gray-700', icon: ChevronRight };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-or animate-spin mx-auto mb-4" />
                    <p className="text-encre3 uppercase tracking-widest text-[10px] font-bold">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="p-8 text-center bg-rouge-deep/5 rounded-sm border border-rouge-deep/10">
                <XCircle className="w-12 h-12 text-rouge-deep mx-auto mb-4" />
                <h2 className="text-xl font-serif text-encre mb-2">Oups !</h2>
                <p className="text-encre3 mb-6">{error || 'Cette commande semble avoir disparu.'}</p>
                <Link href="/admin/commandes" className="px-6 py-2 bg-encre text-creme rounded-sm text-xs font-bold uppercase tracking-widest">
                    Retour aux commandes
                </Link>
            </div>
        );
    }

    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-creme rounded-full transition-colors group"
                    >
                        <ArrowLeft size={20} className="text-encre3 group-hover:text-or" />
                    </button>
                    <div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                            <h1 className="text-2xl md:text-3xl font-serif text-encre">#{order.orderNumber}</h1>
                            <div className="flex flex-wrap gap-2">
                                <span className={cn("px-3 py-1 rounded-sm text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center space-x-2", statusInfo.color)}>
                                    <StatusIcon size={12} />
                                    <span>{statusInfo.label}</span>
                                </span>
                                <span className={cn(
                                    "px-3 py-1 rounded-sm text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center space-x-2",
                                    order.deliveryType === 'home' ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                                )}>
                                    {order.deliveryType === 'office' ? <Briefcase size={12} /> : <Home size={12} />}
                                    <span>{order.deliveryType === 'office' ? 'Bureau' : 'À Domicile'}</span>
                                </span>
                            </div>
                        </div>
                        <p className="text-encre3 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
                            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    
                    {/* Status Actions */}
                    {order.status === 'shipped' && (
                        <div className="flex flex-wrap gap-2">
                             <button
                                onClick={() => updateStatus('delivered')}
                                disabled={updating}
                                className="flex items-center space-x-2 px-5 md:px-8 py-2.5 md:py-3 bg-green-700 text-white rounded-sm text-[10px] md:text-sm font-black uppercase tracking-widest hover:bg-green-800 transition-all shadow-xl border border-green-900 group/btn"
                            >
                                <CheckCircle2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                <span>{updating ? '...' : (window.innerWidth < 640 ? 'LIVRÉE' : 'Marquer comme Livrée')}</span>
                            </button>
                             <button
                                onClick={() => updateStatus('returned')}
                                disabled={updating}
                                className="flex items-center space-x-2 px-5 md:px-8 py-2.5 md:py-3 bg-rouge-deep text-white rounded-sm text-[10px] md:text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl border border-rouge-deep group/btn"
                            >
                                <RotateCcw size={16} className="group-hover/btn:rotate-[-45deg] transition-transform" />
                                <span>{updating ? '...' : (window.innerWidth < 640 ? 'RETOUR' : 'Signaler Retour')}</span>
                            </button>
                        </div>
                    )}

                    <div className="relative group">
                        <button className="flex items-center space-x-2 px-5 md:px-6 py-2.5 bg-encre text-creme rounded-sm text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md">
                            <span>Changer Statut</span>
                            <ChevronRight size={14} className="rotate-90" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-creme2 shadow-xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            {['confirmed', 'processing', 'shipped', 'delivered', 'returned', 'cancelled'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => updateStatus(s)}
                                    className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-encre3 hover:text-or hover:bg-creme/50 border-b border-creme2 last:border-0 transition-all"
                                >
                                    {getStatusInfo(s).label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Product Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Products Table */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-creme/5">
                            <h3 className="text-sm font-black uppercase tracking-widest text-encre flex items-center space-x-2">
                                <Package size={16} className="text-or" />
                                <span>Articles Commandés</span>
                            </h3>
                        </div>
                        <div className="overflow-x-auto hidden md:block">
                            <table className="w-full">
                                <thead className="bg-creme/20 text-[10px] uppercase tracking-widest text-encre3 font-black border-b border-creme2">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Produit</th>
                                        <th className="px-6 py-4 text-center">Prix</th>
                                        <th className="px-6 py-4 text-center">Qté</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-creme2">
                                    {order.items?.map((item: any) => (
                                        <tr key={item.id} className="group hover:bg-creme/5 transition-colors">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-16 h-16 bg-creme rounded-sm overflow-hidden flex-shrink-0 border border-creme2">
                                                        <img 
                                                            src={item.productImage} 
                                                            alt={item.productName} 
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-encre line-clamp-1">{item.productName}</p>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <p className="text-[10px] text-encre3 font-mono uppercase tracking-widest border border-creme2 px-2 py-0.5 rounded-sm bg-creme/20">SKU: {item.productSku}</p>
                                                            {item.variantSku && item.variantSku !== item.productSku && (
                                                                <p className="text-[9px] font-black text-rouge-deep uppercase bg-rouge-deep/5 px-2 py-0.5 rounded-sm animate-pulse tracking-widest">Référence: {item.variantSku}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center text-sm font-medium text-encre">
                                                {Number(item.unitPrice).toLocaleString()} DA
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-creme border border-creme2 rounded-sm text-sm font-black text-encre">
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-right text-sm font-black text-encre">
                                                {Number(item.subtotal).toLocaleString()} DA
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Items List */}
                        <div className="md:hidden divide-y divide-creme2">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="p-4 flex space-x-4">
                                    <div className="w-20 h-24 bg-creme rounded-sm overflow-hidden flex-shrink-0 border border-creme2">
                                        <img 
                                            src={item.productImage} 
                                            alt={item.productName} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-sm font-black text-encre uppercase tracking-tighter line-clamp-2 leading-tight">{item.productName}</p>
                                        <div className="flex flex-col gap-1 mt-2">
                                            <p className="text-[9px] text-encre3 font-bold uppercase tracking-widest">SKU: {item.productSku}</p>
                                            {item.variantSku && item.variantSku !== item.productSku && (
                                                <p className="text-[9px] font-black text-rouge-deep uppercase tracking-widest">Réf: {item.variantSku}</p>
                                            )}
                                        </div>
                                        
                                        <div className="mt-4 flex items-end justify-between">
                                            <div className="text-[10px] text-encre3 font-bold">
                                                <p>{Number(item.unitPrice).toLocaleString()} DA x {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-black text-or">
                                                {Number(item.subtotal).toLocaleString()} DA
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Footer */}
                        <div className="p-6 md:p-8 bg-creme/5 flex justify-end">
                            <div className="w-full md:w-72 space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-bold text-encre3 uppercase tracking-widest">
                                    <span>Sous-total</span>
                                    <span className="text-encre">{Number(order.subtotal).toLocaleString()} DA</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-encre3 uppercase tracking-widest">
                                    <span>Livraison</span>
                                    <span className="text-encre font-black">{Number(order.shippingCost).toLocaleString()} DA</span>
                                </div>
                                {Number(order.discount) > 0 && (
                                    <div className="flex justify-between items-center text-[10px] font-bold text-rouge-mid uppercase tracking-widest">
                                        <span>Remise</span>
                                        <span>-{Number(order.discount).toLocaleString()} DA</span>
                                    </div>
                                )}
                                <div className="pt-6 border-t-2 border-creme2 flex justify-between items-end">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-encre">Total à payer</span>
                                    <div className="text-right">
                                        <span className="block text-[8px] font-black text-encre3 uppercase tracking-widest mb-1">Montant final</span>
                                        <span className="text-2xl md:text-3xl font-black text-or">{Number(order.total).toLocaleString()} DA</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Notes / Timeline (Optional) */}
                    {order.notes && (
                        <div className="bg-white p-8 border border-creme2 rounded-sm shadow-lg">
                            <h3 className="text-xs font-black uppercase tracking-widest text-encre mb-4 flex items-center space-x-2">
                                <FileText size={16} className="text-or" />
                                <span>Note du client</span>
                            </h3>
                            <p className="text-sm text-encre3 italic leading-relaxed bg-creme/20 p-4 rounded-sm border border-creme2">
                                "{order.notes}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column - Customer & Info */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-[#1A0A0A] text-creme">
                            <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                                <User size={14} className="text-or" />
                                <span>Client</span>
                            </h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-or/10 rounded-full flex items-center justify-center text-or border border-or/20 text-lg font-black">
                                    {(order.user?.firstName || order.shippingAddressSnapshot?.firstName || '?').charAt(0)}
                                    {(order.user?.lastName || order.shippingAddressSnapshot?.lastName || '').charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-encre uppercase tracking-wide">
                                        {order.user?.firstName || order.shippingAddressSnapshot?.firstName} {order.user?.lastName || order.shippingAddressSnapshot?.lastName}
                                        {!order.userId && <span className="ml-2 text-[8px] bg-creme2 text-encre3 px-1.5 py-0.5 rounded tracking-tighter">INVITÉ</span>}
                                    </p>
                                    <p className="text-[11px] text-encre3">ID: {order.userId ? `#${order.userId.slice(0, 8)}` : 'Client non inscrit'}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-4 border-t border-creme2">
                                <div className="flex items-center space-x-3 text-encre3 hover:text-or transition-colors group">
                                    <Mail size={16} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold">{order.user?.email || order.shippingAddressSnapshot?.email}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-encre3 hover:text-or transition-colors group">
                                    <Phone size={16} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold">{order.user?.phone || order.shippingAddressSnapshot?.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-[#1A0A0A] text-creme">
                            <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                                <MapPin size={14} className="text-or" />
                                <span>Livraison</span>
                            </h3>
                        </div>
                        <div className="p-8">
                            <p className="text-xs font-black text-encre uppercase tracking-widest mb-2">
                                {order.shippingAddressSnapshot?.fullName}
                            </p>
                            <div className="space-y-1 text-xs text-encre3 font-medium leading-relaxed uppercase tracking-tighter">
                                <p>{order.shippingAddressSnapshot?.address}</p>
                                <p>{order.shippingAddressSnapshot?.commune}</p>
                                <p className="text-encre font-bold">{order.shippingAddressSnapshot?.wilayaName} ({order.shippingAddressSnapshot?.postalCode})</p>
                                <div className="mt-4 pt-4 border-t border-creme2">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1A0A0A]">
                                        {order.deliveryType === 'office' ? <Briefcase size={14} className="text-or" /> : <Home size={14} className="text-or" />}
                                        <span>Livraison {order.deliveryType === 'office' ? 'au Bureau' : 'à Domicile'}</span>
                                    </div>
                                </div>
                                <p className="pt-2 text-[10px] opacity-60">Algérie</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-[#1A0A0A] text-creme">
                            <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                                <CreditCard size={14} className="text-or" />
                                <span>Paiement</span>
                            </h3>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-encre3">Méthode</span>
                                <span className="text-xs font-black text-encre uppercase tracking-wide">
                                    {order.paymentMethod === 'cash_on_delivery' ? 'Main à main' : order.paymentMethod.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-encre3">Statut</span>
                                <span className={cn(
                                    "px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-sm",
                                    order.paymentStatus === 'paid' ? "bg-green-100 text-green-700" : "bg-rouge-deep/10 text-rouge-mid"
                                )}>
                                    {order.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

