import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Minimal Multer file type to avoid requiring Express namespace
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
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
    this.ensureDirExists();
  }

  private ensureDirExists() {
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

    this.logger.log(`📥 Début upload image. Destination: ${filePath}`);

    try {
      await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'cover',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(filePath);

      this.logger.log(`✅ Fichier écrit avec succès sur le disque : ${filename}`);
      return filename;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Erreur fatale Sharp lors de l'ecriture : ${errMsg}`);
      throw new BadRequestException("Erreur lors du traitement de l'image");
    }
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);
    this.logger.log(`🗑️ Demande de suppression : ${filePath}`);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        this.logger.log(`✅ Fichier supprimé : ${filename}`);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Error deleting file ${filename}: ${errMsg}`);
      }
    }
  }

  getFileUrl(filename: string): string {
    // On essaie de recuperer l'adresse de Render
    let baseUrl = this.configService.get<string>('API_URL') || 
                  this.configService.get<string>('RENDER_EXTERNAL_URL') || 
                  '';
    
    if (baseUrl) {
      // S'assurer que l'adresse commence par https://
      if (!baseUrl.startsWith('http')) {
        baseUrl = `https://${baseUrl}`;
      }
      const cleanUrl = `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;
      this.logger.log(`🖼️ Image URL générée : ${cleanUrl}`);
      return cleanUrl;
    }
    
    this.logger.warn('⚠️ Aucune URL de base trouvée pour les uploads, retour au chemin relatif');
    return `/uploads/${filename}`;
  }
}
