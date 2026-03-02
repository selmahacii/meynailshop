'use client';

import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Star, MessageSquare } from 'lucide-react';
import Image from 'next/image';

// Mock data
const mockReviews = [
    { id: '1', product: 'Vernis Gel "Royal Red"', rating: 5, user: 'Sarah N.', date: '02 Mars 2026', title: 'Couleur magnifique !', content: 'Le rouge est d\'une profondeur incroyable et la tenue est parfaite après 3 semaines. Je recommande vivement pour les poses élégantes.', status: 'pending' },
    { id: '2', product: 'Gel UV de Construction', rating: 4, user: 'Amira B.', date: '28 Fév 2026', title: 'Très bon gel', content: 'Auto-égalisant vraiment efficace. Seul bémol, chauffe un tout petit peu sous la lampe au début.', status: 'approved' },
    { id: '3', product: 'Top Coat Mirror Shine', rating: 1, user: 'Inconnue', date: '25 Fév 2026', title: 'Déçue', content: 'Produit qui pèle après 2 jours... (Ce commentaire semble être un spam ou achat concurrent)', status: 'rejected' },
    { id: '4', product: 'Lampe UV/LED 48W', rating: 5, user: 'Lina M.', date: '20 Fév 2026', title: 'Parfait pour mon salon', content: 'Sèche très vite, les capteurs fonctionnent parfaitement. Très bon investissement.', status: 'approved' },
];

export default function AdminReviewsPage() {
    const [filterStatus, setFilterStatus] = useState('all');

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-creme2">
                <div>
                    <h1 className="text-2xl font-serif text-encre">Avis Clients</h1>
                    <p className="text-encre3 text-sm mt-1">Modérez les commentaires et notes laissés sur vos produits.</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-sm border border-creme2 shadow-sm">
                <div className="w-full sm:w-96 relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3" />
                    <input
                        type="text"
                        placeholder="Rechercher dans les avis..."
                        className="w-full pl-10 pr-4 py-2 border border-creme2 focus:outline-none focus:ring-1 focus:ring-or focus:border-or rounded-sm text-sm"
                    />
                </div>

                <div className="flex space-x-3 w-full sm:w-auto overflow-x-auto">
                    {['all', 'pending', 'approved', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`flex-shrink-0 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all
                 ${filterStatus === status
                                    ? 'bg-or text-rouge-deep shadow-inner'
                                    : 'bg-creme text-encre3 hover:bg-creme2'
                                }
               `}
                        >
                            {status === 'all' ? 'Tous' :
                                status === 'pending' ? 'En attente' :
                                    status === 'approved' ? 'Approuvés' : 'Rejetés'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {mockReviews
                    .filter(review => filterStatus === 'all' || review.status === filterStatus)
                    .map((review) => (
                        <div key={review.id} className="bg-white border border-creme2 rounded-sm p-6 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                            {/* Context info */}
                            <div className="md:w-1/4 shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-r border-creme2 pb-4 md:pb-0 md:pr-6">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-encre3 mb-2">{review.date}</div>
                                    <h3 className="font-semibold text-sm text-encre mb-1">{review.user}</h3>
                                    <div className="flex text-or mb-4">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={12} className={s <= review.rating ? 'fill-or' : 'text-creme2'} />
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-center text-xs text-rouge-mid">
                                        <Package size={14} className="mr-2" />
                                        <span className="font-bold underline truncate" title={review.product}>{review.product}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-serif text-lg text-encre flex items-center">
                                        <MessageSquare size={16} className="text-or mr-3" />
                                        "{review.title}"
                                    </h4>
                                    {/* Status badge */}
                                    <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded-sm flex-shrink-0
                    ${review.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                            review.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                'bg-red-100 text-red-800 border border-red-200'
                                        }
                  `}>
                                        {review.status === 'pending' ? 'En attente' :
                                            review.status === 'approved' ? 'Publié' : 'Rejeté'}
                                    </span>
                                </div>
                                <p className="text-encre3 text-sm italic leading-relaxed bg-creme2/50 p-4 rounded-sm border-l-2 border-or">
                                    {review.content}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="md:w-32 shrink-0 flex flex-row md:flex-col gap-2 justify-center md:justify-start border-t md:border-t-0 border-creme2 pt-4 md:pt-0">
                                {review.status !== 'approved' && (
                                    <button className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-sm transition-colors shadow-sm">
                                        <CheckCircle size={14} className="mr-2" /> Approuver
                                    </button>
                                )}
                                {review.status !== 'rejected' && (
                                    <button className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-sm transition-colors shadow-sm">
                                        <XCircle size={14} className="mr-2" /> Rejeter
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                {mockReviews.filter(review => filterStatus === 'all' || review.status === filterStatus).length === 0 && (
                    <div className="bg-white p-12 text-center border border-creme2 text-encre3">
                        Aucun avis trouvé pour ce statut.
                    </div>
                )}
            </div>
        </div>
    );
}

import { Package } from 'lucide-react';
