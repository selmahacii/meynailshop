'use client';

import { formatPrice } from '@/lib/utils/currency';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { Ticket } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  discount?: number;
  onApplyCoupon?: (code: string) => Promise<void>;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  couponApplied?: string;
  loading?: boolean;
}

export function CartSummary({
  subtotal,
  shipping = 0,
  discount = 0,
  onApplyCoupon,
  onCheckout,
  onContinueShopping,
  couponApplied,
  loading = false,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !onApplyCoupon) return;
    setApplyingCoupon(true);
    try {
      await onApplyCoupon(couponCode);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const total = subtotal + shipping - discount;

  return (
    <div className="bg-white rounded-lg border-2 border-creme2 p-6 space-y-6 sticky top-24">
      <div>
        <h3 className="font-serif font-bold text-encre mb-4">Résumé de commande</h3>

        <div className="space-y-3">
          <div className="flex justify-between text-encre">
            <span>Sous-total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {shipping > 0 && (
            <div className="flex justify-between text-encre">
              <span>Livraison</span>
              <span className="text-or">{formatPrice(shipping)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Réduction {couponApplied && `(${couponApplied})`}</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="border-t-2 border-creme2 pt-3 flex justify-between font-serif font-bold text-lg">
            <span>Total</span>
            <span className="text-rouge">{formatPrice(Math.max(0, total))}</span>
          </div>
        </div>
      </div>

      {onApplyCoupon && !couponApplied && (
        <div className="space-y-2">
          <label className="block text-sm font-outfit font-medium">Code de réduction</label>
          <div className="flex gap-2">
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Entrer un code"
              disabled={applyingCoupon}
            />
            <Button
              variant="outline"
              onClick={handleApplyCoupon}
              loading={applyingCoupon}
              disabled={!couponCode.trim()}
              className="flex-shrink-0"
            >
              <Ticket className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onCheckout}
          loading={loading}
        >
          Procéder au paiement
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={onContinueShopping}
          disabled={loading}
        >
          Continuer vos achats
        </Button>
      </div>

      <div className="text-xs text-encre3 space-y-1">
        <p>✓ Livraison rapide et sécurisée</p>
        <p>✓ Paiement 100% sécurisé</p>
        <p>✓ Satisfait ou remboursé</p>
      </div>
    </div>
  );
}
