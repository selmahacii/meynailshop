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
    addresses: any[];
    orders: any[];
    reviews: any[];
    wishlistItems: any[];
}
