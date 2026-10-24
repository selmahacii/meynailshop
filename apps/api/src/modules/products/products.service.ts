import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, Brackets } from 'typeorm';
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

  async create(createProductDto: any) {
    const rawSlug = createProductDto.slug || generateSlug(createProductDto.name);
    const slug = await this.generateUniqueSlug(rawSlug);
    
    // Auto-generate SKU MEEY-001 format
    const sku = await this.generateNextSku();

    // Sanitize fields to prevent DB constraints crashes
    const costPrice = (createProductDto.costPrice !== undefined && createProductDto.costPrice !== null && createProductDto.costPrice !== '' && !isNaN(Number(createProductDto.costPrice)))
      ? Number(createProductDto.costPrice)
      : 0;

    const price = (createProductDto.price !== undefined && createProductDto.price !== null && createProductDto.price !== '' && !isNaN(Number(createProductDto.price)))
      ? Number(createProductDto.price)
      : 0;

    const comparePrice = (createProductDto.comparePrice !== undefined && createProductDto.comparePrice !== null && createProductDto.comparePrice !== '' && !isNaN(Number(createProductDto.comparePrice)))
      ? Number(createProductDto.comparePrice)
      : null;

    let subCategoryId: string | null = null;
    if (createProductDto.subCategoryId && typeof createProductDto.subCategoryId === 'string' && createProductDto.subCategoryId.trim() !== '' && createProductDto.subCategoryId !== 'null') {
      subCategoryId = createProductDto.subCategoryId.trim();
    }

    let badge: 'top' | 'new' | 'promo' | null = null;
    if (createProductDto.badge && ['top', 'new', 'promo'].includes(createProductDto.badge)) {
      badge = createProductDto.badge;
    }

    // Ensure variants don't have labels (identified only by sku, image and stock properties)
    let variants = createProductDto.variants;
    if (variants && Array.isArray(variants)) {
      variants = variants.map((v: any) => ({ 
        sku: v.sku, 
        image: v.image, 
        stock: (!isNaN(Number(v.stock))) ? Math.max(0, Number(v.stock)) : 0,
        stockAlert: (!isNaN(Number(v.stockAlert))) ? Math.max(0, Number(v.stockAlert)) : (createProductDto.stockAlert || 5),
        price: (v.price !== undefined && v.price !== null && v.price !== '') ? Number(v.price) : undefined
      }));
    }

    const product = this.productRepository.create({
      ...createProductDto,
      sku,
      slug,
      costPrice,
      price,
      comparePrice,
      subCategoryId,
      badge,
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
      try {
        const searchInput = query.search.trim();
        const terms = searchInput.split(/\s+/).filter(t => t.length > 0);
        
        if (terms.length > 0) {
          const conditions: string[] = [];
          const searchParams: Record<string, string> = {};
          
          terms.forEach((term, index) => {
            const paramName = `t${index}`;
            searchParams[paramName] = `%${term}%`;
            conditions.push(`(product.name ILIKE :${paramName} OR product.sku ILIKE :${paramName})`);
          });

          queryBuilder.andWhere(`(${conditions.join(' AND ')})`, searchParams);
        }
      } catch (err) {
        console.error('❌ [ProductsService] Search construction failed:', err);
      }
    }

    if (query.category && query.category !== 'produits-onglerie' && query.category !== 'all') {
      const rawCat = query.category.trim();
      const cleanCat = rawCat.toLowerCase().replace(/--+/g, '-');
      const doubleDashCat = cleanCat.replace(/-/g, '--');
      const catSlugs = Array.from(new Set([rawCat, cleanCat, doubleDashCat, rawCat.toLowerCase()]));

      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawCat)) {
        queryBuilder.andWhere(
          '(category.slug IN (:...catSlugs) OR subCategory.slug IN (:...catSlugs) OR category.id = :rawCat)',
          { catSlugs, rawCat }
        );
      } else {
        queryBuilder.andWhere(
          '(category.slug IN (:...catSlugs) OR subCategory.slug IN (:...catSlugs))',
          { catSlugs }
        );
      }
    }

    if ((query as any).subCategory) {
      const rawSub = ((query as any).subCategory as string).trim();
      const cleanSub = rawSub.toLowerCase().replace(/--+/g, '-');
      const doubleDashSub = cleanSub.replace(/-/g, '--');
      const subSlugs = Array.from(new Set([rawSub, cleanSub, doubleDashSub, rawSub.toLowerCase()]));

      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawSub)) {
        queryBuilder.andWhere(
          '(subCategory.slug IN (:...subSlugs) OR subCategory.id = :rawSub)',
          { subSlugs, rawSub }
        );
      } else {
        queryBuilder.andWhere('subCategory.slug IN (:...subSlugs)', { subSlugs });
      }
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

    // Sort - safely mapped to avoid EntityColumnNotFound on unmapped columns like 'popular'
    const allowedSortFields: Record<string, string> = {
      price: 'product.price',
      createdAt: 'product.createdAt',
      newest: 'product.createdAt',
      name: 'product.name',
    };

    if (query.sortBy === 'popularity' || query.sortBy === 'popular') {
      queryBuilder.orderBy('product.isFeatured', 'DESC').addOrderBy('product.createdAt', 'DESC');
    } else if (query.sortBy && allowedSortFields[query.sortBy]) {
      queryBuilder.orderBy(allowedSortFields[query.sortBy], query.order === 'asc' ? 'ASC' : 'DESC');
    } else {
      queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    try {
      if (query.search) {
          console.log(`🔍 [ProductsService] SQL: ${queryBuilder.getSql()}`);
          console.log(`🔍 [ProductsService] Params:`, queryBuilder.getParameters());
      }
      
      const [products, total] = await queryBuilder
        .skip(skip)
        .take(query.limit)
        .getManyAndCount();

      console.log(`✅ [ProductsService] Found ${products.length} products (Total: ${total}) for search: "${query.search || ''}"`);

      return {
        items: products.map(p => this.sanitizeForStore(p)),
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
        hasNext: skip + query.limit < total,
        hasPrev: query.page > 1,
      };
    } catch (err) {
      console.error('❌ [ProductsService] Database execution failed:', err.message);
      console.error('🔗 [ProductsService] Failed Query:', queryBuilder.getSql());
      throw err; // Re-throw to keep the 500 but now with logs in Render
    }
  }

  private sanitizeForStore(product: any): any {
    if (!product) return product;
    const { costPrice, stockAlert, ...sanitized } = product;
    if (sanitized.variants && Array.isArray(sanitized.variants)) {
      sanitized.variants = sanitized.variants.map((v: any) => {
        const { costPrice: _c, stockAlert: _s, ...vRest } = v;
        return vRest;
      });
    }
    return sanitized;
  }

  async findBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: { slug, isActive: true },
      relations: ['category', 'subCategory'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.sanitizeForStore(product);
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

      return products.map(p => this.sanitizeForStore(p));
    } catch (error) {
      console.error('❌ [ProductsService] findFeatured Error:', error);
      // Fallback simple sans relations si ça plante (cas de DB corrompue ou relations manquantes)
      try {
        const fallbackProducts = await this.productRepository.find({
          where: { isActive: true },
          take: limit,
          order: { createdAt: 'DESC' },
        });
        return fallbackProducts.map(p => this.sanitizeForStore(p));
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
        stockAlert: v.stockAlert || updateData.stockAlert || product.stockAlert || 5,
        price: (v.price !== undefined && v.price !== null && v.price !== '') ? Number(v.price) : undefined
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
