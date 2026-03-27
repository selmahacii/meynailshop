import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Product } from '../../../database/entities/product.entity';
import { generateSlug } from '../../../common/utils/slug.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  private async generateNextSku(): Promise<string> {
    const lastProduct = await this.productRepository.createQueryBuilder('product')
      .where("product.sku LIKE 'MEEY-%'")
      .orderBy("SUBSTRING(product.sku, 6)::INTEGER", "DESC")
      .getOne();

    let nextNumber = 1;
    if (lastProduct && lastProduct.sku) {
      const parts = lastProduct.sku.split('-');
      if (parts.length > 1) {
        const currentNumber = parseInt(parts[1]);
        if (!isNaN(currentNumber)) {
          nextNumber = currentNumber + 1;
        }
      }
    }

    return `MEEY-${nextNumber.toString().padStart(3, '0')}`;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [items, total] = await this.productRepository.findAndCount({
      relations: ['category', 'subCategory'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    // Map to include virtual status if needed by frontend
    const data = items.map(p => {
      let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
      if (p.stock <= 0) status = 'out_of_stock';
      else if (p.stock <= (p.stockAlert || 5)) status = 'low_stock';

      return {
        ...p,
        category: p.category?.name || '—',
        subCategory: p.subCategory?.name || '—',
        status,
        alertThreshold: p.stockAlert || 5
      };
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
    const slug = createProductDto.slug || generateSlug(createProductDto.name);
    
    // Auto-generate SKU MEEY-001 format ONLY if it's empty or doesn't exist
    // This allows manual entry if needed, but defaults to auto-gen to prevent UNIQUE constraints failure
    let sku = createProductDto.sku;
    if (!sku || sku.trim() === '') {
        sku = await this.generateNextSku();
    }

    const existingProduct = await this.productRepository.createQueryBuilder('product')
      .where('product.slug = :slug OR product.sku = :sku', { slug, sku })
      .getOne();

    if (existingProduct) {
      // If it exists, we force a new unique SKU if the user didn't specify one
      if (!createProductDto.sku || createProductDto.sku.trim() === '') {
          sku = await this.generateNextSku();
      } else {
          throw new BadRequestException('Un produit avec ce SKU ou ce Slug existe déjà');
      }
    }

    // Sanitize variants: remove labels to keep JSON clean
    let variants = createProductDto.variants;
    if (variants && Array.isArray(variants)) {
      variants = variants.map((v: any) => ({
        sku: v.sku,
        image: v.image,
        stock: v.stock || 0,
        stockAlert: v.stockAlert || createProductDto.stockAlert || 5
      }));
    }

    const product = this.productRepository.create({
      ...createProductDto,
      sku,
      slug,
      variants
    });
    
    return await this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: any) {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    // SKU is immutable after creation
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      throw new BadRequestException('Le SKU principal (MEEY) ne peut pas être modifié');
    }

    // Slug update logic
    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existed = await this.productRepository.findOne({
        where: { slug: updateProductDto.slug },
      });
      if (existed && existed.id !== id) {
        throw new BadRequestException('Un produit avec ce Slug existe déjà');
      }
    }

    // Sanitize variants: remove labels to keep JSON clean
    const { sku, ...updateData } = updateProductDto;

    if (updateData.variants && Array.isArray(updateData.variants)) {
      updateData.variants = updateData.variants.map((v: any) => ({
        sku: v.sku,
        image: v.image,
        stock: v.stock || 0,
        stockAlert: v.stockAlert || updateData.stockAlert || product.stockAlert || 5
      }));
    }

    // Use Object.assign and save for consistent entity behavior (hooks, etc)
    Object.assign(product, updateData);
    return await this.productRepository.save(product);
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
