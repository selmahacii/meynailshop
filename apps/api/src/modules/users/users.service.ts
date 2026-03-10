import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';
import { Address } from '../../database/entities/address.entity';
import { PaginationDto } from '../../common/pagination/pagination.dto';
import { PaginatedResult } from '../../common/pagination/paginated-result.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) { }

  async create(createUserDto: any) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const userPayload = {
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || 'client',
    };
    const user = this.userRepository.create(userPayload as any) as unknown as User;

    await this.userRepository.save(user);
    return this.formatUser(user);
  }

  async findAll(paginationDto: PaginationDto & { isActive?: boolean; role?: string }): Promise<PaginatedResult<any>> {
    const skip = (paginationDto.page - 1) * paginationDto.limit;

    const where: any = {};
    if (typeof paginationDto.isActive === 'boolean') {
      where.isActive = paginationDto.isActive;
    }
    if (paginationDto.role) {
      where.role = paginationDto.role;
    }

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: paginationDto.limit,
      relations: ['addresses'],
      order: { createdAt: 'DESC' },
    });

    return {
      items: users.map((u) => this.formatUser(u)),
      total,
      page: paginationDto.page,
      limit: paginationDto.limit,
      totalPages: Math.ceil(total / paginationDto.limit),
      hasNext: skip + paginationDto.limit < total,
      hasPrev: paginationDto.page > 1,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses', 'orders'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.formatUser(user);
  }

  async update(id: string, updateUserDto: any) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    return this.formatUser(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = false;
    await this.userRepository.save(user);

    return { message: 'User deactivated' };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.formatUser(user);
  }

  async updateProfile(userId: string, updateUserDto: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    return this.formatUser(user);
  }

  async addAddress(userId: string, createAddressDto: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (createAddressDto.isDefault) {
      await this.addressRepository.update(
        { userId },
        { isDefault: false },
      );
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      userId,
    });

    await this.addressRepository.save(address);
    return address;
  }

  async getAddresses(userId: string) {
    return this.addressRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async removeAddress(userId: string, addressId: string) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.addressRepository.remove(address);
    return { message: 'Address deleted' };
  }

  private formatUser(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
