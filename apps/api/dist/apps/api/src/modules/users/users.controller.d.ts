import { UsersService } from './users.service';
import { PaginationDto } from '../../common/pagination/pagination.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: "client" | "admin";
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            addresses: import("../../database/entities/address.entity").Address[];
            orders: import("../../database/entities/order.entity").Order[];
            reviews: import("../../database/entities/review.entity").Review[];
            wishlistItems: import("../../database/entities/wishlist-item.entity").WishlistItem[];
        };
    }>;
    findAll(paginationDto: PaginationDto): Promise<{
        statusCode: number;
        data: import("../../common/pagination/paginated-result.interface").PaginatedResult<any>;
    }>;
    getProfile(user: any): Promise<{
        statusCode: number;
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: "client" | "admin";
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            addresses: import("../../database/entities/address.entity").Address[];
            orders: import("../../database/entities/order.entity").Order[];
            reviews: import("../../database/entities/review.entity").Review[];
            wishlistItems: import("../../database/entities/wishlist-item.entity").WishlistItem[];
        };
    }>;
    updateProfile(user: any, updateUserDto: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: "client" | "admin";
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            addresses: import("../../database/entities/address.entity").Address[];
            orders: import("../../database/entities/order.entity").Order[];
            reviews: import("../../database/entities/review.entity").Review[];
            wishlistItems: import("../../database/entities/wishlist-item.entity").WishlistItem[];
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: number;
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: "client" | "admin";
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            addresses: import("../../database/entities/address.entity").Address[];
            orders: import("../../database/entities/order.entity").Order[];
            reviews: import("../../database/entities/review.entity").Review[];
            wishlistItems: import("../../database/entities/wishlist-item.entity").WishlistItem[];
        };
    }>;
    update(id: string, updateUserDto: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: "client" | "admin";
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            addresses: import("../../database/entities/address.entity").Address[];
            orders: import("../../database/entities/order.entity").Order[];
            reviews: import("../../database/entities/review.entity").Review[];
            wishlistItems: import("../../database/entities/wishlist-item.entity").WishlistItem[];
        };
    }>;
    remove(id: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            message: string;
        };
    }>;
    getAddresses(id: string, user: any): Promise<{
        statusCode: number;
        message: string;
        data?: undefined;
    } | {
        statusCode: number;
        data: import("../../database/entities/address.entity").Address[];
        message?: undefined;
    }>;
    addAddress(id: string, createAddressDto: any, user: any): Promise<{
        statusCode: number;
        message: string;
        data?: undefined;
    } | {
        statusCode: number;
        message: string;
        data: import("../../database/entities/address.entity").Address[];
    }>;
    removeAddress(id: string, addressId: string, user: any): Promise<{
        statusCode: number;
        message: string;
        data?: undefined;
    } | {
        statusCode: number;
        data: {
            message: string;
        };
        message?: undefined;
    }>;
}
