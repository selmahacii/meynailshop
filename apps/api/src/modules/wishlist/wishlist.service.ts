import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from '../../database/entities/wishlist-item.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private wishlistRepository: Repository<WishlistItem>,
  ) {}

  async addItem(userId: string, productId: string) {
    const exists = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });
    if (exists) throw new BadRequestException('Already in wishlist');
    const item = this.wishlistRepository.create({ userId, productId });
    return await this.wishlistRepository.save(item);
  }

  async getItems(userId: string) {
    return this.wishlistRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async removeItem(userId: string, productId: string) {
    await this.wishlistRepository.delete({ userId, productId });
    return { message: 'Removed from wishlist' };
  }
}
