import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
  private readonly supabase: SupabaseClient;
  private readonly bucket: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    this.bucket = this.configService.get<string>('SUPABASE_BUCKET', 'products');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('❌ Supabase configuration missing (URL or KEY)');
      throw new Error('Supabase configuration missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadProductImage(file: MulterFile): Promise<string> {
    if (!file) {
      throw new BadRequestException('Fichier manquant');
    }

    const filename = `${uuidv4()}.webp`;

    this.logger.log(`📥 Début upload image vers Supabase Storage: ${filename}`);

    try {
      // 1. On traite l'image avec Sharp en mémoire (buffer) pour optimisation
      const processedImageBuffer = await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'cover',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();

      // 2. On l'envoie sur Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .upload(filename, processedImageBuffer, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (error) {
        throw error;
      }

      this.logger.log(`✅ Image uploadée avec succès sur Supabase : ${filename}`);
      return filename;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Erreur fatale lors de l'upload Supabase : ${errMsg}`);
      throw new BadRequestException("Erreur lors de l'upload vers Supabase Storage");
    }
  }

  async deleteFile(filename: string): Promise<void> {
    this.logger.log(`🗑️ Demande de suppression sur Supabase : ${filename}`);
    
    try {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([filename]);

      if (error) {
        throw error;
      }
      
      this.logger.log(`✅ Fichier supprimé de Supabase : ${filename}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error deleting file ${filename} from Supabase: ${errMsg}`);
    }
  }

  getFileUrl(filename: string): string {
    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filename);

    if (!data || !data.publicUrl) {
      this.logger.warn(`⚠️ Impossible de générer l'URL publique pour : ${filename}`);
      return filename;
    }

    this.logger.log(`🖼️ URL publique Supabase générée : ${data.publicUrl}`);
    return data.publicUrl;
  }
}
