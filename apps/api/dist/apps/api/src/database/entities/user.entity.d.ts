import { Address } from './address.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { WishlistItem } from './wishlist-item.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'client' | 'admin';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    addresses: Address[];
    orders: Order[];
    reviews: Review[];
    wishlistItems: WishlistItem[];
}
