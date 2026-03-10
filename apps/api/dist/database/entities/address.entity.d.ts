import { User } from './user.entity';
export declare class Address {
    id: string;
    userId: string;
    label: string;
    fullName: string;
    phone: string;
    wilaya: string;
    commune: string;
    address: string;
    postalCode: string;
    isDefault: boolean;
    user: User;
}
