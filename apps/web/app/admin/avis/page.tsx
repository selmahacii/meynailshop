'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Download, CheckCircle, XCircle, Star, MessageSquare, Package } from 'lucide-react';
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

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const res = await ReviewsAPI.getAll(1);
                if (res.success) {
                    if (mounted) setReviews(res.data.items || res.data || []);
                }
            } catch (err) {
                console.error('Reviews load error:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, []);

    const filtered = reviews.filter(r => filterStatus === 'all' || r.status === filterStatus);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Avis clients</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">Modération des avis — 04 Mars 2026</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors" size={16} />
                        <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2.5 bg-white border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-64 shadow-sm" />
                    </div>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Bell size={18} /></button>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm"><Download size={18} /></button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all">Voir la boutique</Link>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-white p-1 rounded-sm border border-creme2 w-fit">
                {[
                    { key: 'all', label: 'Tous' },
                    { key: 'pending', label: 'En attente' },
                    { key: 'approved', label: 'Approuvés' },
                    { key: 'rejected', label: 'Rejetés' },
                ].map(tab => (
                    <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
                        className={cn("px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all",
                            filterStatus === tab.key ? "bg-[#1A0A0A] text-creme shadow-lg" : "text-encre3 hover:bg-creme/50"
                        )}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Reviews */}
            <div className="space-y-6">
                {filtered.map((review) => (
                    <div key={review.id} className="bg-white border border-creme2 rounded-sm shadow-lg p-8 flex flex-col md:flex-row gap-8 hover:border-or transition-all group">
                        {/* Left Info */}
                        <div className="md:w-56 shrink-0 space-y-4 border-b md:border-b-0 md:border-r border-creme2 pb-6 md:pb-0 md:pr-8">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-encre3">{review.date}</p>
                                <p className="text-base font-bold text-encre mt-1">{review.user}</p>
                            </div>
                            <div className="flex text-or">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={14} className={s <= review.rating ? 'fill-or' : 'text-creme2'} />
                                ))}
                            </div>
                            <div className="flex items-center text-xs text-rouge-mid">
                                <Package size={14} className="mr-2 shrink-0" />
                                <span className="font-bold underline truncate">{review.product}</span>
                            </div>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm inline-block", statusConfig[review.status].color)}>
                                {statusConfig[review.status].label}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                            <div className="flex items-center space-x-3 mb-4">
                                <MessageSquare size={16} className="text-or shrink-0" />
                                <h4 className="font-serif text-xl text-encre">"{review.title}"</h4>
                            </div>
                            <p className="text-sm text-encre3 leading-relaxed italic bg-creme2/40 p-4 rounded-sm border-l-4 border-or">
                                {review.content}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="md:w-36 shrink-0 flex flex-row md:flex-col gap-3 justify-end md:justify-start border-t md:border-t-0 border-creme2 pt-6 md:pt-0">
                            {review.status !== 'approved' && (
                                <button className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all">
                                    <CheckCircle size={14} />
                                    <span>Approuver</span>
                                </button>
                            )}
                            {review.status !== 'rejected' && (
                                <button className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all">
                                    <XCircle size={14} />
                                    <span>Rejeter</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="bg-white p-16 text-center border border-creme2 rounded-sm text-encre3 shadow-lg">
                        Aucun avis trouvé pour ce statut.
                    </div>
                )}
            </div>
        </div>
    );
}
