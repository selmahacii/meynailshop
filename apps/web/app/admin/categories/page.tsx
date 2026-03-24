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
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { apiFetch, UploadAPI } from '@/lib/api/client';
import { toast } from 'sonner';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    displayOrder: number;
    isActive: boolean;
    subCategories?: {
        id: string;
        name: string;
        slug: string;
    }[];
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        displayOrder: 0
    });
    const [submitting, setSubmitting] = useState(false);
    const [newSubCategoryName, setNewSubCategoryName] = useState('');

    const handleAddSubCategory = async () => {
        if (!newSubCategoryName || !editingCategory) return;
        try {
            setSubmitting(true);
            const res = await apiFetch(`/api/categories/${editingCategory.id}/sub-categories`, {
                method: 'POST',
                body: JSON.stringify({ name: newSubCategoryName }),
            });
            if (res.success) {
                toast.success('Sous-catégorie ajoutée !');
                setNewSubCategoryName('');
                fetchCategories().then(() => {
                    // Update editing category manually to refresh the list in the modal
                    setEditingCategory(prev => {
                        if (!prev) return null;
                        const updatedSub = [...(prev.subCategories || []), res.data];
                        return { ...prev, subCategories: updatedSub };
                    });
                });
            }
        } catch (err) {
            toast.error('Erreur lors de l\'ajout');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSub = async (subId: string) => {
        if (!confirm('Supprimer cette sous-catégorie ?')) return;
        try {
            setSubmitting(true);
            const res = await apiFetch(`/api/categories/sub-categories/${subId}`, { method: 'DELETE' });
            if (res.success) {
                toast.success('Supprimée !');
                setEditingCategory(prev => {
                    if (!prev) return null;
                    return { ...prev, subCategories: prev.subCategories?.filter(s => s.id !== subId) };
                });
                fetchCategories();
            }
        } catch (err) {
            toast.error('Erreur');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await apiFetch('/api/categories');
            if (res.data) {
                setCategories(Array.isArray(res.data) ? res.data : (res.data.data || []));
            }
        } catch (err) {
            setError('Erreur lors du chargement des catégories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category: Category | null = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description,
                imageUrl: category.imageUrl,
                displayOrder: category.displayOrder || 0
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
                imageUrl: '',
                displayOrder: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingCategory
                ? `/api/categories/${editingCategory.id}`
                : '/api/categories';

            const method = editingCategory ? 'PATCH' : 'POST';

            const res = await apiFetch(url, {
                method,
                body: JSON.stringify({
                    ...formData,
                    slug: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                }),
            });

            if (res.success) {
                toast.success(editingCategory ? 'Catégorie mise à jour !' : 'Catégorie créée !');
                setIsModalOpen(false);
                fetchCategories();
            } else {
                toast.error(res.error || 'Une erreur est survenue');
            }
        } catch (err) {
            toast.error('Erreur de connexion');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

        try {
            const res = await apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (res.success || res.data !== undefined) {
                toast.success('Catégorie supprimée');
                fetchCategories();
            } else {
                toast.error('Erreur lors de la suppression');
            }
        } catch (err) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setSubmitting(true);
            const result = await UploadAPI.uploadProductImage(file);
            if (result.success && result.data?.url) {
                setFormData(prev => ({ ...prev, imageUrl: result.data.url }));
                toast.success('Image uploadée avec succès');
            } else {
                toast.error(result.error || 'Erreur lors de l\'upload');
            }
        } catch (err) {
            toast.error('Erreur lors de l\'upload de l\'image');
        } finally {
            setSubmitting(false);
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/produits" className="p-2 bg-white border border-creme2 rounded-sm hover:border-or transition-colors group">
                        <ArrowLeft size={18} className="text-encre3 group-hover:text-or" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif text-encre">Catégories</h1>
                        <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">Gestion des catégories pour la filtration</p>
                    </div>
                </div>

                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#390102] text-[#BFA893] rounded-sm text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl group border border-[#BFA893]/20"
                >
                    <Plus size={16} className="text-[#BFA893] group-hover:rotate-90 transition-transform duration-300" />
                    <span>Nouvelle Catégorie</span>
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader className="w-10 h-10 text-or animate-spin" />
                    <p className="text-encre3 text-[10px] uppercase tracking-[0.2em] font-black">Chargement des collections...</p>
                </div>
            ) : error ? (
                <div className="bg-rouge/5 border border-rouge/20 p-8 text-center rounded-sm">
                    <AlertCircle className="w-12 h-12 text-rouge mx-auto mb-4" />
                    <p className="text-rouge font-bold">{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white border border-creme2 rounded-sm overflow-hidden group hover:border-or transition-all duration-500 shadow-sm hover:shadow-xl relative">
                            <div className="aspect-[16/10] relative overflow-hidden bg-creme/20">
                                {(() => {
                                    const displayImg = category.imageUrl?.includes('via.placeholder.com') 
                                        ? `https://images.unsplash.com/photo-1600050218444-14309070557e?q=80&w=800&auto=format&fit=crop`
                                        : category.imageUrl;

                                    return category.imageUrl ? (
                                        <Image 
                                            src={displayImg} 
                                            alt={category.name} 
                                            fill 
                                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://images.unsplash.com/photo-1632345033839-245a1e2ca9cb?q=80&w=800&auto=format&fit=crop`;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-encre3">
                                            <ImageIcon size={40} strokeWidth={1} />
                                            <p className="text-[10px] uppercase tracking-widest mt-2">Aucune image</p>
                                        </div>
                                    );
                                })()}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-xl font-serif text-creme">{category.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-creme/60 text-[10px] uppercase tracking-widest font-bold truncate max-w-[150px]">{category.description}</p>
                                        <span className="text-[10px] font-black text-or uppercase tracking-widest bg-or/10 px-1.5 py-0.5 rounded-sm">
                                            {category.subCategories?.length || 0} Sous-cat.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 flex items-center justify-between bg-white">
                                <span className="text-[10px] font-black text-encre3 uppercase tracking-widest">Ordre: {category.displayOrder}</span>
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => handleOpenModal(category)}
                                        className="p-2 text-encre3 hover:text-or hover:bg-or/5 transition-all rounded-sm border border-transparent hover:border-or/20"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(category.id)}
                                        className="p-2 text-encre3 hover:text-rouge-mid hover:bg-rouge/5 transition-all rounded-sm border border-transparent hover:border-rouge/20"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-creme/5 border-2 border-dashed border-creme2 rounded-sm flex flex-col items-center justify-center p-8 space-y-4 hover:border-or hover:bg-creme/10 transition-all group min-h-[250px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-creme2 flex items-center justify-center group-hover:bg-or/10 transition-colors">
                            <Plus size={32} className="text-encre3 group-hover:text-or transition-colors" />
                        </div>
                        <p className="font-serif text-lg text-encre3 group-hover:text-or transition-colors">Ajouter une collection</p>
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && setIsModalOpen(false)} />
                    <div className="bg-white rounded-sm w-full max-w-xl relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-or/20 max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="p-4 md:p-6 border-b border-creme2 bg-creme/10 flex justify-between items-center shrink-0">
                            <h2 className="text-xl md:text-2xl font-serif text-encre">
                                {editingCategory ? 'Éditer la catégorie' : 'Nouvelle catégorie'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center text-encre3 hover:text-rouge hover:bg-rouge/5 rounded-full transition-all text-xl font-bold"
                                disabled={submitting}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body — scrollable */}
                        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                            <div className="p-4 md:p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Nom de la catégorie *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full p-3 bg-creme/20 border border-creme2 rounded-sm focus:outline-none focus:border-or transition-all text-sm"
                                        placeholder="Ex: Vernis Gel Premium"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full p-3 bg-creme/20 border border-creme2 rounded-sm focus:outline-none focus:border-or transition-all h-20 text-sm resize-none"
                                        placeholder="Description pour le SEO et l'affichage..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Ordre d'affichage</label>
                                    <input
                                        type="number"
                                        value={formData.displayOrder ?? 0}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setFormData(prev => ({ ...prev, displayOrder: isNaN(val) ? 0 : val }));
                                        }}
                                        className="w-full p-3 bg-creme/20 border border-creme2 rounded-sm focus:outline-none focus:border-or transition-all text-sm"
                                        min={0}
                                    />
                                </div>

                                {/* Subcategories section */}
                                {editingCategory && (
                                    <div className="pt-6 border-t border-creme2 space-y-4">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-or">Gestion des Sous-catégories</label>
                                        
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newSubCategoryName}
                                                onChange={(e) => setNewSubCategoryName(e.target.value)}
                                                className="flex-grow p-3 bg-creme/20 border border-creme2 rounded-sm text-sm focus:border-or focus:outline-none"
                                                placeholder="Nom de la sous-catégorie..."
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubCategory())}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddSubCategory}
                                                disabled={submitting || !newSubCategoryName}
                                                className="px-4 bg-encre text-creme text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-black disabled:opacity-50"
                                            >
                                                Ajouter
                                            </button>
                                        </div>

                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                            {editingCategory.subCategories && editingCategory.subCategories.length > 0 ? (
                                                editingCategory.subCategories.map((sub) => (
                                                    <div key={sub.id} className="flex items-center justify-between p-3 bg-creme/20 border border-creme2 rounded-sm group">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-encre">{sub.name}</span>
                                                            <span className="text-[9px] text-encre3 font-mono">{sub.slug}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteSub(sub.id)}
                                                            className="p-1.5 text-encre3 hover:text-rouge hover:bg-rouge/5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-[10px] text-encre3 italic text-center py-4 bg-creme/10 rounded-sm">Aucune sous-catégorie définie.</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Image upload section */}
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Image de couverture</label>

                                    {/* Upload button */}
                                    <label className={cn(
                                        "flex items-center justify-center gap-3 p-4 border-2 border-dashed rounded-sm cursor-pointer transition-all group",
                                        submitting
                                            ? "border-or/40 bg-or/5 cursor-wait"
                                            : "border-creme2 hover:border-or hover:bg-or/5"
                                    )}>
                                        {submitting ? (
                                            <>
                                                <Loader size={18} className="text-or animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-or">Upload en cours...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon size={18} className="text-encre3 group-hover:text-or transition-colors" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-encre3 group-hover:text-or transition-colors">
                                                    {formData.imageUrl ? 'Changer l\'image' : 'Choisir une image'}
                                                </span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            disabled={submitting}
                                        />
                                    </label>

                                    {/* Or type URL */}
                                    <div className="relative">
                                        <span className="absolute -top-2.5 left-3 bg-white px-1 text-[9px] text-encre3 font-bold uppercase tracking-widest">ou URL</span>
                                        <input
                                            type="text"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                            className="w-full p-3 bg-creme/20 border border-creme2 rounded-sm focus:outline-none focus:border-or transition-all text-xs"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    {/* Preview */}
                                    {formData.imageUrl && (
                                        <div className="relative aspect-video rounded-sm overflow-hidden border border-creme2 shadow-sm">
                                            <Image
                                                src={formData.imageUrl}
                                                alt="Aperçu"
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                                className="absolute top-2 right-2 w-6 h-6 bg-rouge text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-rouge-deep transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 md:p-6 border-t border-creme2 bg-creme/5 flex gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={submitting}
                                    className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest border border-creme2 hover:bg-creme/20 transition-all rounded-sm disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !formData.name}
                                    className="flex-[2] py-3 bg-[#390102] text-[#BFA893] text-[10px] font-black uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-xl disabled:opacity-50 border border-[#BFA893]/20 flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader size={14} className="animate-spin" />}
                                    {submitting ? 'Traitement...' : (editingCategory ? 'Mettre à jour' : 'Créer la catégorie')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
