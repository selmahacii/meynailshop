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
        addresses: any[];
        orders: any[];
        reviews: any[];
        wishlistItems: any[];
    }>;
    findAll(paginationDto: PaginationDto & {
        isActive?: boolean;
        role?: string;
    }): Promise<PaginatedResult<any>>;
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
        addresses: any[];
        orders: any[];
        reviews: any[];
        wishlistItems: any[];
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
        addresses: any[];
        orders: any[];
        reviews: any[];
        wishlistItems: any[];
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
        addresses: any[];
        orders: any[];
        reviews: any[];
        wishlistItems: any[];
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
        addresses: any[];
        orders: any[];
        reviews: any[];
        wishlistItems: any[];
    }>;
    addAddress(userId: string, createAddressDto: any): Promise<Address[]>;
    getAddresses(userId: string): Promise<Address[]>;
    removeAddress(userId: string, addressId: string): Promise<{
        message: string;
    }>;
    private formatUser;
}
