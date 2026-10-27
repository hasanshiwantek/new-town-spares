export interface GroupedBrand {
  name: string;
  slug: string;
}

export type GroupedBrands = Record<string, GroupedBrand[]>;