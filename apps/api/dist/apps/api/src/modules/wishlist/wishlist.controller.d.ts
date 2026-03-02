import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private wishlistService;
    constructor(wishlistService: WishlistService);
    getItems(user: any): Promise<{
        statusCode: number;
        data: import("../../database/entities/wishlist-item.entity").WishlistItem[];
    }>;
    addItem(user: any, productId: string): Promise<{
        statusCode: number;
        data: import("../../database/entities/wishlist-item.entity").WishlistItem;
    }>;
    removeItem(user: any, productId: string): Promise<{
        statusCode: number;
        data: {
            message: string;
        };
    }>;
}
