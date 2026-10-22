'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Image as ImageIcon,
    Loader,
    AlertCircle,
    ArrowLeft,
    Upload,
    Save,
    Package,
    X,
    FolderTree,
    Layers,
    ArrowRight,
    ExternalLink,
    RefreshCw,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { apiFetch, UploadAPI, SettingsAPI } from '@/lib/api/client';
import { toast } from 'sonner';

interface SubCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
    isActive?: boolean;
    categoryId: string;
    categoryName?: string;
    productsCount?: number;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    displayOrder: number;
    isActive: boolean;
    subCategories?: SubCategory[];
}

interface ProductItem {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    stock: number;
    images?: string[];
    categoryId?: string;
    subCategoryId?: string;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Selected / Main Category
    const mainCategory = categories.find(c => c.slug === 'produits-onglerie') || categories[0] || null;

    // Category Modal (Edit / Create)
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [catFormData, setCatFormData] = useState({
        name: '',
        slug: '',
        description: '',
        imageUrl: '',
        displayOrder: 0
    });
    const [uploadingCatImage, setUploadingCatImage] = useState(false);

    // SubCategory Modal (Edit / Transfer)
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<SubCategory | null>(null);
    const [subFormData, setSubFormData] = useState({
        name: '',
        slug: '',
        categoryId: '',
        imageUrl: '',
        description: '',
        displayOrder: 0,
    });
    const [uploadingSubImage, setUploadingSubImage] = useState(false);

    // Quick add subcategory inside category edit modal
    const [quickSubName, setQuickSubName] = useState('');
    const [addingQuickSub, setAddingQuickSub] = useState(false);

    // SubCategory Products Management Modal
    const [managingSubProducts, setManagingSubProducts] = useState<SubCategory | null>(null);
    const [subProductsList, setSubProductsList] = useState<ProductItem[]>([]);
    const [loadingSubProducts, setLoadingSubProducts] = useState(false);

