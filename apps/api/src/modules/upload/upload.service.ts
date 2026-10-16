import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { UploadedFileEntity } from '../../database/entities/uploaded-file.entity';

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

  constructor(
    private configService: ConfigService,
    @InjectRepository(UploadedFileEntity)
    private readonly fileRepo: Repository<UploadedFileEntity>,
  ) {
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

    this.logger.log(`📥 Début upload image: ${filename}`);

    try {
      // 1. Process image with Sharp to WebP buffer
      const processedBuffer = await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'cover',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();

      // 2. Write to local disk cache
      await fs.promises.writeFile(filePath, processedBuffer);

      // 3. Persist to PostgreSQL database (survives Render restarts & redeploys)
      try {
        const fileRecord = this.fileRepo.create({
          filename,
          data: processedBuffer,
          mimetype: 'image/webp',
        });
        await this.fileRepo.save(fileRecord);
        this.logger.log(`💾 Image persistée en base de données : ${filename}`);
      } catch (dbError) {
        this.logger.error(`⚠️ Erreur sauvegarde DB pour ${filename}: ${dbError instanceof Error ? dbError.message : dbError}`);
      }

      this.logger.log(`✅ Image uploadée avec succès : ${filename}`);
      return filename;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Erreur lors du traitement de l'image : ${errMsg}`);
      throw new BadRequestException("Erreur lors de l'upload de l'image");
    }
  }

  async deleteFile(filename: string): Promise<void> {
    this.logger.log(`🗑️ Demande de suppression : ${filename}`);
    
    try {
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        this.logger.log(`✅ Fichier supprimé du disque : ${filename}`);
      }

      // Also remove from database
      await this.fileRepo.delete({ filename });
      this.logger.log(`✅ Fichier supprimé de la base de données : ${filename}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error deleting file ${filename}: ${errMsg}`);
    }
  }

  getFileUrl(filename: string): string {
    const isProd = process.env.NODE_ENV === 'production';
    const baseUrl = process.env.API_URL || (isProd ? 'https://meeynailshop-api.onrender.com' : 'http://127.0.0.1:3001');
    return `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;
  }
}

