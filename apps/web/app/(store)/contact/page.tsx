'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/lib/hooks/useSettings';

export default function ContactPage() {
    const { settings } = useSettings();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF5EF] to-[#F5EFEA] py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif text-encre mb-4">Nous contacter</h1>
                    <p className="text-lg text-encre3 max-w-2xl mx-auto">
                        Une question ? Besoin d'aide ? Notre équipe est là pour vous accompagner.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-serif text-encre mb-6">Informations de contact</h2>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-or/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-or" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-encre mb-1">Adresse</h3>
                                        <p className="text-encre3">{settings.shopAddress || "Alger, Algérie"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-or/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-or" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-encre mb-1">Téléphone</h3>
                                        <p className="text-encre3">{settings.shopPhone || "+213 555 123 456"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-or/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-or" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-encre mb-1">Email</h3>
                                        <p className="text-encre3">{settings.shopEmail || "contact@meey.dz"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-or/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-or" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-encre mb-1">Horaires d'ouverture</h3>
                                        <p className="text-encre3">
                                            Lundi - Vendredi: 9h - 18h<br />
                                            Samedi: 9h - 16h<br />
                                            Dimanche: Fermé
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-serif text-encre mb-6">FAQ</h2>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <h4 className="font-semibold text-encre mb-2">Comment suivre ma commande ?</h4>
                                    <p className="text-encre3">Connectez-vous à votre compte et accédez à "Mes commandes" pour suivre l'état de votre livraison.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-encre mb-2">Délais de livraison ?</h4>
                                    <p className="text-encre3">2-5 jours ouvrés en Algérie. Les délais peuvent varier selon votre wilaya.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-encre mb-2">Retour possible ?</h4>
                                    <p className="text-encre3">Oui, dans les 14 jours suivant réception. Contactez-nous pour organiser le retour.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-serif text-encre mb-6">Envoyez-nous un message</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-encre3 mb-2">
                                    Nom complet *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-creme2 rounded-lg focus:ring-2 focus:ring-or focus:border-or transition-colors"
                                    placeholder="Votre nom"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-encre3 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-creme2 rounded-lg focus:ring-2 focus:ring-or focus:border-or transition-colors"
                                    placeholder="votre@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-encre3 mb-2">
                                    Sujet *
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-creme2 rounded-lg focus:ring-2 focus:ring-or focus:border-or transition-colors"
                                >
                                    <option value="">Choisissez un sujet</option>
                                    <option value="commande">Suivi de commande</option>
                                    <option value="produit">Question sur un produit</option>
                                    <option value="livraison">Problème de livraison</option>
                                    <option value="retour">Retour / Remboursement</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-encre3 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-creme2 rounded-lg focus:ring-2 focus:ring-or focus:border-or transition-colors resize-none"
                                    placeholder="Votre message..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-rouge-deep text-creme py-3 px-6 rounded-lg font-semibold hover:bg-rouge-mid transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-creme border-t-transparent rounded-full animate-spin" />
                                        <span>Envoi en cours...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Envoyer le message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
