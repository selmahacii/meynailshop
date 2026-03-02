import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Address } from '../../database/entities/address.entity';
import { PaginationDto } from '../../common/pagination/pagination.dto';
import { PaginatedResult } from '../../common/pagination/paginated-result.interface';
export declare class UsersService {
    private userRepository;
    private addressRepository;
    constructor(userRepository: Repository<User>, addressRepository: Repository<Address>);
    create(createUserDto: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: "client" | "admin";
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        addresses: Address[];
        orders: import("../../database/entities/order.entity").Order[];
        reviews: import("../../database/entities/review.entity").Review[];
        wishlistItems: import("../../database/entities/wishlist-item.entity").WishlistItem[];
    }>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<any>>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: "client" | "admin";
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        addresses: Address[];
        orders: import("../../database/entities/order.entity").Order[];
        reviews: import("../../database/entities/review.entity").Review[];
        wishlistItems: import("../../database/entities/wishlist-item.entity").WishlistItem[];
    }>;
    update(id: string, updateUserDto: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: "client" | "admin";
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        addresses: Address[];
        orders: import("../../database/entities/order.entity").Order[];
        reviews: import("../../database/entities/review.entity").Review[];
        wishlistItems: import("../../database/entities/wishlist-item.entity").WishlistItem[];
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: "client" | "admin";
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        addresses: Address[];
        orders: import("../../database/entities/order.entity").Order[];
        reviews: import("../../database/entities/review.entity").Review[];
        wishlistItems: import("../../database/entities/wishlist-item.entity").WishlistItem[];
    }>;
    updateProfile(userId: string, updateUserDto: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: "client" | "admin";
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        addresses: Address[];
        orders: import("../../database/entities/order.entity").Order[];
        reviews: import("../../database/entities/review.entity").Review[];
        wishlistItems: import("../../database/entities/wishlist-item.entity").WishlistItem[];
    }>;
    addAddress(userId: string, createAddressDto: any): Promise<Address[]>;
    getAddresses(userId: string): Promise<Address[]>;
    removeAddress(userId: string, addressId: string): Promise<{
        message: string;
    }>;
    private formatUser;
}
