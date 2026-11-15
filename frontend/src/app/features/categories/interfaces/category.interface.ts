export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  parent?: Category | null;
  children?: Category[];
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  parentId?: string;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;
