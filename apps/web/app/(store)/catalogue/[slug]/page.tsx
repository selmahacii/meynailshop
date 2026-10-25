'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ShoppingBag,
    Heart,
    Share2,
    Truck,
    ShieldCheck,
    RotateCcw,
    Plus,
    Minus,
    Star,
    Check
} from 'lucide-react';
import ProductGallery from '@/components/store/products/ProductGallery';
import ProductCard from '@/components/store/products/ProductCard';
import ProductCardSkeleton from '@/components/store/products/ProductCardSkeleton';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { formatPrice } from '@/lib/utils/currency';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'sonner';
import { StoreAPI } from '@/lib/api/client';
import { useEffect } from 'react';
import { useSettings } from '@/lib/hooks/useSettings';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { cn } from '@/lib/utils';
import ProductReviews from '@/components/store/products/ProductReviews';
import Image from 'next/image';
import StickyAddToCart from '@/components/store/products/StickyAddToCart';
import { motion } from 'framer-motion';

 

export default function ProductPage() {
    const { slug } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
    const [hoveredVariant, setHoveredVariant] = useState<number | null>(null);
    const addItem = useCartStore((state) => state.addItem);
    const { toggleItem, isInWishlist } = useWishlistStore();

    const [product, setProduct] = useState<any | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [productError, setProductError] = useState<string | null>(null);
    const [similarProducts, setSimilarProducts] = useState<any[]>([]);
    const [loadingSimilar, setLoadingSimilar] = useState(false);
    const [showSticky, setShowSticky] = useState(false);
    const { settings } = useSettings();


    
    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoadingProduct(true);
            try {
                const res = await StoreAPI.getProductBySlug(slug as string);
                if (res.success) {
                    if (mounted) setProduct(res.data);
                } else {
                    if (mounted) setProductError(res.error || 'Produit introuvable');
                }
            } catch (err) {
                if (mounted) setProductError('Impossible de charger le produit');
                console.error('Product fetch error:', err);
            } finally {
                if (mounted) setLoadingProduct(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [slug]);

    useEffect(() => {
        if (!product?.category?.slug) return;
        
        async function fetchSimilar() {
            setLoadingSimilar(true);
            try {
                const res = await StoreAPI.getProducts(1, 4, { category: product.category.slug });
                if (res.success) {
                    const items = res.data?.items || res.data || [];
                    setSimilarProducts(items.filter((item: any) => item.id !== product.id).slice(0, 4));
                }
            } catch (err) {
                console.error('Similar products fetch failed:', err);
            } finally {
                setLoadingSimilar(false);
            }
        }
        fetchSimilar();
    }, [product?.id]);

    useEffect(() => {
        const handleScroll = () => {
            // Show sticky add to cart after scrolling past the main desktop CTA area (~800px)
            if (window.scrollY > 800) {
                setShowSticky(true);
            } else {
                setShowSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const activeDisplayVariant = hoveredVariant !== null && product?.variants
        ? product.variants[hoveredVariant]
        : (selectedVariant !== null && product?.variants ? product.variants[selectedVariant] : null);

    const isOutOfStock = Boolean(
        product && (
            product.hasVariants
                ? (selectedVariant !== null
                    ? (!product.variants[selectedVariant]?.stock || product.variants[selectedVariant].stock <= 0)
                    : (product.variants && product.variants.length > 0 && product.variants.every((v: any) => !v.stock || v.stock <= 0)))
                : (!product.stock || product.stock <= 0)
        )
    );

    const currentStock = (product && product.hasVariants && selectedVariant !== null)
        ? (product.variants[selectedVariant]?.stock ?? 0)
        : (product?.stock ?? 0);

    const handleAddToCart = () => {
        if (!product) return;
        
        const variant = selectedVariant !== null ? product.variants[selectedVariant] : null;
        
        if (product.hasVariants && !variant) {
            toast.error("Veuillez sélectionner une référence");
            return;
        }

        if (!product.hasVariants && (!product.stock || product.stock <= 0)) {
            toast.error("Ce produit est actuellement en rupture de stock");
            return;
        }

        if (variant && (!variant.stock || variant.stock <= 0)) {
            toast.error("Cette référence est actuellement en rupture de stock");
            return;
        }

        const activePrice = (variant && variant.price !== undefined && variant.price !== null) 
            ? variant.price 
            : product.price;

        addItem({
            productId: product.id,
            name: product.name,
            price: activePrice,
            image: variant?.image || product.images?.[0] || '',
            quantity: quantity,
            stock: variant ? variant.stock : product.stock,
            variantSku: variant?.sku,
            variantImage: variant?.image
        });
        toast.success(`${quantity} ${product.name} ${variant ? `(${variant.sku})` : ''} ajoutés au panier`);
    };

    const handleWishlist = () => {
        if (!product) return;
        toggleItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            comparePrice: product.comparePrice,
            image: product.images?.[0] || '',
            slug: product.slug,
            stock: product.stock,
            category: product.category?.name,
        });
        if (isInWishlist(product.id)) {
            toast.success('Retiré des favoris');
        } else {
            toast.success('Ajouté aux favoris ❤️');
        }
    };

    return (
        <div className="pt-32 pb-24 bg-creme min-h-screen">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <div className="mb-8">
                    <Breadcrumbs 
                        items={[
                            { label: 'Catalogue', href: '/catalogue' }, 
                            { label: product ? product.name : 'Chargement...' }
                        ]} 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Left: Gallery */}
                    {loadingProduct ? (
                        <div className="aspect-square bg-creme2 animate-pulse rounded-sm" />
                    ) : product ? (
                        <ProductGallery 
                            images={[
                                ...(product.images || []),
                                ...(product.variants?.map((v: any) => v.image).filter((img: any) => img && !product.images?.includes(img)) || [])
                            ]} 
                            productName={product.name}
                            selectedImage={
                                hoveredVariant !== null && product.variants?.[hoveredVariant]?.image
                                    ? product.variants[hoveredVariant].image
                                    : (selectedVariant !== null ? product.variants?.[selectedVariant]?.image : null)
                            }
                        />
                    ) : null}

                    {/* Right: Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2 mb-4">
                            {product && (
                                <>
                                    <div className="flex text-or">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={14}
                                                className={s <= Math.round(product.averageRating || 5) ? 'fill-or' : 'text-creme2'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-encre3">({product.reviewCount || 0} avis)</span>
                                </>
                            )}
                        </div>

                        {loadingProduct ? (
                            <div className="h-12 w-3/4 bg-creme2 animate-pulse rounded mb-4" />
                        ) : product ? (
                            <h1 className="font-serif text-4xl md:text-5xl text-encre mb-4">{product.name}</h1>
                        ) : (
                            <h1 className="font-serif text-4xl md:text-5xl text-encre mb-4">Produit introuvable</h1>
                        )}

                        {/* SKU */}
                        {product && (
                            <div 
                                onClick={() => toast.info("Le SKU est une référence unique générée automatiquement.")}
                                className="flex items-center space-x-3 mb-6 bg-rouge-brand p-3.5 rounded-xl border border-gold-brand/30 w-fit cursor-help shadow-lg hover:shadow-rouge-brand/20 transition-all active:scale-95 group"
                            >
                                <span className="text-xs font-black uppercase tracking-widest text-gold-brand/60 group-hover:text-gold-brand transition-colors">Réf :</span>
                                <span className="text-sm font-mono font-black text-gold-brand tracking-widest">
                                    {selectedVariant !== null && product.variants[selectedVariant]?.sku 
                                        ? product.variants[selectedVariant].sku 
                                        : product.sku}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center space-x-4 mb-8">
                            {product && (() => {
                                const selectedVariantData = selectedVariant !== null ? product.variants[selectedVariant] : null;
                                const activePrice = (selectedVariantData && selectedVariantData.price !== undefined && selectedVariantData.price !== null)
                                    ? selectedVariantData.price
                                    : product.price;
                                const hasVariantPrice = selectedVariantData && selectedVariantData.price !== undefined && selectedVariantData.price !== null;
                                return (
                                    <>
                                        <span className="text-3xl font-bold text-rouge-deep">{formatPrice(activePrice)}</span>
                                        {!hasVariantPrice && product.comparePrice && (
                                            <span className="text-xl text-encre3 line-through">{formatPrice(product.comparePrice)}</span>
                                        )}
                                    </>
                                );
                            })()}
                            {product && (() => {
                                const selectedVariantData = selectedVariant !== null ? product.variants[selectedVariant] : null;
                                const hasVariantPrice = selectedVariantData && selectedVariantData.price !== undefined && selectedVariantData.price !== null;
                                const comparePrice = Number(product.comparePrice);
                                const price = Number(product.price);
                                return !hasVariantPrice && comparePrice > price && comparePrice > 0 ? (
                                    <span className="bg-rouge-brand text-gold-brand border border-gold-brand/20 text-xs font-black px-3 py-1.5 rounded-sm shadow-md">
                                        -{Math.round(((comparePrice - price) / comparePrice) * 100)}%
                                    </span>
                                ) : null;
                            })()}
                        </div>

                        <p className="text-encre3 leading-relaxed mb-8 text-lg font-light">
                            {product ? (product.description || product.shortDescription || 'Description indisponible.') : 'Description indisponible.'}
                        </p>

                        {/* Photo count indicator */}
                        {product && product.images && product.images.length > 1 && (
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex gap-1">
                                    {product.images.slice(0, 5).map((_: string, i: number) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-or/60" />
                                    ))}
                                </div>
                                <span className="text-[10px] uppercase font-bold text-encre3 tracking-widest">
                                    {product.images.length} photos disponibles
                                </span>
                            </div>
                        )}

                        {/* Inventory Status - Seule la rupture de stock est affichée si quantité = 0 */}
                        {isOutOfStock && (
                            <div className="flex items-center space-x-2 mb-8">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-rouge-deep">
                                    Rupture de stock
                                </span>
                            </div>
                        )}

                        {/* Variants Section with Identical Swatch Hover & Selected Effect */}
                        {product && product.hasVariants && product.variants && product.variants.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-3.5">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-encre3">
                                            Modèle / Réf :
                                        </p>
                                        <span className="text-xs font-bold text-encre">
                                            {activeDisplayVariant ? activeDisplayVariant.sku.replace('REF-', '') : 'Sélectionnez un modèle'}
                                        </span>
                                    </div>
                                    {activeDisplayVariant && (
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider",
                                            activeDisplayVariant.stock > 0 
                                                ? (activeDisplayVariant.stock <= (activeDisplayVariant.stockAlert || 5) ? "text-amber-700" : "text-emerald-700") 
                                                : "text-rouge font-black"
                                        )}>
                                            {activeDisplayVariant.stock > 0 
                                                ? (activeDisplayVariant.stock <= (activeDisplayVariant.stockAlert || 5) ? `Plus que ${activeDisplayVariant.stock} en stock` : 'En stock')
                                                : 'Rupture de stock'}
                                        </span>
                                    )}
                                </div>

                                {/* Swatches Grid */}
                                <div className="flex flex-wrap items-center gap-3 pt-1 pb-2">
                                    {product.variants.map((variant: any, index: number) => {
                                        const isSelected = selectedVariant === index;
                                        const isOutOfStock = variant.stock <= 0;
                                        const variantImg = variant.image || product.images?.[0] || 'https://placehold.co/120x120?text=' + encodeURIComponent(variant.sku);

                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                title={variant.sku}
                                                aria-label={variant.sku}
                                                onMouseEnter={() => setHoveredVariant(index)}
                                                onMouseLeave={() => setHoveredVariant(null)}
                                                onClick={() => {
                                                    if (isOutOfStock) {
                                                        toast.error("Cette référence est en rupture de stock");
                                                        return;
                                                    }
                                                    setSelectedVariant(isSelected ? null : index);
                                                }}
                                                className={cn(
                                                    "group relative w-[60px] h-[60px] sm:w-[66px] sm:h-[66px] rounded-[16px] overflow-hidden bg-white transition-all duration-200 cursor-pointer focus:outline-none shrink-0 border border-black/15 shadow-xs will-change-transform active:scale-95",
                                                    isSelected
                                                        ? "shadow-[0_0_0_2px_#FAF5EF,0_0_0_4px_#007185,0_0_0_5.5px_#111820] scale-[1.03]"
                                                        : isOutOfStock
                                                            ? "opacity-35 cursor-not-allowed hover:opacity-50"
                                                            : "hover:shadow-[0_0_0_2px_#FAF5EF,0_0_0_4px_#007185,0_0_0_5.5px_#111820] hover:scale-[1.03]"
                                                )}
                                            >
                                                <Image
                                                    src={variantImg}
                                                    alt={variant.sku}
                                                    fill
                                                    sizes="70px"
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                {isOutOfStock && (
                                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                        <div className="w-full h-[1.5px] bg-rouge-brand/70 -rotate-45" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col space-y-4 mb-10">
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className={cn("flex items-center border border-creme2 bg-white rounded-sm h-14", isOutOfStock && "opacity-50 pointer-events-none")}>
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={isOutOfStock || quantity <= 1}
                                        className="px-4 text-encre hover:text-or transition-colors disabled:opacity-50"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-encre">{isOutOfStock ? 0 : quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))}
                                        disabled={isOutOfStock || (currentStock > 0 && quantity >= currentStock)}
                                        className="px-4 text-encre hover:text-or transition-colors disabled:opacity-50"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product || isOutOfStock}
                                    className="flex-grow bg-rouge-deep hover:bg-rouge-mid text-creme h-14 rounded-sm font-bold uppercase tracking-widest text-[10px] flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingBag className="mr-3" size={18} />
                                    {isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
                                </button>

                                <button
                                    onClick={handleWishlist}
                                    className={cn(
                                        "w-14 h-14 border flex items-center justify-center transition-all rounded-sm shrink-0",
                                        product && isInWishlist(product.id)
                                            ? "border-rouge-deep text-rouge-deep bg-rouge-deep/5"
                                            : "border-creme2 text-encre hover:text-rouge-mid hover:border-rouge-mid"
                                    )}
                                >
                                    <Heart size={20} className={product && isInWishlist(product.id) ? 'fill-rouge-deep' : ''} />
                                </button>
                            </div>

                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-t border-creme2">
                            <div className="flex items-center space-x-3">
                                <Truck className="text-or" size={24} strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-encre">Livraison 58 Wilayas</p>
                                    <p className="text-[10px] text-encre3">Rapide & sécurisée</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <ShieldCheck className="text-or" size={24} strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-encre">Qualité Garantie</p>
                                    <p className="text-[10px] text-encre3">Produits 100% originaux</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RotateCcw className="text-or" size={24} strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-encre">Support Client</p>
                                    <p className="text-[10px] text-encre3">À votre écoute 7j/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                {product && (
                    <ProductReviews 
                        productId={product.id} 
                        productName={product.name} 
                    />
                )}

                {/* Similar Products */}
                <div className="mt-24 border-t border-creme2 pt-16">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="font-serif text-3xl text-encre mb-2">Vous aimerez aussi</h2>
                        <Link href="/catalogue" className="text-sm font-bold text-or hover:text-rouge-mid transition-colors uppercase tracking-[0.2em]">Voir toute la collection</Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                        {loadingSimilar ? (
                            Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                        ) : similarProducts.length > 0 ? (
                            similarProducts.map((p) => <ProductCard key={p.id} product={p} />)
                        ) : (
                            <p className="col-span-full text-center text-encre3 italic py-10">Aucun produit similaire trouvé</p>
                        )}
                    </div>
                </div>
            </div>

            <StickyAddToCart 
                product={product} 
                onAdd={handleAddToCart}
                visible={showSticky} 
                selectedVariantIndex={selectedVariant}
            />
        </div>
    );
}
