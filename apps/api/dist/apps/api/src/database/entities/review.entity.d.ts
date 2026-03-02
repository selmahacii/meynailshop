import { User } from './user.entity';
export declare class Review {
    id: string;
    userId: string;
    productId: string;
    orderId: string;
    rating: number;
    title: string;
    content: string;
    status: string;
    adminNote: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
