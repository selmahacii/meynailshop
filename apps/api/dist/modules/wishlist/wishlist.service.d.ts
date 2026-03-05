import { Repository } from 'typeorm';
import { WishlistItem } from '../../database/entities/wishlist-item.entity';
export declare class WishlistService {
    private wishlistRepository;
    constructor(wishlistRepository: Repository<WishlistItem>);
    addItem(userId: string, productId: string): Promise<WishlistItem>;
    getItems(userId: string): Promise<WishlistItem[]>;
    removeItem(userId: string, productId: string): Promise<{
        message: string;
    }>;
}
