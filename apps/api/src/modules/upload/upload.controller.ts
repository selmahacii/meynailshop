import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../../../../packages/shared/types/api';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('product-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    const filename = await this.uploadService.uploadProductImage(file);
    return {
      statusCode: 201,
      message: 'Image uploadée avec succès',
      data: {
        filename,
        url: this.uploadService.getFileUrl(filename),
      },
    };
  }

  @Post('product-images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadProductImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const filename = await this.uploadService.uploadProductImage(file);
        return {
          filename,
          url: this.uploadService.getFileUrl(filename),
        };
      }),
    );

    return {
      statusCode: 201,
      message: 'Images uploadées avec succès',
      data: results,
    };
  }

  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    await this.uploadService.deleteFile(filename);
    return {
      statusCode: 200,
      message: 'Fichier supprimé avec succès',
    };
  }
}
