'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Download, CheckCircle, XCircle, Star, MessageSquare, Package, Loader, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ReviewsAPI } from '@/lib/api/client';

const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border border-yellow-200' },
    approved: { label: 'Publié', color: 'bg-green-100 text-green-800 border border-green-200' },
    rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-800 border border-red-200' },
};

export default function AdminReviewsPage() {
    const [filterStatus, setFilterStatus] = useState('all');
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await ReviewsAPI.getAll(1, 100);
            if (res.success) {
                setReviews(res.data.items || res.data || []);
            } else {
                setError(res.error || 'Impossible de charger les avis');
            }
        } catch (err) {
            console.error('Reviews load error:', err);
            setError('Erreur réseau lors du chargement des avis');
        } finally {
            setLoading(false);
        }
    };

    const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
        try {
            const res = await ReviewsAPI.moderate(id, status);
            if (res.success) {
                setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            } else {
                alert(res.error || 'Erreur lors de la modération');
            }
        } catch (err) {
            alert('Erreur réseau lors de la modération');
        }
    };

    const filtered = reviews.filter(r => filterStatus === 'all' || r.status === filterStatus);

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-encre">Avis clients</h1>
                    <p className="text-encre3 text-[9px] md:text-[10px] uppercase tracking-widest font-bold mt-1">
                        Modération des avis — {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            className="pl-10 pr-4 py-2 bg-white border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-full md:w-64 shadow-sm" 
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm">
                            <Download size={18} />
                        </button>
                        <Link href="/" className="px-4 py-2 border border-encre text-encre rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-encre hover:text-creme transition-all">
                            Voir Boutique
                        </Link>
                    </div>
                </div>
            </div>

            {/* Filter Tabs - Scrollable on mobile */}
            <div className="overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                <div className="flex items-center bg-white p-1 rounded-sm border border-creme2 w-max md:w-fit">
                    {[
                        { key: 'all', label: 'Tous' },
                        { key: 'pending', label: 'En attente' },
                        { key: 'approved', label: 'Approuvés' },
                        { key: 'rejected', label: 'Rejetés' },
                    ].map(tab => (
                        <button 
                            key={tab.key} 
                            onClick={() => setFilterStatus(tab.key)}
                            className={cn("px-4 md:px-6 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-sm transition-all whitespace-nowrap",
                                filterStatus === tab.key ? "bg-encre text-creme shadow-lg" : "text-encre3 hover:bg-creme/50"
                            )}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 md:space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white border border-creme2 rounded-sm">
                        <Loader className="w-8 h-8 text-or animate-spin" />
                        <span className="mt-4 text-encre3 font-bold uppercase tracking-widest text-[10px]">Chargement des avis...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-16 bg-white border border-creme2 rounded-sm">
                        <AlertCircle className="w-12 h-12 text-rouge mx-auto mb-4" />
                        <p className="text-rouge font-medium mb-6">{error}</p>
                        <button onClick={fetchReviews} className="px-6 py-3 bg-encre text-creme text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-rouge-brand transition-colors">Réessayer</button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white py-20 px-4 text-center border border-creme2 rounded-sm text-encre3 shadow-lg">
                        <MessageSquare className="w-12 h-12 text-creme2 mx-auto mb-4" />
                        <p className="font-serif italic text-lg opacity-60">Aucun avis reçu pour ce statut.</p>
                    </div>
                ) : (
                    filtered.map((review) => (
                        <div key={review.id} className="bg-white border border-creme2 rounded-sm shadow-xl p-4 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 hover:border-or/40 transition-all group overflow-hidden">
                            {/* Left Info: User & Product */}
                            <div className="md:w-56 shrink-0 space-y-3 md:space-y-4 border-b md:border-b-0 md:border-r border-creme2 pb-4 md:pb-0 md:pr-8">
                                <div className="flex md:block justify-between items-start">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-encre3 opacity-60">
                                            {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        <p className="text-base font-bold text-encre mt-1">
                                            {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Client Anonyme'}
                                        </p>
                                    </div>
                                    <div className="flex text-or mt-1 md:mt-2">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={14} className={s <= review.rating ? 'fill-or' : 'text-creme2'} />
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center text-xs text-rouge-brand bg-rouge-brand/5 p-2 rounded-sm transition-colors group-hover:bg-rouge-brand/10">
                                        <Package size={14} className="mr-2 shrink-0" />
                                        <span className="font-bold truncate max-w-[150px]">{review.product?.name || 'Produit'}</span>
                                    </div>
                                    <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm inline-block shadow-sm", statusConfig[review.status]?.color)}>
                                        {statusConfig[review.status]?.label || review.status}
                                    </span>
                                </div>
                            </div>

                            {/* Content: Review Text */}
                            <div className="flex-grow flex flex-col justify-center">
                                <div className="flex items-start space-x-3 mb-3">
                                    <MessageSquare size={18} className="text-or/60 shrink-0 mt-1" />
                                    <h4 className="font-serif text-lg md:text-xl text-encre leading-relaxed italic">
                                        "{review.content}"
                                    </h4>
                                </div>
                            </div>

                            {/* Actions: Moderate */}
                            <div className="md:w-40 shrink-0 flex flex-row md:flex-col gap-3 justify-center md:justify-center border-t md:border-t-0 border-creme2 pt-4 md:pt-0">
                                {review.status !== 'approved' && (
                                    <button 
                                        onClick={() => handleModerate(review.id, 'approved')}
                                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-[9px] font-black uppercase tracking-widest rounded-sm transition-all shadow-md active:scale-95"
                                    >
                                        <CheckCircle size={14} />
                                        <span className="md:inline">Approuver</span>
                                    </button>
                                )}
                                {review.status !== 'rejected' && (
                                    <button 
                                        onClick={() => handleModerate(review.id, 'rejected')}
                                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-sm transition-all shadow-md active:scale-95"
                                    >
                                        <XCircle size={14} />
                                        <span className="md:inline">Rejeter</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
