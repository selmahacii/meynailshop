'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';
import { StoreAPI } from '@/lib/api/client';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/currency';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await StoreAPI.getProducts(1, 4, { name: query });
                if (res.success) {
                    const items = res.data?.items || res.data || [];
                    setResults(items.slice(0, 4));
                }
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[2000] bg-encre/95 backdrop-blur-md flex flex-col"
                >
                    <div className="container mx-auto px-4 py-8 flex flex-col h-full max-w-4xl">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-creme font-serif text-2xl uppercase tracking-widest">Rechercher</h2>
                            <button 
                                onClick={onClose}
                                className="text-or hover:rotate-90 transition-transform p-2 bg-white/5 rounded-full"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <div className="relative mb-12">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-or/50" size={24} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Vernis, Gel, Accessoires..."
                                className="w-full bg-white/5 border-b-2 border-or/20 py-8 pl-16 pr-8 text-2xl md:text-4xl text-creme placeholder-creme/20 focus:outline-none focus:border-or transition-all font-serif"
                            />
                            {loading && (
                                <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 text-or animate-spin" size={24} />
                            )}
                        </div>

                        <div className="flex-grow overflow-y-auto custom-scrollbar">
                            {results.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/catalogue/${product.slug}`}
                                            onClick={onClose}
                                            className="flex bg-white/5 p-4 rounded-sm border border-white/5 hover:border-or/30 hover:bg-white/10 transition-all group"
                                        >
                                            <div className="relative w-20 h-20 bg-encre shrink-0 mr-4 overflow-hidden rounded-sm">
                                                <Image 
                                                    src={product.images?.[0] || '/images/placeholder-product.png'} 
                                                    alt={product.name} 
                                                    fill 
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h4 className="text-creme font-bold text-sm mb-1 group-hover:text-or transition-colors">{product.name}</h4>
                                                <p className="text-or font-bold">{formatPrice(product.price)}</p>
                                            </div>
                                            <div className="ml-auto flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight size={20} className="text-or" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : query && !loading ? (
                                <p className="text-creme/50 text-center py-20 italic">Aucun résultat trouvé pour "{query}"</p>
                            ) : !query ? (
                                <div className="space-y-4">
                                    <p className="text-or text-[10px] uppercase tracking-widest font-black opacity-50 mb-6 font-sans">Suggestions populaires</p>
                                    <div className="flex flex-wrap gap-4">
                                        {['Vernis Gel', 'Gel UV', 'Matériel', 'Top Coat', 'Base Coat'].map(tag => (
                                            <button 
                                                key={tag} 
                                                onClick={() => setQuery(tag)}
                                                className="px-6 py-3 bg-white/5 text-creme/80 rounded-full hover:bg-or hover:text-encre transition-all text-sm font-medium border border-white/5"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {results.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                <Link 
                                    href={`/catalogue?search=${query}`}
                                    onClick={onClose}
                                    className="text-or font-bold uppercase tracking-widest text-xs hover:underline"
                                >
                                    Voir tous les résultats →
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
