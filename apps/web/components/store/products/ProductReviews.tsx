'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MessageSquare, Loader, Send, AlertCircle, ShoppingBag, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReviewsAPI } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils/currency';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        ReviewsAPI.getByProduct(productId),
        ReviewsAPI.getProductRating(productId)
      ]);

      if (reviewsRes.success) setReviews(reviewsRes.data.items);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour laisser un avis');
      return;
    }

    if (!content.trim() || !title.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setSubmitting(true);
    try {
      const res = await ReviewsAPI.create({
        productId,
        rating,
        title,
        content
      });

      if (res.success) {
        toast.success('Votre avis a été envoyé et est en attente de modération');
        setShowForm(false);
        setTitle('');
        setContent('');
        setRating(5);
      } else {
        toast.error(res.error || 'Erreur lors de l\'envoi de l\'avis');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center py-12">
        <Loader className="animate-spin text-or mb-4" size={32} />
        <p className="text-encre3 text-sm font-bold uppercase tracking-widest">Chargement des avis...</p>
      </div>
    );
  }

  return (
    <div className="mt-24 pt-16 border-t border-creme2" id="reviews">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-16">
        {/* Rating Summary */}
        <div className="w-full md:w-1/3">
          <h2 className="font-serif text-3xl text-encre mb-6">Avis clients</h2>
          
          <div className="bg-white rounded-sm border border-creme2 p-8 shadow-md">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-5xl font-bold text-encre">
                {stats?.averageRating || 0}
              </div>
              <div>
                <div className="flex text-or mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      className={cn(s <= Math.round(stats?.averageRating || 0) ? "fill-or" : "text-creme2")}
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-encre3 uppercase tracking-widest">
                  Basé sur {stats?.totalReviews || 0} avis
                </p>
              </div>
            </div>

            {/* Distribution */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats?.ratingDistribution?.[star] || 0;
                const percentage = stats?.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-encre3 w-4">{star}</span>
                    <div className="flex-grow h-1.5 bg-creme2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-or transition-all duration-1000" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-encre3 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="w-full md:w-2/3">
          {!showForm ? (
            <div className="bg-encre p-12 rounded-sm text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-or/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <MessageSquare className="text-or mx-auto mb-6" size={40} strokeWidth={1} />
                <h3 className="font-serif text-2xl text-creme mb-4">Partagez votre expérience</h3>
                <p className="text-creme/60 text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
                  Votre avis est précieux pour nous et pour les autres membres de la communauté. Dites-nous ce que vous avez pensé de {productName}.
                </p>
                {isAuthenticated ? (
                  <button 
                    onClick={() => setShowForm(true)}
                    className="px-10 py-4 bg-or text-encre text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-creme transition-all shadow-xl"
                  >
                    Rédiger un avis
                  </button>
                ) : (
                  <Link 
                    href="/compte"
                    className="inline-block px-10 py-4 bg-white border border-or text-or text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-or hover:text-white transition-all shadow-xl"
                  >
                    Se connecter pour donner mon avis
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-sm border border-creme2 p-10 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-serif text-2xl text-encre">Rédiger un avis</h3>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-encre3 hover:text-rouge transition-colors"
                >
                  Annuler
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-3">Note globale</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="transition-all hover:scale-110"
                      >
                        <Star
                          size={28}
                          className={cn(s <= rating ? "fill-or text-or" : "text-creme2")}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Titre de votre avis</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="En quelques mots (ex: Magnifique couleur !)"
                    className="w-full px-4 py-3 bg-creme border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-encre3 mb-2">Votre message</label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Partagez les détails de votre expérience..."
                    className="w-full px-4 py-3 bg-creme border border-creme2 rounded-sm text-sm focus:outline-none focus:border-or transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100 rounded-sm">
                  <AlertCircle size={18} className="text-orange-500 shrink-0" />
                  <p className="text-[10px] text-orange-700 font-medium leading-relaxed">
                    Pour garantir la qualité des avis, votre message sera vérifié par notre équipe avant d'être publié.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 bg-encre text-creme rounded-sm font-bold uppercase tracking-widest text-xs flex items-center justify-center hover:bg-rouge-deep transition-all shadow-lg shadow-encre/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader size={18} className="animate-spin mr-3 text-or" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-3 text-or" />
                      Publier mon avis
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-sm border border-dashed border-creme2">
            <MessageSquare className="mx-auto text-creme2 mb-4" size={48} strokeWidth={1} />
            <p className="font-serif text-xl text-encre3 italic">Aucun avis publié pour le moment.</p>
            <p className="text-xs text-encre3 mt-2 font-bold uppercase tracking-widest">Soyez le premier à partager votre expérience !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-sm border border-creme2 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-creme flex items-center justify-center text-encre font-bold text-xs border border-creme2">
                      {review.user?.firstName?.charAt(0) || '?'}{review.user?.lastName?.charAt(0) || ''}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-encre">
                        {review.user?.firstName} {review.user?.lastName?.charAt(0)}.
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex text-or">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={10}
                              className={cn(s <= review.rating ? "fill-or" : "text-creme2")}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-encre3 font-bold">•</span>
                        <span className="text-[10px] text-encre3 font-black uppercase tracking-tighter">Achat vérifié</span>
                      </div>
                    </div>
                  </div>
                  <time className="text-[9px] font-bold text-encre3 uppercase tracking-widest">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </time>
                </div>

                <h4 className="font-serif text-lg text-encre mb-3 group-hover:text-rouge-deep transition-colors">{review.title}</h4>
                <p className="text-encre3 text-sm font-light leading-relaxed">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
