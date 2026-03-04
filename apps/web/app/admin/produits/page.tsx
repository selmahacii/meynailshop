'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    Bell,
    Download,
    Filter,
    LayoutGrid,
    List,
    ChevronDown,
    MoreVertical,
    Edit2,
    ShoppingBag,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const tabs = [
    { name: 'Tous', key: 'all' },
    { name: 'Vernis Gel', key: 'vernis' },
    { name: 'Gel UV', key: 'uv' },
    { name: 'Décoration', key: 'deco' },
    { name: 'Stock faible', key: 'low' },
];

const mockProducts = [
    { id: '1', name: 'OPI Red Rock', category: 'Vernis gel', price: '200 DA', stock: '42 u.', imageColor: 'bg-rouge-deep', badge: 'new', color: 'bg-rouge-deep' },
    { id: '2', name: 'Gel Builder Clear', category: 'Gel UV', price: '1 800 DA', stock: '8 u.', imageColor: 'bg-white', badge: 'low', color: 'bg-white' },
    { id: '3', name: 'Top Coat Brillant', category: 'Finition', price: '150 DA', stock: '0 u.', imageColor: 'bg-creme2', badge: 'out', color: 'bg-creme2' },
    { id: '4', name: 'Strass Cristal Mix', category: 'Décoration', price: '100 DA', stock: '120 u.', imageColor: 'bg-pink-600', badge: 'promo', color: 'bg-pink-600' },
];

export default function AdminProductsPage() {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-encre">Produits</h1>
                    <p className="text-encre3 text-[10px] uppercase tracking-widest font-bold mt-1">Catalogue & inventaire — 04 Mars 2026</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3 group-focus-within:text-or transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or w-64 shadow-sm transition-all"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm">
                        <Bell size={18} />
                    </button>
                    <button className="p-2.5 bg-white border border-creme2 rounded-sm text-encre3 hover:text-or hover:border-or transition-all shadow-sm">
                        <Download size={18} />
                    </button>
                    <button className="flex items-center space-x-2 px-5 py-2.5 bg-rouge-deep text-creme rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-rouge-mid transition-all shadow-md">
                        <Plus size={16} />
                        <span>Nouveau</span>
                    </button>
                    <Link href="/" className="px-5 py-2.5 border border-encre text-encre rounded-sm text-sm font-bold hover:bg-encre hover:text-creme transition-all">
                        Voir la boutique
                    </Link>
                </div>
            </div>

            {/* Content Filters */}
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center bg-white p-1 rounded-sm border border-creme2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all",
                                activeTab === tab.key
                                    ? "bg-[#1A0A0A] text-creme shadow-lg scale-105"
                                    : "text-encre3 hover:bg-creme/50"
                            )}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-6 py-2 bg-creme border border-creme2 text-encre text-xs font-bold uppercase tracking-widest rounded-sm hover:border-or transition-all">
                        <span>Exporter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-2 bg-[#1A0A0A] text-creme text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all shadow-lg group">
                        <Plus size={14} className="text-or" />
                        <span>Nouveau produit</span>
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {mockProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-sm border border-creme2 shadow-lg overflow-hidden group hover:border-or transition-all duration-500">
                        {/* Image / Color Preview */}
                        <div className="relative aspect-[4/3] p-12 bg-creme/20 flex items-center justify-center overflow-hidden">
                            <div className={cn("w-full h-full rounded-md shadow-2xl transition-transform duration-700 group-hover:scale-110", product.color)} />

                            {/* Badges */}
                            <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
                                <span className="bg-white/90 backdrop-blur-sm text-encre px-2 py-1 rounded-sm text-[10px] font-black uppercase border border-creme2 shadow-sm">
                                    {product.stock}
                                </span>
                                {product.badge === 'low' && (
                                    <span className="bg-or text-encre px-2 py-1 rounded-sm text-[8px] font-black uppercase shadow-sm">
                                        Stock faible
                                    </span>
                                )}
                                {product.badge === 'out' && (
                                    <span className="bg-rouge text-creme px-2 py-1 rounded-sm text-[8px] font-black uppercase shadow-sm">
                                        Épuisé
                                    </span>
                                )}
                                {product.badge === 'promo' && (
                                    <span className="bg-green-600 text-white px-2 py-1 rounded-sm text-[8px] font-black uppercase shadow-sm">
                                        120 u.
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-6 border-t border-creme2">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-or tracking-[0.2em] mb-1">{product.category}</p>
                                    <h3 className="font-serif text-lg text-encre group-hover:text-rouge-deep transition-colors">{product.name}</h3>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <span className="text-lg font-black text-encre">{product.price}</span>
                                <div className="flex space-x-2">
                                    {product.badge === 'low' ? (
                                        <button className="bg-or text-encre px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-encre hover:text-creme transition-all">
                                            Commander
                                        </button>
                                    ) : product.badge === 'out' ? (
                                        <button className="bg-rouge text-creme px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all">
                                            Urgent
                                        </button>
                                    ) : (
                                        <button className="bg-[#1A0A0A] text-creme px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-rouge-deep transition-all shadow-md">
                                            Éditer
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty States / Loading Scaffolding */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40">
                <div className="border border-dashed border-creme2 rounded-sm p-12 flex flex-col items-center justify-center text-encre3 space-y-4">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p className="font-serif text-lg">Ajouter une nouvelle variante</p>
                </div>
                <div className="border border-dashed border-creme2 rounded-sm p-12 flex flex-col items-center justify-center text-encre3 space-y-4">
                    <AlertCircle size={48} strokeWidth={1} />
                    <p className="font-serif text-lg">Gérer les alertes globales</p>
                </div>
            </div>
        </div>
    );
}
