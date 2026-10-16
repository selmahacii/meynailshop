import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UploadedFileEntity } from '../../database/entities/uploaded-file.entity';
interface MulterFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}
export declare class UploadService {
    private configService;
    private readonly fileRepo;
    private readonly logger;
    private readonly uploadDir;
    constructor(configService: ConfigService, fileRepo: Repository<UploadedFileEntity>);
    uploadProductImage(file: MulterFile): Promise<string>;
    deleteFile(filename: string): Promise<void>;
    getFileUrl(filename: string): string;
}
export {};
