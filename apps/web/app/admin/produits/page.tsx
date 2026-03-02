'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils/currency';

// Mock data
const mockProducts = [
    { id: '1', name: 'Vernis Gel "Royal Red"', reference: 'VG-RR-001', category: 'Vernis Gel', stock: 25, price: 1800, status: 'Actif' },
    { id: '2', name: 'Gel UV de Construction', reference: 'GUV-PP-002', category: 'Gel UV', stock: 0, price: 3500, status: 'Rupture' },
    { id: '3', name: 'Finition "Mirror Shine"', reference: 'TC-MS-003', category: 'Finition', stock: 50, price: 1500, status: 'Actif' },
    { id: '4', name: 'Lampe UV/LED 48W', reference: 'MAT-LP-004', category: 'Matériel', stock: 8, price: 8500, status: 'Actif' },
];

export default function AdminProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-creme2">
                <div>
                    <h1 className="text-2xl font-serif text-encre">Produits</h1>
                    <p className="text-encre3 text-sm mt-1">Gérez votre catalogue de produits et les niveaux de stock.</p>
                </div>
                <button className="bg-rouge-deep hover:bg-rouge-mid text-creme px-4 py-2 text-sm font-semibold rounded-sm transition-all flex items-center shadow-md">
                    <Plus size={16} className="mr-2" />
                    Nouveau Produit
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-sm border border-creme2 shadow-sm">
                <div className="w-full sm:w-96 relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-encre3" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, référence..."
                        className="w-full pl-10 pr-4 py-2 border border-creme2 focus:outline-none focus:ring-1 focus:ring-or focus:border-or rounded-sm text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex space-x-3 w-full sm:w-auto">
                    <button className="flex items-center justify-center px-4 py-2 border border-creme2 bg-white text-encre3 hover:text-or hover:border-or text-sm font-semibold transition-all rounded-sm flex-grow sm:flex-grow-0">
                        <Filter size={16} className="mr-2" />
                        Filtres
                    </button>
                    <select className="px-4 py-2 border border-creme2 bg-white text-encre text-sm font-semibold rounded-sm focus:outline-none focus:ring-1 focus:ring-or focus:border-or cursor-pointer">
                        <option value="all">Toutes Catégories</option>
                        <option value="gel">Vernis Gel</option>
                        <option value="uv">Gel UV</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-creme2 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-creme">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2">Produit</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2">Catégorie</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2">Prix</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2">Statut</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-encre border-b border-creme2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-creme2">
                            {mockProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-creme/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-creme2 border border-creme flex-shrink-0"></div>
                                            <div className="ml-4">
                                                <div className="font-semibold text-encre text-sm">{product.name}</div>
                                                <div className="text-xs text-encre3">{product.reference}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-encre3">
                                        {product.category}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-encre">
                                        {formatPrice(product.price)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-2 ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                            <span className={product.stock === 0 ? 'text-red-600 font-bold' : 'text-encre'}>{product.stock}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${product.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button className="p-2 text-encre3 hover:text-or hover:bg-creme rounded-full transition-colors" title="Voir">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 text-encre3 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Modifier">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 text-encre3 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Supprimer">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="px-6 py-4 border-t border-creme2 flex justify-between items-center text-sm">
                    <span className="text-encre3">Affichage de 1 à 4 sur 84 produits</span>
                    <div className="flex space-x-1">
                        <button className="px-3 py-1 border border-creme2 bg-white text-encre text-xs rounded-sm hover:border-or disabled:opacity-50">Précédent</button>
                        <button className="px-3 py-1 border border-creme2 bg-white text-encre text-xs rounded-sm hover:border-or disabled:opacity-50">Suivant</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
