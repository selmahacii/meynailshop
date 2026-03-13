import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHealth(): {
        statusCode: number;
        message: string;
        data: {
            server: string;
            timestamp: string;
        };
    };
    getHello(): {
        message: string;
        version: string;
        status: string;
        storefront: string;
        documentation: string;
    };
}
