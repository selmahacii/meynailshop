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
            addresses: any[];
            orders: any[];
            reviews: any[];
            wishlistItems: any[];
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
            addresses: any[];
            orders: any[];
            reviews: any[];
            wishlistItems: any[];
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
            addresses: any[];
            orders: any[];
            reviews: any[];
            wishlistItems: any[];
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
            addresses: any[];
            orders: any[];
            reviews: any[];
            wishlistItems: any[];
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
            addresses: any[];
            orders: any[];
            reviews: any[];
            wishlistItems: any[];
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
        data: import("../../database/entities").Address[];
        message?: undefined;
    }>;
    addAddress(id: string, createAddressDto: any, user: any): Promise<{
        statusCode: number;
        message: string;
        data?: undefined;
    } | {
        statusCode: number;
        message: string;
        data: import("../../database/entities").Address[];
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
