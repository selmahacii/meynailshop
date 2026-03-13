import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-[80vh] bg-creme pt-32 pb-24 flex items-center justify-center">
            <div className="bg-white p-8 lg:p-12 max-w-lg w-full shadow-xl border border-creme2 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                </div>

                <h1 className="font-serif text-3xl text-encre mb-4">Commande Confirmée !</h1>
                <p className="text-encre3 text-sm mb-2">
                    Merci pour votre confiance. Votre commande <strong>#ORD-2026-001</strong> a bien été enregistrée.
                </p>
                <p className="text-encre3 text-sm mb-8">
                    Un email de confirmation vous a été envoyé contenant tous les détails.
                </p>

                <div className="bg-creme2 p-6 rounded-sm mb-8 text-left">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-encre mb-4 border-b border-creme pb-2">Prochaines Étapes</h3>
                    <ul className="space-y-3 text-sm text-encre3">
                        <li className="flex items-start">
                            <span className="w-5 flex-shrink-0 font-bold text-or">1.</span>
                            Préparation de votre commande avec soin.
                        </li>
                        <li className="flex items-start">
                            <span className="w-5 flex-shrink-0 font-bold text-or">2.</span>
                            Contact téléphonique pour fixer le rendez-vous.
                        </li>
                        <li className="flex items-start">
                            <span className="w-5 flex-shrink-0 font-bold text-or">3.</span>
                            Livraison et paiement en main propre.
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col space-y-4">
                    <Link
                        href="/catalogue"
                        className="w-full bg-rouge-deep hover:bg-rouge-mid text-creme py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center"
                    >
                        <ShoppingBag size={16} className="mr-2" />
                        Continuer vos achats
                    </Link>
                </div>
            </div>
        </div>
    );
}
