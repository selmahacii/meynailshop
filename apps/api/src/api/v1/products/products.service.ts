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
    return await this.productRepository
      .createQueryBuilder('p')
      .where('p.stock <= :threshold', { threshold })
      .andWhere('p.isActive = :isActive', { isActive: true })
      .orderBy('p.stock', 'ASC')
      .getMany();
  }
}
