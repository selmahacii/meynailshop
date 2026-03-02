import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { StockMovement } from '../../database/entities/stock-movement.entity';
import { Product } from '../../database/entities/product.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockMovement)
    private stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async adjustStock(productId: string, quantity: number, reason: string, reference?: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    product.stock += quantity;
    await this.productRepository.save(product);

    const movement = this.stockMovementRepository.create({
      productId,
      quantity,
      reason,
      reference,
      type: quantity > 0 ? 'in' : 'out',
    });

    return await this.stockMovementRepository.save(movement);
  }

  async getMovements(productId?: string) {
    const where = productId ? { productId } : {};
    return this.stockMovementRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async getAlerts(alertThreshold: number = 5) {
    return this.productRepository.find({
      where: { stock: Between(0, alertThreshold), isActive: true },
    });
  }
}
