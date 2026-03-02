import { IsString, IsEmail, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
    @IsString()
    @IsOptional()
    shopName?: string;

    @IsEmail()
    @IsOptional()
    shopEmail?: string;

    @IsString()
    @IsOptional()
    shopPhone?: string;

    @IsString()
    @IsOptional()
    shopAddress?: string;

    @IsNumber()
    @IsOptional()
    shippingCostDefault?: number;

    @IsNumber()
    @IsOptional()
    freeShippingThreshold?: number;

    @IsNumber()
    @IsOptional()
    stockAlertDefault?: number;

    @IsBoolean()
    @IsOptional()
    notifyStockAlert?: boolean;

    @IsBoolean()
    @IsOptional()
    notifyNewOrder?: boolean;

    @IsBoolean()
    @IsOptional()
    notifyNewReview?: boolean;
}
