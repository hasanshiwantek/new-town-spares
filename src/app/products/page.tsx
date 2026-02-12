// app/products/page.tsx
import { fetchCategories } from "@/lib/api/category";
import { fetchBrands } from "@/lib/api/brand";
import ProductsClientWrapper from "../components/Product/ProductsClientWrapper";

export default async function ProductsPage({
  initialCategoryId,
  initialCategoryName,
  initialBrandId,
  initialBrandName,
  initialCategorydescription,
}: {
  initialCategorydescription?: any;
  initialCategoryId?: number;
  initialCategoryName?: string;
  initialBrandId?: number;
  initialBrandName?: string;
}) {
  const categories = await fetchCategories();
  const brands = await fetchBrands();

  return (
    <div className="">
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
