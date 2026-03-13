'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { ProductsAPI, UploadAPI } from '@/lib/api/client';
import { toast } from 'sonner';

export default function ProductEditPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<any>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const result = await UploadAPI.uploadProductImage(file);
            if (result.success) {
                const url = result.data.url;
                setProduct((prev: any) => ({
                    ...prev,
                    images: [...(prev.images || []), url]
                }));
                toast.success('Image uploadée avec succès');
            } else {
                toast.error(result.error || 'Erreur lors de l\'upload');
            }
        } catch (err) {
            toast.error('Erreur technique lors de l\'upload');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

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
        <form onSubmit={handleSave} className="space-y-6 md:space-y-8 p-4 md:p-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-3 md:space-x-4">
                    <button type="button" onClick={() => router.back()} className="p-2 md:p-3 bg-white border border-creme2 rounded-full hover:border-or transition-all group shrink-0">
                        <ArrowLeft size={18} className="text-encre3 group-hover:text-or" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-serif text-encre">{product.name}</h1>
                        <p className="text-[9px] md:text-[10px] uppercase font-bold text-encre3 tracking-widest mt-1">SKU: {product.sku} — ID: {product.id.slice(0, 8)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <button 
                        type="button"
                        onClick={handleDelete}
                        className="flex-1 md:flex-none px-4 md:px-6 py-3 border border-rouge text-rouge rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-rouge hover:text-creme transition-all"
                    >
                        <Trash2 size={16} className="inline md:mr-2" />
                        <span className="hidden md:inline">Supprimer</span>
                    </button>
                    <button 
                        type="submit"
                        disabled={saving}
                        className="flex-1 md:flex-none px-6 md:px-8 py-3 bg-[#1A0A0A] text-creme rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center"
                    >
                        {saving ? (
                            <Loader size={16} className="animate-spin mr-2" />
                        ) : (
                            <Save size={16} className="mr-2 text-or" />
                        )}
                        <span>Enregistrer</span>
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
                        <div className="p-6 border-b border-creme2 bg-creme/5 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <ImageIcon size={18} className="text-or" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-encre">Médias & Images</h2>
                            </div>
                            {uploading && (
                                <div className="flex items-center text-[10px] font-bold text-or uppercase animate-pulse">
                                    <Loader size={12} className="animate-spin mr-2" />
                                    Upload en cours...
                                </div>
                            )}
                        </div>
                        <div className="p-8">
                            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-creme2 rounded-sm hover:border-or hover:bg-creme/30 transition-all cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-creme flex items-center justify-center mb-3 group-hover:bg-or/10">
                                        <Plus size={24} className="text-encre3 group-hover:text-or" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-encre">Appareil Photo / Galerie</span>
                                    <span className="text-[9px] text-encre3 mt-1">Prendre une photo ou choisir un fichier</span>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="hidden" 
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                </label>

                                <div className="flex flex-col space-y-3 justify-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-encre3 ml-1">Ajouter par URL</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="https://..."
                                            className="flex-grow p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm focus:border-or outline-none"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = (e.target as HTMLInputElement).value;
                                                    if (val && val.startsWith('http')) {
                                                        setProduct({...product, images: [...(product.images || []), val]});
                                                        (e.target as HTMLInputElement).value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const input = document.querySelector('input[placeholder="https://..."]') as HTMLInputElement;
                                                if (input && input.value && input.value.startsWith('http')) {
                                                    setProduct({...product, images: [...(product.images || []), input.value]});
                                                    input.value = '';
                                                }
                                            }}
                                            className="px-4 bg-encre text-creme text-[10px] font-bold uppercase tracking-widest rounded-sm"
                                        >
                                            OK
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.images?.map((img: string, i: number) => (
                                    <div key={i} className="relative aspect-square rounded-sm border border-creme2 overflow-hidden group shadow-md">
                                        <Image 
                                            src={img} 
                                            alt="" 
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
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