    // Assign Products Picker Modal
    const [isAssignPickerOpen, setIsAssignPickerOpen] = useState(false);
    const [allCatalogProducts, setAllCatalogProducts] = useState<ProductItem[]>([]);
    const [loadingCatalog, setLoadingCatalog] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [assigningLoading, setAssigningLoading] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await apiFetch('/api/categories');
            if (res.data) {
                const cats = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setCategories(cats);
            }
        } catch {
            setError('Erreur lors du chargement des catégories');
        } finally {
            setLoading(false);
        }
    };

    // ================= CATEGORY ACTIONS =================
    const handleOpenCatModal = (category: Category | null = null) => {
        const cat = category || mainCategory;
        if (cat) {
            setEditingCategory(cat);
            setCatFormData({
                name: cat.name,
                slug: cat.slug,
                description: cat.description || '',
                imageUrl: cat.imageUrl || '',
                displayOrder: cat.displayOrder || 0
            });
        } else {
            setEditingCategory(null);
            setCatFormData({
                name: '',
                slug: '',
                description: '',
                imageUrl: '',
                displayOrder: 0
            });
        }
        setQuickSubName('');
        setIsCatModalOpen(true);
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingCategory
                ? `/api/categories/${editingCategory.id}`
                : '/api/categories';
            const method = editingCategory ? 'PATCH' : 'POST';

            const payload: any = {
                name: catFormData.name,
                slug: catFormData.slug || catFormData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                description: catFormData.description,
                imageUrl: catFormData.imageUrl,
                displayOrder: catFormData.displayOrder
            };

            const res = await apiFetch(url, {
                method,
                body: JSON.stringify(payload),
            });

            if (res.success) {
                // If editing main category, also synchronize settings for mobile cover photo
                if (catFormData.imageUrl && (editingCategory?.slug === 'produits-onglerie' || catFormData.slug === 'produits-onglerie')) {
                    SettingsAPI.update({ onglerieCollectionImage: catFormData.imageUrl }).catch(console.error);
                }

                toast.success(editingCategory ? 'Catégorie mise à jour avec succès !' : 'Catégorie créée !');
                setIsCatModalOpen(false);
                fetchCategories();
            } else {
                toast.error(res.error || 'Erreur lors de la sauvegarde');
            }
        } catch {
            toast.error('Erreur réseau');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUploadCategoryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingCatImage(true);
        try {
            const res = await UploadAPI.uploadProductImage(file);
            if (res.success && res.data?.url) {
                const newUrl = res.data.url;
                setCatFormData(prev => ({ ...prev, imageUrl: newUrl }));
                
                // If modifying main category directly, save immediately
                if (editingCategory) {
                    await apiFetch(`/api/categories/${editingCategory.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({ imageUrl: newUrl })
                    });
                    if (editingCategory.slug === 'produits-onglerie') {
                        await SettingsAPI.update({ onglerieCollectionImage: newUrl });
                    }
                    toast.success('Photo de couverture mise à jour !');
                    fetchCategories();
                } else {
                    toast.success('Photo uploadée !');
                }
            } else {
                toast.error(res.error || 'Erreur d\'upload');
            }
        } catch {
            toast.error('Erreur de transfert');
        } finally {
            setUploadingCatImage(false);
            e.target.value = '';
        }
    };

    const handleQuickAddSub = async () => {
        if (!quickSubName.trim() || !editingCategory) return;
        setAddingQuickSub(true);
        try {
            const res = await apiFetch(`/api/categories/${editingCategory.id}/sub-categories`, {
                method: 'POST',
                body: JSON.stringify({
                    name: quickSubName.trim(),
                    slug: quickSubName.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                })
            });
            if (res.success) {
                toast.success(`Sous-catégorie « ${quickSubName} » ajoutée !`);
                setQuickSubName('');
                await fetchCategories();
                // update local state of editingCategory
                setEditingCategory(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        subCategories: [...(prev.subCategories || []), res.data]
                    };
                });
            } else {
                toast.error(res.error || 'Erreur lors de l\'ajout');
            }
        } catch {
            toast.error('Erreur réseau');
        } finally {
            setAddingQuickSub(false);
        }
    };

    // ================= SUBCATEGORY ACTIONS =================
    const handleOpenSubModal = (sub: SubCategory | null = null, defaultCatId?: string) => {
        if (sub) {
            setEditingSub(sub);
            setSubFormData({
                name: sub.name,
                slug: sub.slug,
                categoryId: sub.categoryId,
                imageUrl: sub.imageUrl || '',
                description: sub.description || '',
                displayOrder: sub.displayOrder || 0,
            });
        } else {
            setEditingSub(null);
            const parentId = defaultCatId || mainCategory?.id || (categories.length > 0 ? categories[0].id : '');
            setSubFormData({
                name: '',
                slug: '',
                categoryId: parentId,
                imageUrl: '',
                description: '',
                displayOrder: 0,
            });
        }
        setIsSubModalOpen(true);
    };

    const handleSaveSubCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subFormData.name.trim()) {
            toast.error('Le nom est requis');
            return;
        }
        if (!subFormData.categoryId) {
            toast.error('Veuillez sélectionner une catégorie parente');
            return;
        }

        setSubmitting(true);
        try {
            if (editingSub) {
                const isTransferred = subFormData.categoryId !== editingSub.categoryId;
                const res = await apiFetch(`/api/categories/sub-categories/${editingSub.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        name: subFormData.name,
                        slug: subFormData.slug || subFormData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                        categoryId: subFormData.categoryId,
                        imageUrl: subFormData.imageUrl,
                        description: subFormData.description,
                        displayOrder: subFormData.displayOrder,
                    })
                });

                if (res.success) {
                    if (isTransferred) {
                        toast.success('Sous-catégorie et ses produits transférés avec succès !');
                    } else {
                        toast.success('Sous-catégorie mise à jour !');
                    }
                    setIsSubModalOpen(false);
                    fetchCategories();
                } else {
                    toast.error(res.error || 'Erreur lors de la modification');
                }
            } else {
                const res = await apiFetch(`/api/categories/${subFormData.categoryId}/sub-categories`, {
                    method: 'POST',
                    body: JSON.stringify({
                        name: subFormData.name,
                        slug: subFormData.slug || subFormData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                        imageUrl: subFormData.imageUrl,
                    })
                });

                if (res.success) {
                    toast.success('Nouvelle sous-catégorie créée !');
                    setIsSubModalOpen(false);
                    fetchCategories();
                } else {
                    toast.error(res.error || 'Erreur lors de la création');
                }
            }
        } catch {
            toast.error('Erreur réseau');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSubCategory = async (subId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?')) return;
        try {
            setSubmitting(true);
            const res = await apiFetch(`/api/categories/sub-categories/${subId}`, { method: 'DELETE' });
            if (res.success) {
                toast.success('Sous-catégorie supprimée');
                fetchCategories();
            } else {
                toast.error(res.error || 'Erreur lors de la suppression');
            }
        } catch {
            toast.error('Erreur');
        } finally {
            setSubmitting(false);
        }
    };

    // ================= SUBCATEGORY PRODUCTS ACTIONS =================
    const handleOpenProductsManager = async (sub: SubCategory) => {
        setManagingSubProducts(sub);
        fetchSubProducts(sub.id);
    };

    const fetchSubProducts = async (subId: string) => {
        setLoadingSubProducts(true);
        try {
            const res = await apiFetch(`/api/categories/sub-categories/${subId}/products`);
            if (res.success && res.data) {
                const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setSubProductsList(list);
            }
        } catch {
            toast.error('Erreur lors du chargement des produits');
        } finally {
            setLoadingSubProducts(false);
        }
    };

    const handleRemoveProductFromSub = async (productId: string) => {
        if (!managingSubProducts) return;
        try {
            const res = await apiFetch(`/api/categories/sub-categories/${managingSubProducts.id}/products/${productId}`, {
                method: 'DELETE'
            });
            if (res.success) {
                toast.success('Produit retiré de la sous-catégorie');
                setSubProductsList(prev => prev.filter(p => p.id !== productId));
                fetchCategories();
            } else {
                toast.error(res.error || 'Erreur lors du retrait');
            }
        } catch {
            toast.error('Erreur');
        }
    };

    // Assign Products Picker Modal
    const handleOpenAssignPicker = async () => {
        setIsAssignPickerOpen(true);
        setSelectedProductIds([]);
        setProductSearch('');
        if (allCatalogProducts.length === 0) {
            setLoadingCatalog(true);
            try {
                const res = await apiFetch('/api/products?limit=150');
                if (res.success && res.data) {
                    const paginated = res.data.data || res.data;
                    const items = paginated.items || paginated || [];
                    setAllCatalogProducts(items);
                }
            } catch {
                toast.error('Erreur lors du chargement du catalogue');
            } finally {
                setLoadingCatalog(false);
            }
        }
    };

    const handleAssignSelectedProducts = async (productIdsToAssign: string[]) => {
        if (!managingSubProducts || productIdsToAssign.length === 0) return;
        setAssigningLoading(true);
        try {
            const res = await apiFetch(`/api/categories/sub-categories/${managingSubProducts.id}/products`, {
                method: 'POST',
                body: JSON.stringify({ productIds: productIdsToAssign })
            });

            if (res.success) {
                toast.success(`${productIdsToAssign.length} produit(s) rattaché(s) à « ${managingSubProducts.name} » !`);
                setIsAssignPickerOpen(false);
                setSelectedProductIds([]);
                fetchSubProducts(managingSubProducts.id);
                fetchCategories();
            } else {
                toast.error(res.error || 'Erreur lors de l\'affectation');
            }
        } catch {
            toast.error('Erreur réseau');
        } finally {
            setAssigningLoading(false);
        }
    };

    const filteredCatalogProducts = allCatalogProducts.filter(p => {
        if (!productSearch) return true;
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
    });

    const activeSubCategories = mainCategory?.subCategories || [];
    const totalProductsCount = activeSubCategories.reduce((sum, s) => sum + (s.productsCount || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/produits" className="p-2.5 bg-white border border-creme2 rounded-xl hover:border-or transition-colors group shadow-sm">
                        <ArrowLeft size={18} className="text-encre3 group-hover:text-or" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif text-encre">Catégorie Principale & Sous-Catégories</h1>
                        <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">
                            Configuration complète de l'Univers Produits Onglerie et de ses rayons
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handleOpenSubModal(null, mainCategory?.id)}
                        className="flex items-center justify-center space-x-2 px-5 py-3 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl border border-[#BFA893]/20"
                    >
                        <Plus size={16} className="text-[#BFA893]" />
                        <span>Nouvelle Sous-Catégorie</span>
                    </button>
                    <button 
                        onClick={fetchCategories}
                        className="p-3 bg-white border border-creme2 hover:border-or text-encre3 hover:text-or rounded-xl transition-all shadow-sm"
                        title="Actualiser les données"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader className="w-10 h-10 text-or animate-spin" />
                    <p className="text-encre3 text-[10px] uppercase tracking-[0.2em] font-black">Chargement des catégories...</p>
                </div>
            ) : error ? (
                <div className="bg-rouge/5 border border-rouge/20 p-8 text-center rounded-2xl">
                    <AlertCircle className="w-12 h-12 text-rouge mx-auto mb-4" />
                    <p className="text-rouge font-bold">{error}</p>
                </div>
            ) : (
                <>
                    {/* ================= SECTION 1: CARTE DE LA CATÉGORIE PRINCIPALE ================= */}
                    {mainCategory && (
                        <div className="bg-white rounded-3xl border border-gold-brand/25 shadow-lg overflow-hidden transition-all">
                            <div className="p-6 sm:p-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
                                {/* Category Visual & Information */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
                                    <div className="relative w-32 h-36 sm:w-36 sm:h-40 rounded-2xl overflow-hidden bg-creme2 border-2 border-gold-brand/30 shadow-md shrink-0 group">
                                        <img 
                                            src={mainCategory.imageUrl || "https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=800&auto=format&fit=crop"} 
                                            alt={mainCategory.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="cursor-pointer p-2 bg-white/90 rounded-full text-encre hover:text-or transition-colors shadow">
                                                <Upload size={16} />
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={handleUploadCategoryImage}
                                                    className="hidden" 
                                                    disabled={uploadingCatImage}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gold-brand px-2.5 py-1 bg-gold-brand/10 rounded-full border border-gold-brand/20">
                                                Catégorie Principale Unique
                                            </span>
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-encre3 bg-creme2 px-2.5 py-1 rounded-full">
                                                slug: {mainCategory.slug}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-serif text-encre font-bold">
                                            {mainCategory.name}
                                        </h2>

                                        <p className="text-xs sm:text-sm text-encre3 leading-relaxed max-w-2xl">
                                            {mainCategory.description || "Toute notre sélection exclusive pour l'art et la beauté des ongles."}
                                        </p>

                                        <div className="flex items-center gap-4 pt-1">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-encre">
                                                <Layers size={14} className="text-gold-brand" />
                                                <span>{activeSubCategories.length} sous-catégories</span>
                                            </div>
                                            <span className="text-creme2">•</span>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-encre">
                                                <Package size={14} className="text-gold-brand" />
                                                <span>{totalProductsCount} produits associés</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions on Main Category */}
                                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-64 border-t lg:border-t-0 lg:border-l border-creme2 pt-4 lg:pt-0 lg:pl-8">
                                    <button
                                        onClick={() => handleOpenCatModal(mainCategory)}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md border border-[#BFA893]/20"
                                    >
                                        <Edit2 size={15} />
                                        <span>Modifier les infos & photo</span>
                                    </button>

                                    <label className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 px-5 bg-white border border-gold-brand/30 hover:border-gold-brand text-encre rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm">
                                        <Upload size={15} className="text-gold-brand" />
                                        <span>{uploadingCatImage ? 'Transfert...' : 'Changer la photo'}</span>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleUploadCategoryImage} 
                                            className="hidden" 
                                            disabled={uploadingCatImage}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= SECTION 2: SOUS-CATÉGORIES APPARTENANT À CETTE CATÉGORIE ================= */}
                    <div className="space-y-6 pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-serif text-encre">
                                        Sous-Catégories de « {mainCategory?.name || 'Produits Onglerie'} »
                                    </h2>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#390102] text-[#BFA893]">
                                        {activeSubCategories.length}
                                    </span>
                                </div>
                                <p className="text-xs text-encre3 mt-1">
                                    Les sous-catégories affichées aux clientes. Vous pouvez modifier leur photo, changer leur nom, transférer ou affecter directement des produits.
                                </p>
                            </div>

                            <button 
                                onClick={() => handleOpenSubModal(null, mainCategory?.id)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-creme2 hover:border-or text-encre rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                            >
                                <Plus size={15} className="text-or" />
                                <span>Ajouter une sous-catégorie</span>
                            </button>
                        </div>

                        {/* Subcategories Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {activeSubCategories.map((sub, index) => (
                                <div 
                                    key={sub.id} 
                                    className="bg-white border border-creme2 rounded-2xl overflow-hidden hover:border-gold-brand/40 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col group"
                                >
                                    {/* Subcategory Image Preview with quick upload */}
                                    <div className="relative aspect-[4/3] w-full bg-creme2 overflow-hidden border-b border-creme2">
                                        {sub.imageUrl ? (
                                            <img 
                                                src={sub.imageUrl} 
                                                alt={sub.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-encre3">
                                                <ImageIcon size={32} />
                                                <span className="text-[9px] uppercase tracking-widest mt-1">Sans image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-creme uppercase tracking-wider">
                                            N° {index + 1}
                                        </div>
                                        <div className="absolute top-2 right-2 bg-gold-brand px-2 py-0.5 rounded text-[9px] font-black text-black uppercase tracking-wider shadow">
                                            {sub.productsCount ?? 0} produits
                                        </div>
                                    </div>

                                    {/* Subcategory Info */}
                                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                            <h3 className="text-base font-serif font-bold text-encre leading-snug">{sub.name}</h3>
                                            <p className="text-[10px] text-encre3 font-mono mt-0.5 truncate">slug: {sub.slug}</p>
                                            {sub.description && (
                                                <p className="text-xs text-encre3 mt-2 line-clamp-2 leading-relaxed">{sub.description}</p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-2 pt-2 border-t border-creme2">
                                            {/* Manage Products Button */}
                                            <button
                                                onClick={() => handleOpenProductsManager(sub)}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-creme/60 hover:bg-[#390102] text-encre hover:text-[#BFA893] rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-gold-brand/20 shadow-sm"
                                            >
                                                <Package size={14} />
                                                <span>Gérer les produits ({sub.productsCount ?? 0})</span>
                                            </button>

                                            {/* Edit & Transfer / Delete */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenSubModal(sub)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-creme2 hover:border-or rounded-xl text-[10px] font-bold uppercase tracking-wider text-encre transition-all"
                                                    title="Modifier le nom, image ou transférer"
                                                >
                                                    <Edit2 size={12} className="text-or" />
                                                    <span>Modifier</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSubCategory(sub.id)}
                                                    className="p-2 text-encre3 hover:text-rouge hover:bg-rouge/5 rounded-xl border border-transparent hover:border-rouge/20 transition-all"
                                                    title="Supprimer la sous-catégorie"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* ================= MODAL 1: EDIT MAIN CATEGORY (AVEC SOUS-CATÉGORIES APPARTENANTES) ================= */}
            {isCatModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && setIsCatModalOpen(false)} />
                    <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl border border-or/20 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-creme2 bg-creme/10 flex justify-between items-center shrink-0">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-gold-brand">Catégorie Principale</span>
                                <h2 className="text-2xl font-serif text-encre">
                                    {editingCategory ? `Modifier « ${editingCategory.name} »` : 'Nouvelle Catégorie'}
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsCatModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center text-encre3 hover:text-rouge rounded-full text-lg"
                                disabled={submitting}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSaveCategory} className="overflow-y-auto flex-1 p-6 space-y-6">
                            {/* Nom & Slug */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Nom de la catégorie *</label>
                                    <input
                                        type="text"
                                        value={catFormData.name}
                                        onChange={(e) => setCatFormData(prev => ({ 
                                            ...prev, 
                                            name: e.target.value,
                                            slug: prev.slug || e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                                        }))}
                                        className="w-full p-3 bg-creme/20 border border-creme2 rounded-xl text-sm font-bold text-encre focus:border-or focus:outline-none"
                                        placeholder="Ex: Produits Onglerie"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Slug (identifiant URL) *</label>
                                    <input
                                        type="text"
                                        value={catFormData.slug}
                                        onChange={(e) => setCatFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        className="w-full p-3 bg-creme/20 border border-creme2 rounded-xl text-xs font-mono focus:border-or focus:outline-none"
                                        placeholder="produits-onglerie"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Description de la collection</label>
                                <textarea
                                    value={catFormData.description}
                                    onChange={(e) => setCatFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full p-3 bg-creme/20 border border-creme2 rounded-xl text-xs focus:border-or focus:outline-none h-20 resize-none leading-relaxed"
                                    placeholder="Courte description de l'univers affichée sur la boutique..."
                                />
                            </div>

                            {/* Photo de Couverture */}
                            <div className="space-y-3 p-4 bg-creme2/30 border border-gold-brand/20 rounded-2xl">
                                <label className="text-[10px] uppercase font-black tracking-widest text-gold-brand flex items-center gap-1.5">
                                    <ImageIcon size={14} />
                                    <span>Photo de Couverture (Accueil & Boutique)</span>
                                </label>

                                <div className="flex items-center gap-4">
                                    {catFormData.imageUrl ? (
                                        <div className="relative w-20 h-24 rounded-xl border border-creme2 overflow-hidden shrink-0 shadow-sm">
                                            <img src={catFormData.imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-24 rounded-xl border border-dashed border-creme2 flex items-center justify-center text-encre3 shrink-0">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}

                                    <div className="flex-1 space-y-2">
                                        <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gold-brand/30 hover:border-gold-brand rounded-xl text-xs font-bold uppercase tracking-wider text-encre shadow-sm transition-all">
                                            <Upload size={14} className="text-gold-brand" />
                                            <span>{uploadingCatImage ? 'Transfert...' : 'Uploader une photo'}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                disabled={uploadingCatImage}
                                                onChange={handleUploadCategoryImage}
                                            />
                                        </label>

                                        <input
                                            type="url"
                                            value={catFormData.imageUrl}
                                            onChange={(e) => setCatFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                            placeholder="Ou collez l'URL directe (https://...)"
                                            className="w-full p-2.5 bg-white border border-creme2 rounded-xl text-xs focus:border-or focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Sous-catégories appartenant à cette catégorie */}
                            {editingCategory && (
                                <div className="space-y-3 pt-2 border-t border-creme2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-encre flex items-center gap-1.5">
                                            <Layers size={14} className="text-or" />
                                            <span>Sous-catégories appartenant à cette catégorie ({editingCategory.subCategories?.length || 0})</span>
                                        </label>
                                    </div>

                                    {/* Quick Add Subcategory Input */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={quickSubName}
                                            onChange={(e) => setQuickSubName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleQuickAddSub())}
                                            placeholder="Ajouter une nouvelle sous-catégorie..."
                                            className="flex-1 p-2.5 bg-creme/20 border border-creme2 rounded-xl text-xs focus:border-or focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleQuickAddSub}
                                            disabled={addingQuickSub || !quickSubName.trim()}
                                            className="px-4 py-2.5 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 shrink-0"
                                        >
                                            {addingQuickSub ? 'Ajout...' : '+ Ajouter'}
                                        </button>
                                    </div>

                                    {/* List of Subcategories */}
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        {(editingCategory.subCategories || []).length === 0 ? (
                                            <p className="text-center text-xs text-encre3 italic py-4 bg-creme/20 rounded-xl">
                                                Aucune sous-catégorie rattachée.
                                            </p>
                                        ) : (
                                            editingCategory.subCategories?.map((sub) => (
                                                <div 
                                                    key={sub.id}
                                                    className="flex items-center justify-between p-2.5 bg-creme2/30 border border-creme2 rounded-xl text-xs"
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-creme2 border border-creme2 shrink-0">
                                                            {sub.imageUrl ? (
                                                                <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ImageIcon size={14} className="m-auto text-encre3" />
                                                            )}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <span className="font-bold text-encre truncate block">{sub.name}</span>
                                                            <span className="text-[10px] text-encre3 font-mono">{sub.slug}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setIsCatModalOpen(false);
                                                                handleOpenProductsManager(sub);
                                                            }}
                                                            className="px-2.5 py-1 bg-white border border-creme2 hover:border-or rounded-lg text-[10px] font-bold text-encre flex items-center gap-1"
                                                        >
                                                            <Package size={11} className="text-or" />
                                                            <span>Produits</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setIsCatModalOpen(false);
                                                                handleOpenSubModal(sub);
                                                            }}
                                                            className="p-1.5 text-encre3 hover:text-or transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Modal Footer */}
                            <div className="pt-4 border-t border-creme2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCatModalOpen(false)}
                                    className="flex-1 py-3 border border-creme2 rounded-xl text-xs font-bold uppercase tracking-wider"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-3 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-2 shadow-md"
                                >
                                    {submitting && <Loader size={14} className="animate-spin" />}
                                    <span>Enregistrer les informations</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= MODAL 2: EDIT / TRANSFER SUBCATEGORY ================= */}
            {isSubModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && setIsSubModalOpen(false)} />
                    <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl border border-or/20 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-5 border-b border-creme2 bg-creme/10 flex justify-between items-center shrink-0">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-gold-brand">Sous-Catégorie</span>
                                <h2 className="text-xl font-serif text-encre">
                                    {editingSub ? `Modifier « ${editingSub.name} »` : 'Nouvelle Sous-Catégorie'}
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsSubModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center text-encre3 hover:text-rouge rounded-full text-lg"
                                disabled={submitting}
                            >
                                ×
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSaveSubCategory} className="overflow-y-auto flex-1 p-6 space-y-5">
                            {/* SubCategory Name */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Nom de la sous-catégorie *</label>
                                <input
                                    type="text"
                                    value={subFormData.name}
                                    onChange={(e) => setSubFormData(prev => ({ 
                                        ...prev, 
                                        name: e.target.value,
                                        slug: prev.slug || e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                                    }))}
                                    className="w-full p-3 bg-creme/20 border border-creme2 rounded-xl text-sm focus:border-or focus:outline-none"
                                    placeholder="Ex: Vernis effet gel"
                                    required
                                />
                            </div>

                            {/* SubCategory Slug */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Slug (identifiant URL) *</label>
                                <input
                                    type="text"
                                    value={subFormData.slug}
                                    onChange={(e) => setSubFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    className="w-full p-3 bg-creme/20 border border-creme2 rounded-xl text-xs font-mono focus:border-or focus:outline-none"
                                    placeholder="vernis-effet-gel"
                                    required
                                />
                            </div>

                            {/* Parent Category & Transfer Selector */}
                            <div className="space-y-1.5 p-4 bg-creme2/40 border border-gold-brand/20 rounded-2xl">
                                <label className="text-[10px] uppercase font-black tracking-widest text-gold-brand flex items-center gap-1.5">
                                    <FolderTree size={14} />
                                    <span>Catégorie Parente (Transférer)</span>
                                </label>
                                <p className="text-[11px] text-encre3 leading-relaxed">
                                    En changeant la catégorie parente, la sous-catégorie et tous ses produits seront automatiquement transférés.
                                </p>
                                <select
                                    value={subFormData.categoryId}
                                    onChange={(e) => setSubFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                    className="w-full p-3 bg-white border border-creme2 rounded-xl text-sm font-bold text-encre focus:border-or focus:outline-none mt-2"
                                    required
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} {c.slug === 'produits-onglerie' ? '(Catégorie Principale)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* SubCategory Image */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Photo de couverture</label>
                                <div className="flex items-center gap-3">
                                    {subFormData.imageUrl ? (
                                        <div className="relative w-16 h-16 rounded-xl border border-creme2 overflow-hidden shrink-0">
                                            <img src={subFormData.imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl border border-dashed border-creme2 flex items-center justify-center text-encre3 shrink-0">
                                            <ImageIcon size={20} />
                                        </div>
                                    )}

                                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-dashed border-creme2 hover:border-or rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer text-encre transition-all">
                                        <Upload size={14} className="text-or" />
                                        <span>{uploadingSubImage ? 'Transfert...' : 'Uploader une photo'}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploadingSubImage}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setUploadingSubImage(true);
                                                try {
                                                    const res = await UploadAPI.uploadProductImage(file);
                                                    if (res.success && res.data?.url) {
                                                        setSubFormData(prev => ({ ...prev, imageUrl: res.data.url }));
                                                        toast.success('Photo mise à jour');
                                                    }
                                                } catch {
                                                    toast.error('Erreur lors de l\'upload');
                                                } finally {
                                                    setUploadingSubImage(false);
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                    </label>
                                </div>

                                <input
                                    type="url"
                                    value={subFormData.imageUrl}
                                    onChange={(e) => setSubFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                    placeholder="Ou collez l'URL directe..."
                                    className="w-full p-2.5 bg-creme/20 border border-creme2 rounded-xl text-xs focus:border-or focus:outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Description courte</label>
                                <textarea
                                    value={subFormData.description}
                                    onChange={(e) => setSubFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full p-3 bg-creme/20 border border-creme2 rounded-xl text-xs focus:border-or focus:outline-none h-16 resize-none"
                                    placeholder="Courte description pour le bandeau sous-catégorie..."
                                />
                            </div>

                            {/* Display Order */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Ordre d'affichage</label>
                                <input
                                    type="number"
                                    value={subFormData.displayOrder}
                                    onChange={(e) => setSubFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                                    className="w-full p-3 bg-creme/20 border border-creme2 rounded-xl text-sm focus:border-or focus:outline-none"
                                    min={0}
                                />
                            </div>

                            {/* Footer Buttons */}
                            <div className="pt-4 border-t border-creme2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsSubModalOpen(false)}
                                    className="flex-1 py-3 border border-creme2 rounded-xl text-xs font-bold uppercase tracking-wider"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-3 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader size={14} className="animate-spin" />}
                                    <span>{editingSub ? 'Enregistrer les modifications' : 'Créer la sous-catégorie'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= MODAL 3: SUBCATEGORY PRODUCTS MANAGEMENT ================= */}
            {managingSubProducts && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setManagingSubProducts(null)} />
                    <div className="bg-white rounded-3xl w-full max-w-3xl relative z-10 shadow-2xl border border-or/20 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-creme2 bg-creme/10 flex justify-between items-center shrink-0">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-gold-brand">Affectation directe</span>
                                <h2 className="text-2xl font-serif text-encre">
                                    Produits dans « {managingSubProducts.name} »
                                </h2>
                                <p className="text-xs text-encre3 mt-0.5">
                                    {subProductsList.length} produit(s) actuellement rattaché(s) à cette sous-catégorie
                                </p>
                            </div>
                            <button
                                onClick={() => setManagingSubProducts(null)}
                                className="w-8 h-8 flex items-center justify-center text-encre3 hover:text-rouge rounded-full text-lg"
                            >
                                ×
                            </button>
                        </div>

                        {/* Top Actions Bar */}
                        <div className="p-4 bg-creme2/30 border-b border-creme2 flex flex-wrap items-center justify-between gap-3 shrink-0">
                            <button
                                onClick={handleOpenAssignPicker}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-md"
                            >
                                <Plus size={15} />
                                <span>Ajouter des produits du catalogue</span>
                            </button>

                            <Link
                                href={`/admin/produits/nouveau?categoryId=${managingSubProducts.categoryId}&subCategoryId=${managingSubProducts.id}`}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gold-brand/30 hover:border-gold-brand text-encre rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                            >
                                <ExternalLink size={14} className="text-or" />
                                <span>Créer un nouveau produit ici</span>
                            </Link>
                        </div>

                        {/* Product List */}
                        <div className="overflow-y-auto flex-1 p-6">
                            {loadingSubProducts ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Loader className="w-8 h-8 text-or animate-spin mb-2" />
                                    <p className="text-xs text-encre3 font-bold uppercase tracking-widest">Chargement des produits...</p>
                                </div>
                            ) : subProductsList.length === 0 ? (
                                <div className="text-center py-16 bg-creme2/30 rounded-2xl border border-dashed border-creme2 p-8">
                                    <Package size={40} className="mx-auto text-encre3/50 mb-3" />
                                    <h3 className="text-base font-serif text-encre">Aucun produit dans cette sous-catégorie</h3>
                                    <p className="text-xs text-encre3 max-w-sm mx-auto mt-1 mb-6">
                                        Cliquez sur « Ajouter des produits du catalogue » pour affecter immédiatement des produits existants.
                                    </p>
                                    <button
                                        onClick={handleOpenAssignPicker}
                                        className="px-5 py-2.5 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-wider"
                                    >
                                        + Ajouter des produits maintenant
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {subProductsList.map((product) => {
                                        const img = (product.images && product.images[0]) || '';
                                        return (
                                            <div 
                                                key={product.id}
                                                className="flex items-center justify-between p-3 bg-white border border-creme2 rounded-xl hover:border-gold-brand/40 shadow-sm transition-all"
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="relative w-12 h-12 rounded-lg bg-creme2 overflow-hidden shrink-0 border border-creme2">
                                                        {img ? (
                                                            <img src={img} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package size={18} className="m-auto text-encre3" />
                                                        )}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <h4 className="text-xs font-bold text-encre truncate max-w-[170px]" title={product.name}>
                                                            {product.name}
                                                        </h4>
                                                        <p className="text-[10px] text-encre3 font-mono">{product.sku}</p>
                                                        <span className="text-[11px] font-bold text-or">{product.price} DA</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveProductFromSub(product.id)}
                                                    className="p-2 text-encre3 hover:text-rouge hover:bg-rouge/5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                                                    title="Retirer de cette sous-catégorie"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-creme2 bg-creme/10 flex justify-end">
                            <button
                                onClick={() => setManagingSubProducts(null)}
                                className="px-6 py-2.5 bg-encre text-creme rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL 4: ASSIGN PRODUCTS PICKER ================= */}
            {isAssignPickerOpen && managingSubProducts && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsAssignPickerOpen(false)} />
                    <div className="bg-white rounded-3xl w-full max-w-2xl relative z-20 shadow-2xl border border-or/20 max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-5 border-b border-creme2 bg-creme/10 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-lg font-serif text-encre">
                                    Ajouter au sous-rayon « {managingSubProducts.name} »
                                </h3>
                                <p className="text-[10px] text-encre3 uppercase tracking-wider font-bold mt-0.5">
                                    Sélectionnez les produits à affecter immédiatement
                                </p>
                            </div>
                            <button
                                onClick={() => setIsAssignPickerOpen(false)}
                                className="w-8 h-8 flex items-center justify-center text-encre3 hover:text-rouge rounded-full"
                            >
                                ×
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="p-4 border-b border-creme2 bg-white flex items-center gap-3 shrink-0">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-encre3" />
                                <input
                                    type="text"
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                    placeholder="Rechercher par nom de produit ou SKU..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-creme/20 border border-creme2 rounded-xl text-xs focus:border-or focus:outline-none"
                                />
                            </div>
                            {selectedProductIds.length > 0 && (
                                <button
                                    onClick={() => handleAssignSelectedProducts(selectedProductIds)}
                                    disabled={assigningLoading}
                                    className="px-4 py-2.5 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center gap-2 shrink-0"
                                >
                                    {assigningLoading && <Loader size={12} className="animate-spin" />}
                                    <span>Ajouter la sélection ({selectedProductIds.length})</span>
                                </button>
                            )}
                        </div>

                        {/* Products List */}
                        <div className="overflow-y-auto flex-1 p-4 space-y-2">
                            {loadingCatalog ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Loader className="w-8 h-8 text-or animate-spin mb-2" />
                                    <p className="text-xs text-encre3 font-bold uppercase tracking-widest">Recherche dans le catalogue...</p>
                                </div>
                            ) : filteredCatalogProducts.length === 0 ? (
                                <p className="text-center text-xs text-encre3 italic py-12">Aucun produit trouvé pour cette recherche.</p>
                            ) : (
                                filteredCatalogProducts.map((p) => {
                                    const isAlreadyInSub = subProductsList.some(item => item.id === p.id);
                                    const isSelected = selectedProductIds.includes(p.id);
                                    const img = (p.images && p.images[0]) || '';

                                    return (
                                        <div 
                                            key={p.id}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-xl border transition-all",
                                                isAlreadyInSub 
                                                    ? "bg-creme/20 border-creme2 opacity-60" 
                                                    : isSelected
                                                        ? "bg-or/10 border-or ring-1 ring-or"
                                                        : "bg-white border-creme2 hover:border-gold-brand/40"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                {!isAlreadyInSub && (
                                                    <input 
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            setSelectedProductIds(prev => 
                                                                isSelected ? prev.filter(id => id !== p.id) : [...prev, p.id]
                                                            );
                                                        }}
                                                        className="w-4 h-4 accent-gold-brand rounded cursor-pointer"
                                                    />
                                                )}

                                                <div className="relative w-10 h-10 rounded-lg bg-creme2 overflow-hidden shrink-0 border border-creme2">
                                                    {img ? (
                                                        <img src={img} alt={p.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package size={16} className="m-auto text-encre3" />
                                                    )}
                                                </div>

                                                <div className="overflow-hidden">
                                                    <h4 className="text-xs font-bold text-encre truncate max-w-[260px]">{p.name}</h4>
                                                    <div className="flex items-center gap-2 text-[10px] text-encre3">
                                                        <span className="font-mono">{p.sku}</span>
                                                        <span>•</span>
                                                        <span className="font-bold text-or">{p.price} DA</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                {isAlreadyInSub ? (
                                                    <span className="text-[9px] font-black uppercase tracking-wider text-green-700 bg-green-100 px-2 py-1 rounded-md">
                                                        Déjà associé
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAssignSelectedProducts([p.id])}
                                                        disabled={assigningLoading}
                                                        className="px-3 py-1.5 bg-[#390102] text-[#BFA893] rounded-lg text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                                                    >
                                                        + Ajouter
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-creme2 bg-creme/10 flex justify-between items-center shrink-0">
                            <span className="text-[11px] text-encre3">
                                {selectedProductIds.length} produit(s) coché(s)
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAssignPickerOpen(false)}
                                    className="px-4 py-2 border border-creme2 rounded-xl text-xs font-bold uppercase tracking-wider"
                                >
                                    Fermer
                                </button>
                                {selectedProductIds.length > 0 && (
                                    <button
                                        onClick={() => handleAssignSelectedProducts(selectedProductIds)}
                                        disabled={assigningLoading}
                                        className="px-5 py-2 bg-[#390102] text-[#BFA893] rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90"
                                    >
                                        Valider l'ajout ({selectedProductIds.length})
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
