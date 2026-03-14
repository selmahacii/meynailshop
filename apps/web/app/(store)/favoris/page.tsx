'use client';

import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/currency';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    ShoppingBag,
    Trash2,
    ArrowLeft,
    Package,
    Star,
    Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function FavorisPage() {
    const { items, removeItem, clear } = useWishlistStore();
    const { addItem } = useCartStore();

    const handleAddToCart = (item: typeof items[0]) => {
        if (item.stock === 0) {
            toast.error('Ce produit est en rupture de stock');
            return;
        }
        addItem({
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
            stock: item.stock,
        });
        toast.success(`${item.name} ajouté au panier`);
    };

    const handleAddAllToCart = () => {
        const inStockItems = items.filter(i => i.stock > 0);
        if (inStockItems.length === 0) {
            toast.error('Aucun produit en stock dans vos favoris');
            return;
        }
        inStockItems.forEach(item => {
            addItem({
                productId: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1,
                stock: item.stock,
            });
        });
        toast.success(`${inStockItems.length} article${inStockItems.length > 1 ? 's' : ''} ajouté${inStockItems.length > 1 ? 's' : ''} au panier`);
    };

    return (
        <div className="pt-32 pb-24 bg-creme min-h-screen">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Breadcrumb */}
                <nav className="text-[10px] uppercase tracking-widest text-encre3 mb-8 flex items-center gap-2">
                    <Link href="/" className="hover:text-or transition-colors">Accueil</Link>
                    <span>/</span>
                    <span className="text-encre font-bold">Mes Favoris</span>
                </nav>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-rouge-deep/10 flex items-center justify-center">
                                <Heart size={20} className="text-rouge-deep fill-rouge-deep" />
                            </div>
                            <h1 className="font-serif text-3xl md:text-4xl text-encre">Mes Favoris</h1>
                        </div>
                        <p className="text-encre3 text-sm ml-13">
                            {items.length === 0
                                ? 'Votre liste de favoris est vide'
                                : `${items.length} article${items.length > 1 ? 's' : ''} sauvegardé${items.length > 1 ? 's' : ''}`}
                        </p>
                    </div>

                    {items.length > 0 && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleAddAllToCart}
                                className="flex items-center gap-2 px-5 py-3 bg-rouge-deep text-creme text-xs font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md rounded-sm"
                            >
                                <ShoppingBag size={16} />
                                Tout ajouter au panier
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm('Vider tous vos favoris ?')) clear();
                                }}
                                className="flex items-center gap-2 px-4 py-3 border border-creme2 text-encre3 text-xs font-bold uppercase tracking-widest hover:border-rouge hover:text-rouge transition-all rounded-sm"
                            >
                                <Trash2 size={14} />
                                Tout vider
                            </button>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-24"
                    >
                        <div className="relative inline-flex mb-8">
                            <div className="w-28 h-28 rounded-full bg-creme2 flex items-center justify-center">
                                <Heart size={48} className="text-creme2 stroke-[1.5]" strokeWidth={1.5} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-8 h-8 bg-or rounded-full flex items-center justify-center">
                                <Sparkles size={14} className="text-white" />
                            </div>
                        </div>
                        <h2 className="font-serif text-2xl text-encre mb-3">Aucun favori pour l'instant</h2>
                        <p className="text-encre3 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                            Explorez notre catalogue et cliquez sur le cœur ❤️ pour sauvegarder vos produits préférés ici.
                        </p>
                        <Link
                            href="/catalogue"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[#1A0A0A] text-creme text-xs font-bold uppercase tracking-widest hover:bg-rouge-deep transition-all shadow-xl rounded-sm"
                        >
                            <Package size={16} />
                            Découvrir le catalogue
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                            <AnimatePresence>
                                {items.map((item, idx) => (
                                    <motion.div
                                        key={item.productId}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        className="group bg-white border border-creme2 rounded-sm overflow-hidden shadow-sm hover:shadow-xl hover:border-or transition-all duration-300"
                                    >
                                        {/* Image */}
                                        <Link href={`/catalogue/${item.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-creme2">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                    sizes="(max-width: 768px) 100vw, 25vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package size={40} className="text-creme2" />
                                                </div>
                                            )}

                                            {/* Out of stock overlay */}
                                            {item.stock === 0 && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <span className="bg-rouge text-creme text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm">
                                                        Épuisé
                                                    </span>
                                                </div>
                                            )}

                                            {/* Remove button */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeItem(item.productId);
                                                    toast.success('Retiré des favoris');
                                                }}
                                                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-rouge-deep hover:bg-rouge-deep hover:text-white transition-all shadow-md opacity-0 group-hover:opacity-100"
                                                title="Retirer des favoris"
                                            >
                                                <Heart size={14} className="fill-current" />
                                            </button>
                                        </Link>

                                        {/* Info */}
                                        <div className="p-4">
                                            {item.category && (
                                                <p className="text-[9px] font-black text-or uppercase tracking-[0.2em] mb-1">{item.category}</p>
                                            )}
                                            <Link href={`/catalogue/${item.slug}`}>
                                                <h3 className="font-serif text-base text-encre hover:text-rouge-mid transition-colors line-clamp-1 mb-3">
                                                    {item.name}
                                                </h3>
                                            </Link>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-bold text-encre">{formatPrice(item.price)}</span>
                                                    {item.comparePrice && (
                                                        <span className="text-xs text-encre3 line-through">{formatPrice(item.comparePrice)}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                disabled={item.stock === 0}
                                                className={cn(
                                                    "w-full mt-3 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2",
                                                    item.stock === 0
                                                        ? "bg-creme2 text-encre3 cursor-not-allowed"
                                                        : "bg-[#1A0A0A] text-creme hover:bg-rouge-deep shadow-sm"
                                                )}
                                            >
                                                <ShoppingBag size={13} />
                                                {item.stock === 0 ? 'Épuisé' : 'Ajouter au panier'}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Continue shopping */}
                        <div className="text-center border-t border-creme2 pt-10">
                            <Link
                                href="/catalogue"
                                className="inline-flex items-center gap-3 text-sm font-bold text-encre3 hover:text-or transition-colors uppercase tracking-widest"
                            >
                                <ArrowLeft size={16} />
                                Continuer mes achats
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
