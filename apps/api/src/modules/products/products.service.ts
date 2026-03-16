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

  async create(createProductDto: any) {
    const slug = createProductDto.slug || generateSlug(createProductDto.name);

    const existingProduct = await this.productRepository.findOne({
      where: [{ slug }, { sku: createProductDto.sku }],
    });

    if (existingProduct) {
      throw new BadRequestException('Product with this slug or SKU already exists');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      slug,
    });
    return await this.productRepository.save(product as unknown as Product);
  }

  async findAll(query: ProductsQueryDto): Promise<PaginatedResult<Product>> {
    const skip = (query.page - 1) * query.limit;
    
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });

    if (query.search) {
      queryBuilder.andWhere('product.name ILIKE :search', { search: `%${query.search}%` });
    }

    if (query.category) {
      queryBuilder.andWhere('category.slug = :category', { category: query.category });
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
      relations: ['category'],
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
      relations: ['category'],
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

    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existed = await this.productRepository.findOne({
        where: { slug: updateProductDto.slug },
      });
      if (existed) {
        throw new BadRequestException('Slug already exists');
      }
    }

    Object.assign(product, updateProductDto);
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
