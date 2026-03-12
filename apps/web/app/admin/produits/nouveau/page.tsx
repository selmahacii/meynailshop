'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Loader,
    Package,
    Tag,
    BarChart3,
    Plus,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductsAPI } from '@/lib/api/client';
import { toast } from 'sonner';

export default function ProductCreatePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [product, setProduct] = useState<any>({
        name: '',
        sku: '',
        price: '',
        stock: '',
        stockAlert: '5',
        description: '',
        shortDescription: '',
        categoryId: '',
        isActive: true,
        images: [],
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            const createData = {
                ...product,
                price: Number(product.price),
                stock: Number(product.stock),
                stockAlert: Number(product.stockAlert),
                slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
                images: product.images.length > 0 ? product.images : ['https://placehold.co/800x800?text=' + encodeURIComponent(product.name)],
                costPrice: Number(product.price) * 0.4, // Mock cost price
            };

            const result = await ProductsAPI.create(createData);
            if (result.success) {
                toast.success('Produit créé avec succès');
                router.push('/admin/produits');
            } else {
                toast.error(result.error || 'Erreur lors de la création');
            }
        } catch (err) {
            toast.error('Erreur technique');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <button type="button" onClick={() => router.back()} className="p-3 bg-white border border-creme2 rounded-full hover:border-or transition-all group">
                        <ArrowLeft size={20} className="text-encre3 group-hover:text-or" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif text-encre">Nouveau Produit</h1>
                        <p className="text-[10px] uppercase font-bold text-encre3 tracking-widest mt-1">Ajouter une référence au catalogue</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button 
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-[#1A0A0A] text-creme rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center"
                    >
                        {saving ? <Loader size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2 text-or" />}
                        Créer le produit
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                        placeholder="Ex: Vernis OPI Red"
                                        value={product.name}
                                        onChange={(e) => setProduct({...product, name: e.target.value})}
                                        className="w-full p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm focus:border-or outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">SKU (Référence)</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="MEY-001"
                                        value={product.sku}
                                        onChange={(e) => setProduct({...product, sku: e.target.value})}
                                        className="w-full p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm focus:border-or outline-none transition-all font-mono"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Description courte</label>
                                <textarea 
                                    rows={2}
                                    placeholder="Résumé accrocheur pour la boutique (ex: Vernis rouge passion tenue longue durée...)"
                                    value={product.shortDescription}
                                    onChange={(e) => setProduct({...product, shortDescription: e.target.value})}
                                    className="w-full p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm focus:border-or outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Description complète</label>
                                <textarea 
                                    rows={5}
                                    placeholder="Détails techniques, conseils d'application, ingrédients..."
                                    value={product.description}
                                    onChange={(e) => setProduct({...product, description: e.target.value})}
                                    className="w-full p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm focus:border-or outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image URL input */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-creme/5 flex items-center space-x-3">
                            <ImageIcon size={18} className="text-or" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-encre">Images (URLs)</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Coller l'URL d'une image ici..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = (e.target as HTMLInputElement).value;
                                            if (val && val.startsWith('http')) {
                                                setProduct({...product, images: [...product.images, val]});
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }
                                    }}
                                    className="flex-grow p-4 bg-creme2/20 border border-creme2 rounded-sm text-sm focus:border-or outline-none"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder="Coller l\'URL d\'une image ici..."]') as HTMLInputElement;
                                        if (input && input.value && input.value.startsWith('http')) {
                                            setProduct({...product, images: [...product.images, input.value]});
                                            input.value = '';
                                        }
                                    }}
                                    className="px-6 bg-creme border border-creme2 text-encre3 font-bold text-[10px] uppercase tracking-widest hover:border-or hover:text-or transition-all"
                                >
                                    Ajouter
                                </button>
                            </div>
                            <p className="text-[10px] text-encre3 font-medium italic">* Pour le moment, utilisez des URLs d'images (ex: Imgur, Pinterest, etc.)</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.images.map((img: string, i: number) => (
                                    <div key={i} className="aspect-square bg-creme rounded-sm relative group overflow-hidden border border-creme2 shadow-sm">
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const news = [...product.images];
                                                    news.splice(i, 1);
                                                    setProduct({...product, images: news});
                                                }}
                                                className="p-1.5 bg-rouge text-creme rounded-full"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Pricing */}
                    <div className="bg-[#1A0A0A] text-creme rounded-sm shadow-2xl overflow-hidden border border-white/5">
                        <div className="p-6 border-b border-white/10 flex items-center space-x-3 bg-black/20">
                            <BarChart3 size={18} className="text-or" />
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-creme/80">Prix & Stock</h2>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase font-black tracking-[0.2em] text-creme/40">Prix de vente conseillé (DA)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        required
                                        placeholder="0"
                                        value={product.price}
                                        onChange={(e) => setProduct({...product, price: e.target.value})}
                                        className="w-full p-5 bg-white/5 border border-white/10 rounded-sm text-2xl font-bold text-or outline-none focus:border-or appearance-none"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-creme/20 font-black text-sm">DA</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase font-black tracking-[0.2em] text-creme/40">Inventaire Initial</label>
                                <input 
                                    type="number" 
                                    required
                                    placeholder="0"
                                    value={product.stock}
                                    onChange={(e) => setProduct({...product, stock: e.target.value})}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-sm text-sm font-bold outline-none focus:border-or appearance-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Classification */}
                    <div className="bg-white border border-creme2 rounded-sm shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-creme2 bg-creme/5 flex items-center space-x-3">
                            <Tag size={18} className="text-or" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-encre">Catégorie</h2>
                        </div>
                        <div className="p-8">
                            <select 
                                required
                                value={product.categoryId}
                                onChange={(e) => setProduct({...product, categoryId: e.target.value})}
                                className="w-full p-4 bg-creme2/50 border border-creme2 rounded-sm text-sm font-bold outline-none focus:border-or transition-all"
                            >
                                <option value="">Sélectionner une catégorie...</option>
                                <option value="vernis">Vernis Gel</option>
                                <option value="uv">Gel UV</option>
                                <option value="deco">Décoration</option>
                                <option value="materiel">Matériel</option>
                            </select>
                        </div>
                    </div>

                    {/* Tip */}
                    <div className="p-6 bg-or/5 border border-or/10 rounded-sm">
                        <p className="text-[10px] text-encre3 leading-relaxed">
                            <span className="font-black text-or uppercase">CONSEIL :</span> Utilisez des noms clairs et des SKUs logiques pour faciliter la gestion de votre inventaire et vos futures recherches.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
}
