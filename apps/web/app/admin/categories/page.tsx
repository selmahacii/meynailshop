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
import { ProductsAPI } from '@/lib/api/client';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    displayOrder: number;
    isActive: boolean;
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

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3001/api/categories');
            const data = await res.json();
            if (data.data) {
                setCategories(data.data);
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
                displayOrder: category.displayOrder
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
            const token = localStorage.getItem('token');
            const url = editingCategory 
                ? `http://localhost:3001/api/categories/${editingCategory.id}` 
                : 'http://localhost:3001/api/categories';
            
            const method = editingCategory ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    slug: formData.name.toLowerCase().replace(/ /g, '-')
                })
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchCategories();
            } else {
                const errData = await res.json();
                alert(errData.message || 'Une erreur est survenue');
            }
        } catch (err) {
            alert('Erreur de connexion');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3001/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                fetchCategories();
            }
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setSubmitting(true);
            const res = await fetch('http://localhost:3001/api/upload/product-image', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            }
        } catch (err) {
            alert('Erreur lors de l\'upload');
        } finally {
            setSubmitting(false);
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
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#1A0A0A] text-creme rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-rouge-deep transition-all shadow-xl group border border-or/20"
                >
                    <Plus size={16} className="text-or group-hover:rotate-90 transition-transform duration-300" />
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
                                {category.imageUrl ? (
                                        <Image 
                                            src={category.imageUrl} 
                                            alt={category.name} 
                                            fill 
                                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://images.unsplash.com/photo-1600050218444-14309070557e?q=80&w=800&auto=format&fit=crop`;
                                            }}
                                        />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-encre3">
                                        <ImageIcon size={40} strokeWidth={1} />
                                        <p className="text-[10px] uppercase tracking-widest mt-2">Aucune image</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-xl font-serif text-creme">{category.name}</h3>
                                    <p className="text-creme/60 text-[10px] uppercase tracking-widest font-bold truncate">{category.description}</p>
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
                    <div className="bg-white rounded-sm w-full max-w-xl relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border border-or/20">
                        <div className="p-6 border-b border-creme2 bg-creme/10 flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-encre">
                                {editingCategory ? 'Éditer la catégorie' : 'Nouvelle catégorie'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-encre3 hover:text-encre">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Nom de la catégorie</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full p-3 bg-creme/20 border border-creme2 rounded-sm focus:outline-none focus:border-or transition-all"
                                    placeholder="Ex: Vernis Gel Premium"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full p-3 bg-creme/20 border border-creme2 rounded-sm focus:outline-none focus:border-or transition-all h-24"
                                    placeholder="Description pour le SEO et l'affichage..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Ordre d'affichage</label>
                                    <input 
                                        type="number" 
                                        value={formData.displayOrder}
                                        onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) }))}
                                        className="w-full p-3 bg-creme/20 border border-creme2 rounded-sm focus:outline-none focus:border-or transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-encre3">Image de couverture</label>
                                    <div className="flex space-x-2">
                                        <input 
                                            type="text" 
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                            className="flex-grow p-3 bg-creme/20 border border-creme2 rounded-sm focus:outline-none focus:border-or transition-all text-xs"
                                            placeholder="URL ou upload..."
                                        />
                                        <label className="cursor-pointer p-3 bg-white border border-creme2 hover:border-or transition-all rounded-sm">
                                            <ImageIcon size={18} className="text-encre3" />
                                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {formData.imageUrl && (
                                <div className="relative aspect-video rounded-sm overflow-hidden border border-creme2">
                                    <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                                </div>
                            )}

                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest border border-creme2 hover:bg-creme/20 transition-all rounded-sm"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-4 bg-[#1A0A0A] text-creme text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all shadow-xl disabled:opacity-50 border border-or/20"
                                >
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
