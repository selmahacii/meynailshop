import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: "client" | "admin";
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    getCurrentUser(user: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
