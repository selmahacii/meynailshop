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
import { MessageCircle } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { cn } from '@/lib/utils';
import ProductReviews from '@/components/store/products/ProductReviews';
import Image from 'next/image';
import StickyAddToCart from '@/components/store/products/StickyAddToCart';

 

export default function ProductPage() {
    const { slug } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
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



    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            quantity: quantity,
            stock: product.stock
        });
        toast.success(`${quantity} ${product.name} ajoutés au panier`);
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
                            selectedImage={selectedVariant !== null ? product.variants[selectedVariant]?.image : null}
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
                            <div className="flex items-center space-x-3 mb-6 bg-creme2/20 p-3 rounded-sm border border-creme2 w-fit">
                                <span className="text-xs font-black uppercase tracking-widest text-encre3">Réf :</span>
                                <span className="text-sm font-mono font-black text-encre tracking-widest">
                                    {selectedVariant !== null && product.variants[selectedVariant]?.sku 
                                        ? product.variants[selectedVariant].sku 
                                        : product.sku}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center space-x-4 mb-8">
                            {product && (
                                <>
                                    <span className="text-3xl font-bold text-rouge-deep">{formatPrice(product.price)}</span>
                                    {product.comparePrice && (
                                        <span className="text-xl text-encre3 line-through">{formatPrice(product.comparePrice)}</span>
                                    )}
                                </>
                            )}
                            {product && product.comparePrice && (
                                <span className="bg-rouge/10 text-rouge text-xs font-bold px-2 py-1 rounded-sm">
                                    -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                </span>
                            )}
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

                        {/* Inventory Status */}
                        <div className="flex items-center space-x-2 mb-8">
                            <div className={`w-2 h-2 rounded-full ${product && product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-encre">
                                {product ? (product.stock > 0 ? 'En Stock' : 'Rupture de stock') : ''}
                            </span>
                        </div>

                        {/* Variants Section */}
                        {product && product.hasVariants && product.variants && product.variants.length > 0 && (
                            <div className="mb-8">
                                <p className="text-[10px] font-black uppercase tracking-widest text-encre3 mb-3">Références disponibles</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {product.variants.map((variant: any, index: number) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setSelectedVariant(selectedVariant === index ? null : index)}
                                            className={cn(
                                                "relative flex items-center gap-3 p-3 border rounded-sm transition-all text-left",
                                                selectedVariant === index
                                                    ? "border-or bg-or/5 shadow-md"
                                                    : "border-creme2 bg-white hover:border-or/50 hover:shadow-sm"
                                            )}
                                        >
                                            {variant.image && (
                                                <div className="relative w-10 h-10 rounded-sm border border-creme2 overflow-hidden shrink-0">
                                                    <Image src={variant.image} fill className="object-cover" alt={variant.label} />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-encre truncate">{variant.label}</p>
                                                <p className="text-[9px] font-mono text-encre3">{variant.sku}</p>
                                            </div>
                                            {selectedVariant === index && (
                                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-or"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col space-y-4 mb-10">
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center border border-creme2 bg-white rounded-sm h-14">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 text-encre hover:text-or transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-encre">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product ? product.stock : 1, quantity + 1))}
                                        className="px-4 text-encre hover:text-or transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product || product.stock === 0}
                                    className="flex-grow bg-rouge-deep hover:bg-rouge-mid text-creme h-14 rounded-sm font-bold uppercase tracking-widest text-[10px] flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingBag className="mr-3" size={18} />
                                    Ajouter au panier
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
            />
        </div>
    );
}
