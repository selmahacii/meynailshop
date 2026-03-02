import { User } from './user.entity';
export declare class WishlistItem {
    id: string;
    userId: string;
    productId: string;
    createdAt: Date;
    user: User;
}
