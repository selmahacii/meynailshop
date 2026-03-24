import { UploadService } from './upload.service';
interface MulterFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadProductImage(file: MulterFile): Promise<{
        statusCode: number;
        message: string;
        data: {
            filename: string;
            url: string;
        };
    }>;
    uploadProductImages(files: MulterFile[]): Promise<{
        statusCode: number;
        message: string;
        data: {
            filename: string;
            url: string;
        }[];
    }>;
    deleteFile(filename: string): Promise<{
        statusCode: number;
        message: string;
    }>;
}
export {};
