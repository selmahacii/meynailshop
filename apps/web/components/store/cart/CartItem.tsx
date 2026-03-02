import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils/currency';

interface CartItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({
  id,
  name,
  image,
  price,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const subtotal = price * quantity;

  return (
    <div className="flex gap-4 p-4 border border-creme2 rounded-lg hover:border-or transition">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-outfit font-semibold text-encre truncate">{name}</h3>
        <p className="text-or font-serif text-lg">{formatPrice(price)}</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="p-1 hover:bg-creme2 rounded transition"
            aria-label="Diminuer la quantité"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-12 text-center border border-creme2 rounded py-1"
          />

          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="p-1 hover:bg-creme2 rounded transition"
            aria-label="Augmenter la quantité"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <div>
          <p className="text-encre3 text-sm">Sous-total</p>
          <p className="text-rouge font-serif text-xl font-bold">{formatPrice(subtotal)}</p>
        </div>

        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
          aria-label="Supprimer l'article"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
