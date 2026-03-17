export default function CGVPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF5EF] to-[#F5EFEA] py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                    <h1 className="text-4xl font-serif text-encre mb-8 text-center">Conditions Générales de Vente</h1>

                    <div className="prose prose-lg max-w-none text-encre3 space-y-8">
                        <section>
                            <h2 className="text-2xl font-serif text-encre mb-4">1. Objet</h2>
                            <p>
                                Les présentes conditions générales de vente régissent les relations contractuelles
                                entre Mey Nail Shop et ses clients dans le cadre de la vente de produits de beauté
                                et d'onglerie en ligne.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-encre mb-4">2. Produits</h2>
                            <p>
                                Tous nos produits sont présentés avec la plus grande exactitude possible.
                                Cependant, les photographies ne sont pas contractuelles et ne sauraient engager
                                la responsabilité du vendeur.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-encre mb-4">3. Prix</h2>
                            <p>
                                Les prix sont indiqués en dinars algériens (DA) TTC. Ils tiennent compte de la TVA
                                applicable au jour de la commande. Tout changement du taux de TVA sera automatiquement
                                répercuté sur le prix des produits.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-encre mb-4">4. Commande</h2>
                            <p>
                                Toute commande implique l'acceptation pleine et entière des présentes conditions
                                générales de vente. Le clic de validation de commande constitue une signature
                                électronique qui a la même valeur qu'une signature manuscrite.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-encre mb-4">5. Paiement</h2>
                            <p>
                                Le paiement s'effectue en ligne par carte bancaire ou paiement à la livraison.
                                Les données bancaires sont cryptées et sécurisées.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-encre mb-4">6. Livraison</h2>
                            <p>
                                La livraison est assurée dans toute l'Algérie. Les délais de livraison sont
                                indicatifs et peuvent varier selon la destination.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-encre mb-4">7. Droit de rétractation</h2>
                            <p>
                                Conformément à la législation en vigueur, le client dispose d'un délai de 14 jours
                                à compter de la réception de sa commande pour exercer son droit de rétractation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-encre mb-4">8. Service client</h2>
                            <p>
                                Pour toute question ou réclamation, notre service client est à votre disposition
                                par email à meeybouabdellah@gmail.com ou par téléphone.
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-creme/20 rounded-lg">
                            <p className="text-sm text-encre3">
                                <strong>Dernière mise à jour:</strong> Mars 2026<br />
                                Ces conditions générales sont susceptibles d'être modifiées à tout moment.
                                La version applicable est celle en vigueur au moment de la commande.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
