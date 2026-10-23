export declare class UpdateCategoryDto {
    name?: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
    isActive?: boolean;
}
export declare class CreateSubCategoryDto {
    name: string;
    slug?: string;
    description?: string;
    displayOrder?: number;
    isActive?: boolean;
    imageUrl?: string;
    categoryId?: string;
}
export declare class UpdateSubCategoryDto {
    name?: string;
    slug?: string;
    description?: string;
    displayOrder?: number;
    imageUrl?: string;
    isActive?: boolean;
    categoryId?: string;
}
export declare class AssignProductsDto {
    productIds: string[];
}
