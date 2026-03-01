import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Controller('api/v1/categories')
export class CategoriesController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll() {
        const categories = await this.prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { name: 'asc' },
        });

        return categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: cat.image,
            productCount: cat._count.products,
        }));
    }
}
