import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/pagination/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() createUserDto: any) {
    return {
      statusCode: 201,
      message: 'User created',
      data: await this.usersService.create(createUserDto),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.usersService.findAll(paginationDto);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return {
      statusCode: 200,
      data: await this.usersService.getProfile(user.id),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@CurrentUser() user: any, @Body() updateUserDto: any) {
    return {
      statusCode: 200,
      message: 'Profile updated',
      data: await this.usersService.updateProfile(user.id, updateUserDto),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      statusCode: 200,
      data: await this.usersService.findOne(id),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    return {
      statusCode: 200,
      message: 'User updated',
      data: await this.usersService.update(id, updateUserDto),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      statusCode: 200,
      message: 'User deactivated',
      data: await this.usersService.remove(id),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/addresses')
  async getAddresses(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    if (id !== user.id && user.role !== 'admin') {
      return { statusCode: 403, message: 'Forbidden' };
    }
    return {
      statusCode: 200,
      data: await this.usersService.getAddresses(id),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/addresses')
  async addAddress(
    @Param('id') id: string,
    @Body() createAddressDto: any,
    @CurrentUser() user: any,
  ) {
    if (id !== user.id && user.role !== 'admin') {
      return { statusCode: 403, message: 'Forbidden' };
    }
    return {
      statusCode: 201,
      message: 'Address added',
      data: await this.usersService.addAddress(id, createAddressDto),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/addresses/:addressId')
  async removeAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
    @CurrentUser() user: any,
  ) {
    if (id !== user.id && user.role !== 'admin') {
      return { statusCode: 403, message: 'Forbidden' };
    }
    return {
      statusCode: 200,
      data: await this.usersService.removeAddress(id, addressId),
    };
  }
}
