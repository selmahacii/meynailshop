'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Trash2,
    Image as ImageIcon,
    AlertCircle,
    Loader,
    CheckCircle2,
    Package,
    Tag,
    BarChart3,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ProductsAPI } from '@/lib/api/client';
import { toast } from 'sonner';

export default function ProductEditPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const result = await ProductsAPI.getById(id as string);
            if (result.success) {
                setProduct(result.data);
            } else {
                setError(result.error || 'Produit introuvable');
            }
        } catch (err) {
            setError('Erreur lors du chargement du produit');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            // Prepare data for update
            const updateData = {
                name: product.name,
                sku: product.sku,
                price: Number(product.price),
                stock: Number(product.stock),
                stockAlert: Number(product.stockAlert),
                description: product.description,
                shortDescription: product.shortDescription,
                categoryId: product.categoryId,
                isActive: product.isActive,
                images: product.images,
            };

            const result = await ProductsAPI.update(id as string, updateData);
            if (result.success) {
                toast.success('Produit mis à jour avec succès');
                fetchProduct();
            } else {
                toast.error(result.error || 'Erreur lors de la mise à jour');
            }
        } catch (err) {
            toast.error('Erreur technique');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
        try {
            const result = await ProductsAPI.delete(id as string);
            if (result.success) {
                toast.success('Produit supprimé');
                router.push('/admin/produits');
            } else {
                toast.error(result.error || 'Erreur lors de la suppression');
            }
        } catch (err) {
            toast.error('Erreur technique');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-or animate-spin mx-auto mb-4" />
                    <p className="text-encre3 uppercase tracking-widest text-[10px] font-black">Chargement du produit...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="p-12 text-center bg-white border border-creme2 rounded-sm shadow-xl max-w-2xl mx-auto mt-12">
                <AlertCircle className="w-16 h-16 text-rouge mx-auto mb-4" />
                <h2 className="text-2xl font-serif text-encre mb-4">Produit non trouvé</h2>
                <p className="text-encre3 mb-8">Le produit que vous essayez de modifier n'existe pas ou a été supprimé.</p>
                <Link href="/admin/produits" className="inline-block px-8 py-3 bg-encre text-creme rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
                    Retour à la liste
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <button type="button" onClick={() => router.back()} className="p-3 bg-white border border-creme2 rounded-full hover:border-or transition-all group">
                        <ArrowLeft size={20} className="text-encre3 group-hover:text-or" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif text-encre">{product.name}</h1>
                        <p className="text-[10px] uppercase font-bold text-encre3 tracking-widest mt-1">SKU: {product.sku} — ID: {product.id.slice(0, 8)}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button 
                        type="button"
                        onClick={handleDelete}
                        className="px-6 py-3 border border-rouge text-rouge rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-rouge hover:text-creme transition-all"
                    >
                        <Trash2 size={16} className="inline mr-2" />
                        Supprimer
                    </button>
                    <button 
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-[#1A0A0A] text-creme rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center"
                    >
                        {saving ? (
                            <Loader size={16} className="animate-spin mr-2" />
                        ) : (
                            <Save size={16} className="mr-2 text-or" />
                        )}
                        Enregistrer
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Info */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-creme/5 flex items-center space-x-3">
                            <Package size={18} className="text-or" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-encre">Informations Générales</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Nom du produit</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={product.name}
                                        onChange={(e) => setProduct({...product, name: e.target.value})}
                                        className="w-full p-4 bg-creme2/50 border border-creme rounded-sm text-sm focus:border-or focus:ring-1 focus:ring-or outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">SKU (Référence)</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={product.sku}
                                        onChange={(e) => setProduct({...product, sku: e.target.value})}
                                        className="w-full p-4 bg-creme2/50 border border-creme rounded-sm text-sm focus:border-or focus:ring-1 focus:ring-or outline-none transition-all font-mono"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Description courte</label>
                                <textarea 
                                    rows={2}
                                    value={product.shortDescription || ''}
                                    onChange={(e) => setProduct({...product, shortDescription: e.target.value})}
                                    className="w-full p-4 bg-creme2/50 border border-creme rounded-sm text-sm focus:border-or focus:ring-1 focus:ring-or outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Description détaillée</label>
                                <textarea 
                                    rows={6}
                                    value={product.description || ''}
                                    onChange={(e) => setProduct({...product, description: e.target.value})}
                                    className="w-full p-4 bg-creme2/50 border border-creme rounded-sm text-sm focus:border-or focus:ring-1 focus:ring-or outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-creme/5 flex items-center space-x-3">
                            <ImageIcon size={18} className="text-or" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-encre">Médias & Images</h2>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.images?.map((img: string, i: number) => (
                                    <div key={i} className="relative aspect-square rounded-sm border border-creme2 overflow-hidden group shadow-md">
                                        <img 
                                            src={img} 
                                            alt="" 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const newImages = [...product.images];
                                                    newImages.splice(i, 1);
                                                    setProduct({...product, images: newImages});
                                                }}
                                                className="p-2 bg-rouge text-creme rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="aspect-square rounded-sm border-2 border-dashed border-creme2 flex flex-col items-center justify-center text-encre3 hover:border-or hover:text-or hover:bg-creme/30 transition-all group">
                                    <div className="w-10 h-10 rounded-full bg-creme2 flex items-center justify-center group-hover:bg-or/10 transition-colors">
                                        <Plus size={20} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest mt-2">Ajouter image</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Inventory & Pricing */}
                    <div className="bg-[#1A0A0A] text-creme rounded-sm shadow-2xl overflow-hidden border border-white/5">
                        <div className="p-6 border-b border-white/10 flex items-center space-x-3 bg-black/20">
                            <BarChart3 size={18} className="text-or" />
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-creme/80">Stock & Prix</h2>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase font-black tracking-[0.2em] text-creme/40">Prix de vente public</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        required
                                        value={product.price}
                                        onChange={(e) => setProduct({...product, price: parseFloat(e.target.value)})}
                                        className="w-full p-5 bg-white/5 border border-white/10 rounded-sm text-2xl font-bold text-or outline-none focus:border-or transition-all appearance-none"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-creme/20 font-black text-sm">DA</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[9px] uppercase font-black tracking-[0.2em] text-creme/40">Quantité en stock</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={product.stock}
                                        onChange={(e) => setProduct({...product, stock: parseInt(e.target.value)})}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-sm text-sm font-bold outline-none focus:border-or transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] uppercase font-black tracking-[0.2em] text-creme/40">Alerte stock bas</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={product.stockAlert || 5}
                                        onChange={(e) => setProduct({...product, stockAlert: parseInt(e.target.value)})}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-sm text-sm font-bold outline-none focus:border-or transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Classification */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-creme/5 flex items-center space-x-3">
                            <Tag size={18} className="text-or" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-encre">Classification</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Catégorie</label>
                                <select 
                                    value={product.categoryId}
                                    onChange={(e) => setProduct({...product, categoryId: e.target.value})}
                                    className="w-full p-4 bg-creme2/50 border border-creme rounded-sm text-sm font-bold outline-none focus:border-or appearance-none transition-all"
                                >
                                    <option value={product.categoryId}>Sélectionner...</option>
                                    {/* These mapping should be dynamic from categories API ideally */}
                                    <option value="vernis">Vernis Gel</option>
                                    <option value="uv">Gel UV</option>
                                    <option value="deco">Décoration</option>
                                    <option value="materiel">Matériel</option>
                                </select>
                            </div>
                            <div className="pt-6 border-t border-creme2">
                                <div className="flex items-center justify-between p-4 bg-creme/50 rounded-sm border border-creme2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-encre">Statut catalogue</span>
                                        <span className="text-[9px] text-encre3 uppercase mt-1">Actif / Inactif</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setProduct({...product, isActive: !product.isActive})}
                                        className={cn(
                                            "w-12 h-6 rounded-full relative transition-all duration-300",
                                            product.isActive ? "bg-green-600" : "bg-creme2"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-300",
                                            product.isActive ? "right-1" : "left-1"
                                        )} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
