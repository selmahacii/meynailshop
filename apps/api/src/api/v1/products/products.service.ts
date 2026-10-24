import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../database/entities/product.entity';
import { generateSlug } from '../../../common/utils/slug.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  private async generateNextSku(): Promise<string> {
    try {
      const lastProduct = await this.productRepository.createQueryBuilder('product')
        .where("product.sku ~ '^MEEY-[0-9]+$'")
        .orderBy("SUBSTRING(product.sku, 6)::INTEGER", "DESC")
        .getOne();

      let nextNumber = 1;
      if (lastProduct && lastProduct.sku) {
        const parts = lastProduct.sku.split('-');
        if (parts.length > 1) {
          const currentNumber = parseInt(parts[1], 10);
          if (!isNaN(currentNumber)) {
            nextNumber = currentNumber + 1;
          }
        }
      }

      let candidate = `MEEY-${nextNumber.toString().padStart(3, '0')}`;
      while (await this.productRepository.findOne({ where: { sku: candidate } })) {
        nextNumber++;
        candidate = `MEEY-${nextNumber.toString().padStart(3, '0')}`;
      }

      return candidate;
    } catch {
      const count = await this.productRepository.count();
      return `MEEY-${(count + 1).toString().padStart(3, '0')}`;
    }
  }

  private async generateUniqueSlug(baseSlug: string, currentId?: string): Promise<string> {
    let cleanSlug = baseSlug
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/^-+|-+$/g, '');

    if (!cleanSlug) {
      cleanSlug = `produit-${Date.now()}`;
    }

    let candidate = cleanSlug;
    let counter = 1;

    while (true) {
      const existing = await this.productRepository.findOne({ where: { slug: candidate } });
      if (!existing || (currentId && existing.id === currentId)) {
        return candidate;
      }
      counter++;
      candidate = `${cleanSlug}-${counter}`;
    }
  }

  private sanitizeProductData(dto: any) {
    const costPrice = (dto.costPrice !== undefined && dto.costPrice !== null && dto.costPrice !== '' && !isNaN(Number(dto.costPrice)))
      ? Number(dto.costPrice)
      : 0;

    const price = (dto.price !== undefined && dto.price !== null && dto.price !== '' && !isNaN(Number(dto.price)))
      ? Number(dto.price)
      : 0;

    const comparePrice = (dto.comparePrice !== undefined && dto.comparePrice !== null && dto.comparePrice !== '' && !isNaN(Number(dto.comparePrice)))
      ? Number(dto.comparePrice)
      : null;

    const stock = (dto.stock !== undefined && dto.stock !== null && dto.stock !== '' && !isNaN(Number(dto.stock)))
      ? Math.max(0, parseInt(String(dto.stock), 10))
      : 0;

    const stockAlert = (dto.stockAlert !== undefined && dto.stockAlert !== null && dto.stockAlert !== '' && !isNaN(Number(dto.stockAlert)))
      ? Math.max(0, parseInt(String(dto.stockAlert), 10))
      : 5;

    const weight = (dto.weight !== undefined && dto.weight !== null && dto.weight !== '' && !isNaN(Number(dto.weight)))
      ? Number(dto.weight)
      : 0;

    let subCategoryId: string | null = null;
    if (dto.subCategoryId && typeof dto.subCategoryId === 'string' && dto.subCategoryId.trim() !== '' && dto.subCategoryId !== 'null') {
      subCategoryId = dto.subCategoryId.trim();
    }

    let badge: 'top' | 'new' | 'promo' | null = null;
    if (dto.badge && ['top', 'new', 'promo'].includes(dto.badge)) {
      badge = dto.badge;
    }

    let images: string[] = [];
    if (Array.isArray(dto.images)) {
      images = dto.images.filter((img: any) => typeof img === 'string' && img.trim() !== '');
    } else if (typeof dto.images === 'string' && dto.images.trim() !== '') {
      images = [dto.images.trim()];
    }

    let tags: string[] = [];
    if (Array.isArray(dto.tags)) {
      tags = dto.tags.filter((t: any) => typeof t === 'string' && t.trim() !== '');
    } else if (typeof dto.tags === 'string' && dto.tags.trim() !== '') {
      tags = dto.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    let variants: any = null;
    const hasVariants = Boolean(dto.hasVariants);
    if (hasVariants && Array.isArray(dto.variants) && dto.variants.length > 0) {
      variants = dto.variants.map((v: any, idx: number) => ({
        sku: v.sku || `VAR-${idx + 1}`,
        image: v.image || '',
        stock: (!isNaN(Number(v.stock))) ? Math.max(0, Number(v.stock)) : 0,
        stockAlert: (!isNaN(Number(v.stockAlert))) ? Math.max(0, Number(v.stockAlert)) : (stockAlert || 5),
        price: (v.price !== undefined && v.price !== null && v.price !== '' && !isNaN(Number(v.price))) ? Number(v.price) : undefined
      }));
    }

    return {
      name: (dto.name || '').trim(),
      description: dto.description || '',
      shortDescription: dto.shortDescription || dto.name || '',
      price,
      comparePrice,
      costPrice,
      stock,
      stockAlert,
      weight,
      categoryId: dto.categoryId,
      subCategoryId,
      badge,
      images,
      tags,
      hasVariants,
      variants,
      isActive: dto.isActive !== undefined ? Boolean(dto.isActive) : true,
      isFeatured: dto.isFeatured !== undefined ? Boolean(dto.isFeatured) : false,
    };
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subCategory', 'subCategory');

    if (search) {
      const searchPattern = `%${search}%`;
      queryBuilder.where('(product.name ILIKE :search OR product.sku ILIKE :search OR category.name ILIKE :search OR subCategory.name ILIKE :search)', { search: searchPattern });
    }

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    const data = items.map(p => {
      let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
      if (p.stock <= 0) status = 'out_of_stock';
      else if (p.stock <= (p.stockAlert || 5)) status = 'low_stock';

      return {
        ...p,
        sku: p.sku && p.sku.trim() !== '' ? p.sku : `REF-${p.id.slice(0, 6).toUpperCase()}`,
        category: typeof p.category === 'object' ? (p.category as any)?.name : (p.category || '—'),
        subCategory: typeof p.subCategory === 'object' ? (p.subCategory as any)?.name : (p.subCategory || '—'),
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
    if (!createProductDto.name || String(createProductDto.name).trim() === '') {
      throw new BadRequestException('Le nom du produit est requis');
    }
    if (!createProductDto.categoryId) {
      throw new BadRequestException('Veuillez sélectionner une catégorie');
    }

    const sanitized = this.sanitizeProductData(createProductDto);

    const rawSlug = createProductDto.slug || generateSlug(sanitized.name);
    const slug = await this.generateUniqueSlug(rawSlug);

    let sku = createProductDto.sku?.trim();
    if (!sku) {
      sku = await this.generateNextSku();
    } else {
      const existingSku = await this.productRepository.findOne({ where: { sku } });
      if (existingSku) {
        throw new BadRequestException(`Un produit avec le SKU « ${sku} » existe déjà`);
      }
    }

    const product = this.productRepository.create({
      ...sanitized,
      sku,
      slug,
    });

    return await this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: any) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      throw new BadRequestException('Le SKU principal (MEEY) ne peut pas être modifié');
    }

    const sanitized = this.sanitizeProductData({
      ...product,
      ...updateProductDto,
    });

    if (updateProductDto.slug && updateProductDto.slug.trim() !== '' && updateProductDto.slug !== product.slug) {
      product.slug = await this.generateUniqueSlug(updateProductDto.slug, id);
    }

    Object.assign(product, sanitized);
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
