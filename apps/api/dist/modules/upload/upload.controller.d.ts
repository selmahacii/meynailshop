import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadProductImage(file: Express.Multer.File): Promise<{
        statusCode: number;
        message: string;
        data: {
            filename: string;
            url: string;
        };
    }>;
    uploadProductImages(files: Express.Multer.File[]): Promise<{
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
