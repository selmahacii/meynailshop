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
    imageUrl?: string;
}
export declare class UpdateSubCategoryDto {
    name?: string;
    slug?: string;
    imageUrl?: string;
    isActive?: boolean;
}
