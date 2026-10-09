import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadProductImage(file: MulterFile): Promise<string> {
    if (!file) {
      throw new BadRequestException('Fichier manquant');
    }

    const filename = `${uuidv4()}.webp`;
    const filePath = path.join(this.uploadDir, filename);

    this.logger.log(`📥 Début upload image locale: ${filename}`);

    try {
      // 1. Process image with Sharp
      await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'cover',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(filePath);

      this.logger.log(`✅ Image uploadée avec succès en local : ${filename}`);
      return filename;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Erreur lors de l'upload local : ${errMsg}`);
      throw new BadRequestException("Erreur lors de l'upload de l'image");
    }
  }

  async deleteFile(filename: string): Promise<void> {
    this.logger.log(`🗑️ Demande de suppression locale : ${filename}`);
    
    try {
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`✅ Fichier supprimé en local : ${filename}`);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error deleting file ${filename}: ${errMsg}`);
    }
  }

  getFileUrl(filename: string): string {
    // Return relative URL, frontend proxy or backend static serve will handle it
    return `/uploads/${filename}`;
  }
}
