'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck, Truck, Check, CreditCard, Banknote, Home, Briefcase } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/currency';
import { cn } from '@/lib/utils';
// Payment methods defined locally to avoid cross-workspace import issues
enum PaymentMethod {
    CASH_ON_DELIVERY = 'cash_on_delivery',
    BARIDIMOB = 'baridimob',
    CIB = 'cib',
}
import { toast } from 'sonner';
import { SHIPPING_RATES } from '@/lib/constants/shipping';
import CheckoutProgress from '@/components/store/checkout/CheckoutProgress';

export default function CheckoutPage() {
    const { items, getSubtotal, getTotal, clear } = useCartStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        wilaya: '',
        commune: '',
        deliveryType: 'home' as 'home' | 'office',
    });

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH_ON_DELIVERY);

    const wilayas = SHIPPING_RATES;

    // Real shipping calculation
    const selectedWilayaRate = SHIPPING_RATES.find(w => w.id === formData.wilaya);
    const shippingCost = selectedWilayaRate 
        ? (formData.deliveryType === 'home' ? selectedWilayaRate.homeRate : selectedWilayaRate.deskRate)
        : 0;
    const finalTotal = getTotal() + shippingCost;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setLoading(true);

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

            const { ordersApi } = await import('@/lib/api/orders');
            await ordersApi.createOrder({
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    wilaya: formData.wilaya,
                    commune: formData.commune,
                },
                paymentMethod,
                deliveryType: formData.deliveryType,
                items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
            });

            clear();
            toast.success('🎉 Commande confirmée avec succès !');
            router.push('/checkout/succes');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-24 bg-creme flex flex-col items-center">
                <h1 className="font-serif text-3xl text-encre mb-6">Panier vide</h1>
                <Link href="/catalogue" className="text-or hover:text-rouge-mid font-bold tracking-widest uppercase text-xs uppercase underline">
                    Retourner à la boutique
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-creme flex flex-col lg:flex-row">
            {/* Left: Form */}
            <div className="w-full lg:w-[55%] bg-white p-6 lg:p-12 xl:p-16 border-r border-creme2 order-2 lg:order-1">
                <Link href="/panier" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-encre3 hover:text-or mb-10 transition-colors">
                    <ChevronLeft size={16} className="mr-2" />
                    Retour au panier
                </Link>

                <h1 className="font-serif text-3xl text-encre mb-8">Paiement Sécurisé</h1>

                <CheckoutProgress 
                    currentStep={1} 
                    steps={[
                        { id: 1, name: 'Contact' },
                        { id: 2, name: 'Livraison' },
                        { id: 3, name: 'Paiement' }
                    ]} 
                />

                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* Contact */}
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-encre border-b border-creme2 pb-2 mb-6">1. Contact</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">Adresse e-mail</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Adresse e-mail"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-creme2 border border-creme focus:outline-none focus:border-or focus:ring-1 focus:ring-or text-sm text-encre placeholder-encre3/70 transition-all font-medium"
                                />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="news" className="w-4 h-4 text-or border-creme2 focus:ring-or rounded-sm" />
                                <label htmlFor="news" className="ml-2 text-sm text-encre3 cursor-pointer">M'informer des nouveautés et offres exclusives</label>
                            </div>
                        </div>
                    </section>

                    {/* Shipping */}
                    <section>
                        <div className="flex items-center justify-between border-b border-creme2 pb-2 mb-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-encre">2. Livraison</h2>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'home' }))}
                                    className={cn(
                                        "px-3 py-1.5 border rounded-sm flex items-center gap-2 transition-all text-[9px] font-bold uppercase tracking-widest",
                                        formData.deliveryType === 'home'
                                            ? "border-or bg-or/5 text-or"
                                            : "border-creme2 text-encre3 hover:border-creme"
                                    )}
                                >
                                    <Home size={12} />
                                    Domicile
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'office' }))}
                                    className={cn(
                                        "px-3 py-1.5 border rounded-sm flex items-center gap-2 transition-all text-[9px] font-bold uppercase tracking-widest",
                                        formData.deliveryType === 'office'
                                            ? "border-or bg-or/5 text-or"
                                            : "border-creme2 text-encre3 hover:border-creme"
                                    )}
                                >
                                    <Briefcase size={12} />
                                    Bureau
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="firstName" className="sr-only">Prénom</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Prénom"
                                    required
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-creme2 border border-creme focus:outline-none focus:border-or focus:ring-1 focus:ring-or text-sm text-encre placeholder-encre3/70 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="sr-only">Nom</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Nom"
                                    required
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-creme2 border border-creme focus:outline-none focus:border-or focus:ring-1 focus:ring-or text-sm text-encre placeholder-encre3/70 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Numéro de téléphone (ex: 05...)"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-creme2 border border-creme focus:outline-none focus:border-or focus:ring-1 focus:ring-or text-sm text-encre placeholder-encre3/70 transition-all font-medium"
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Adresse complète"
                                required
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-creme2 border border-creme focus:outline-none focus:border-or focus:ring-1 focus:ring-or text-sm text-encre placeholder-encre3/70 transition-all font-medium"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    name="wilaya"
                                    required
                                    value={formData.wilaya}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-creme2 border border-creme focus:outline-none focus:border-or focus:ring-1 focus:ring-or text-sm text-encre placeholder-encre3/70 transition-all font-medium appearance-none"
                                >
                                    <option value="" disabled>Sélectionner Wilaya</option>
                                    {wilayas.map(w => (
                                        <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    name="commune"
                                    placeholder="Commune"
                                    required
                                    value={formData.commune}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-creme2 border border-creme focus:outline-none focus:border-or focus:ring-1 focus:ring-or text-sm text-encre placeholder-encre3/70 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Payment */}
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-encre border-b border-creme2 pb-2 mb-6">3. Paiement</h2>
                        <div className="space-y-4">
                            <div className="block relative border border-or bg-or/5 rounded-sm">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full border border-or flex items-center justify-center mr-4">
                                            <div className="w-2 h-2 bg-or rounded-full"></div>
                                        </div>
                                        <Banknote className="text-encre3 mr-3" size={24} />
                                        <div>
                                            <span className="block text-sm font-semibold text-encre uppercase tracking-wider mb-1">Paiement main à main</span>
                                            <span className="block text-[10px] text-encre3 uppercase tracking-tighter">Espèces à la livraison / Remise en main propre</span>
                                        </div>
                                    </div>
                                    <Check className="text-or" size={20} />
                                </div>
                            </div>
                            <p className="text-[10px] text-encre3 italic px-2">
                                * Pour des raisons de sécurité et de simplicité, nous acceptons uniquement le paiement en espèces lors de la remise de votre commande.
                            </p>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={loading || !formData.wilaya}
                        className={`w-full py-5 px-6 flex items-center justify-center font-bold uppercase tracking-[0.2em] text-sm text-creme transition-all ${loading || !formData.wilaya ? 'bg-rouge-deep/70 cursor-not-allowed' : 'bg-rouge-deep hover:bg-rouge-mid shadow-lg'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Traitement en cours...
                            </span>
                        ) : (
                            `Payer ${formatPrice(finalTotal)}`
                        )}
                    </button>
                </form>
            </div>

            {/* Right: Summary */}
            <div className="w-full lg:w-[45%] bg-creme p-6 lg:p-12 xl:p-16 order-1 lg:order-2 border-b lg:border-b-0 border-creme2 h-auto lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto custom-scrollbar">
                <h2 className="text-sm font-bold uppercase tracking-widest text-encre mb-8 hidden lg:block">Résumé de la commande</h2>

                <div className="space-y-6 mb-8">
                    {items.map(item => (
                        <div key={item.productId} className="flex items-center">
                            <div className="relative w-16 h-16 border border-creme2 bg-white shrink-0 mr-4">
                                <Image src={item.image || '/images/placeholder-product.png'} alt={item.name} fill className="object-cover p-1" />
                                <span className="absolute -top-2 -right-2 bg-encre text-creme w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-serif text-sm text-encre leading-tight pr-4">{item.name}</h4>
                                <p className="text-xs text-encre3 mt-1">Qté: {item.quantity}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="text-sm font-bold text-encre">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-b border-creme2 py-6 space-y-4 text-sm mb-6">
                    <div className="flex justify-between items-center text-encre3">
                        <span>Sous-total HT</span>
                        <span className="font-medium text-encre">{formatPrice(getSubtotal())}</span>
                    </div>
                    <div className="flex justify-between items-center text-encre3">
                        <div className="flex flex-col">
                            <span>Livraison</span>
                            {selectedWilayaRate && (
                                <span className="text-[10px] uppercase font-bold text-gold-brand">
                                    {selectedWilayaRate.name} - {formData.deliveryType === 'home' ? 'Domicile' : 'Bureau/Relais'}
                                </span>
                            )}
                        </div>
                        <span className="font-medium text-encre">
                            {shippingCost > 0 ? formatPrice(shippingCost) : (formData.wilaya ? 'Gratuit' : '---')}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                    <span className="text-lg font-serif text-encre">Total TTC</span>
                    <span className="text-3xl font-bold text-rouge-deep">
                        {formatPrice(finalTotal)}
                    </span>
                </div>

                <div className="bg-encre2/30 p-6 rounded-sm border border-creme2 space-y-4">
                    <div className="flex items-start">
                        <ShieldCheck className="text-or shrink-0 mr-3" size={20} />
                        <div>
                            <h5 className="text-[10px] uppercase font-bold text-encre tracking-widest mb-1">Achat 100% Sécurisé</h5>
                            <p className="text-xs text-encre3">Vos données sont chiffrées et protégées.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Truck className="text-or shrink-0 mr-3" size={20} />
                        <div>
                            <h5 className="text-[10px] uppercase font-bold text-encre tracking-widest mb-1">Livraison Express</h5>
                            <p className="text-xs text-encre3">Préparation sous 24h ouvrées.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
