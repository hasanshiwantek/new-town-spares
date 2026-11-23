import { fetchBrands } from "@/lib/api/brand";
import ProductsClientWrapper from "./ProductsClientWrapper";
import { fetchCategories } from "@/lib/api/category";

interface ProductsPageContentProps {
  initialCategorydescription?: any;
  initialCategoryId?: number;
  initialCategoryName?: string;
  initialBrandId?: number;
  initialBrandName?: string;
}

export default async function ProductsPageContent({
  initialCategoryId,
  initialCategoryName,
  initialBrandId,
  initialBrandName,
  initialCategorydescription,
}: ProductsPageContentProps) {
  const categories = await fetchCategories();
  const brands = await fetchBrands();

  return (
    <div>
      <ProductsClientWrapper
        categories={categories}
        brands={brands}
        initialCategoryId={initialCategoryId}
        initialCategoryName={initialCategoryName}
        initialBrandId={initialBrandId}
        initialBrandName={initialBrandName}
        initialCategorydescription={initialCategorydescription}
      />
    </div>
  );
}
