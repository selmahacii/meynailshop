import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { Category } from '../../database/entities/category.entity';
import { PaginatedResult } from '../../common/pagination/paginated-result.interface';
import { generateSlug } from '../../common/utils/slug.util';
import { ProductsQueryDto } from './dto/products-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

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

  async create(createProductDto: any) {
    const slug = createProductDto.slug || generateSlug(createProductDto.name);
    
    // Auto-generate SKU MEEY-001 format
    const sku = await this.generateNextSku();

    const existingProduct = await this.productRepository.createQueryBuilder('product')
      .where('product.slug = :slug OR product.sku = :sku', { slug, sku })
      .getOne();

    if (existingProduct) {
      throw new BadRequestException('Product with this slug or SKU already exists');
    }

    // Ensure variants don't have labels (identified only by sku, image and stock properties)
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

  async findAll(query: ProductsQueryDto): Promise<PaginatedResult<Product>> {
    const skip = (query.page - 1) * query.limit;
    
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subCategory', 'subCategory')
      .where('product.isActive = :isActive', { isActive: true });

    if (query.search) {
      queryBuilder.andWhere('product.name ILIKE :search', { search: `%${query.search}%` });
    }

    if (query.category) {
      queryBuilder.andWhere('category.slug = :category', { category: query.category });
    }

    if ((query as any).subCategory) {
      queryBuilder.andWhere('subCategory.slug = :subCategory', { subCategory: (query as any).subCategory });
    }

    if (query.minPrice !== undefined && query.minPrice !== null) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (query.maxPrice !== undefined && query.maxPrice !== null) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    if (query.badge) {
      queryBuilder.andWhere('product.badge = :badge', { badge: query.badge });
    }

    if (query.inStock === 'true') {
      queryBuilder.andWhere('product.stock > 0');
    }

    // Sort
    if (query.sortBy) {
      // Séparer createdAt pour éviter l'ambiguïté si nécessaire
      const sortField = query.sortBy === 'createdAt' ? 'product.createdAt' : `product.${query.sortBy}`;
      queryBuilder.orderBy(sortField, query.order === 'asc' ? 'ASC' : 'DESC');
    } else {
      queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    const [products, total] = await queryBuilder
      .skip(skip)
      .take(query.limit)
      .getManyAndCount();

    return {
      items: products,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
      hasNext: skip + query.limit < total,
      hasPrev: query.page > 1,
    };
  }

  async findBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: { slug, isActive: true },
      relations: ['category', 'subCategory'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findFeatured(limit: number = 6) {
    try {
      // Essayer d'abord les produits tagués 'isFeatured' ou ayant le badge 'top' (Bestseller)
      let products = await this.productRepository.find({
        where: [
          { isFeatured: true, isActive: true },
          { badge: 'top' as any, isActive: true }
        ],
        relations: ['category'],
        take: limit,
        order: { createdAt: 'DESC' },
      });

      // Si aucun produit n'est trouvé, retourner les derniers produits ajoutés
      if (products.length === 0) {
        products = await this.productRepository.find({
          where: { isActive: true },
          relations: ['category'],
          take: limit,
          order: { createdAt: 'DESC' },
        });
      }

      return products;
    } catch (error) {
      console.error('❌ [ProductsService] findFeatured Error:', error);
      // Fallback simple sans relations si ça plante (cas de DB corrompue ou relations manquantes)
      try {
        return await this.productRepository.find({
          where: { isActive: true },
          take: limit,
          order: { createdAt: 'DESC' },
        });
      } catch (innerError) {
        console.error('❌ [ProductsService] Critical Fallback Error:', innerError);
        return [];
      }
    }
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'subCategory'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: any) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // SKU is immutable after creation
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      throw new BadRequestException('Le SKU principal (MEEY) ne peut pas être modifié');
    }

    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existed = await this.productRepository.findOne({
        where: { slug: updateProductDto.slug },
      });
      if (existed) {
        throw new BadRequestException('Slug already exists');
      }
    }

    // Prepare update data: ensure SKU is not changed and labels are removed from variants
    const { sku, ...updateData } = updateProductDto;

    if (updateData.variants && Array.isArray(updateData.variants)) {
      updateData.variants = updateData.variants.map((v: any) => ({ 
        sku: v.sku, 
        image: v.image, 
        stock: v.stock || 0,
        stockAlert: v.stockAlert || updateData.stockAlert || product.stockAlert || 5
      }));
    }

    Object.assign(product, updateData);
    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.isActive = false;
    await this.productRepository.save(product);
    return { message: 'Product deactivated' };
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.stock = quantity;
    return await this.productRepository.save(product);
  }
}
