export interface Product {
  id: number | string;
  title: string;
  description: string;
  price: string | number;
  image?: string;
}


export type ProductFilterPayload = {
  page?: number;
  pageSize?: number;
  categoryIds?: number[]; // multiple categories allowed
  brandId?: number[]; // single brand
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string; // "priceLowToHigh" etc.
};
