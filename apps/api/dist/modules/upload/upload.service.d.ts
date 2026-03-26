import { ConfigService } from '@nestjs/config';
interface MulterFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}
export declare class UploadService {
    private configService;
    private readonly logger;
    private readonly supabase;
    private readonly bucket;
    constructor(configService: ConfigService);
    uploadProductImage(file: MulterFile): Promise<string>;
    deleteFile(filename: string): Promise<void>;
    getFileUrl(filename: string): string;
}
export {};
