import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between } from 'typeorm';
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
    const where: FindOptionsWhere<Product> = { isActive: true };

    if (query.search) {
      where.name = Like(`%${query.search}%`);
    }

    if (query.category) {
      where.category = { slug: query.category } as any;
    }

    if (query.minPrice || query.maxPrice) {
      where.price = Between(query.minPrice || 0, query.maxPrice || 999999);
    }

    if (query.badge) {
      where.badge = query.badge as any;
    }

    if (query.inStock === 'true') {
      where.stock = Between(1, 999999);
    }

    const order: any = {};
    if (query.sortBy) {
      order[query.sortBy] = query.order === 'asc' ? 'ASC' : 'DESC';
    } else {
      order.createdAt = 'DESC';
    }

    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category'],
      skip,
      take: query.limit,
      order,
    });

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
    return this.productRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['category'],
      take: limit,
      order: { createdAt: 'DESC' },
    });
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
