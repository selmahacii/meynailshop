import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Product } from '../../../database/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }
    return product;
  }

  async create(createProductDto: any) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: any) {
    await this.productRepository.update(id, updateProductDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { success: true };
  }

  async getLowStockProducts(threshold: number = 5) {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .where('(p.stock <= :threshold OR p."hasVariants" = true)', { threshold })
      .andWhere('p.isActive = :isActive', { isActive: true })
      .getMany();

    const results: any[] = [];
    for (const p of products) {
      if (!p.hasVariants) {
        if (p.stock <= (p.stockAlert || threshold)) {
          results.push({ ...p, isVariant: false });
        }
      } else if (p.variants && Array.isArray(p.variants)) {
        for (const v of p.variants) {
          const vThreshold = v.stockAlert || p.stockAlert || threshold;
          if (v.stock <= vThreshold) {
            results.push({
              id: `${p.id}-${v.sku}`,
              name: `${p.name} (${v.sku})`,
              stock: v.stock,
              sku: v.sku,
              isVariant: true,
              productId: p.id,
              stockAlert: vThreshold
            });
          }
        }
      }
    }

    return results.sort((a, b) => a.stock - b.stock).slice(0, 10);
  }
}
