import { PrismaService } from '../../database/prisma.service';
export declare class CategoriesController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        image: string;
        productCount: number;
    }[]>;
}
