
import Link from "next/link";
import { baseURL, storeId } from "@/lib/axiosInstance";
import WebDynamicList from "../components/sitemap/WebDynamicList";

const SHOW_BRANDS_LIMIT = 19;
const SHOW_CATEGORIES_LIMIT = 3;

async function fetchCategories() {
  try {
    const res = await fetch(`${baseURL}web/categories/get-categories`, {
      headers: { storeId: storeId },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function fetchBrands() {
  try {
    const res = await fetch(`${baseURL}web/brands/brands`, {
      headers: { storeId: storeId },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function fetchWebPages() {
  try {
    const res = await fetch(`${baseURL}web/webpages/web-pages?page=1&perPage=100`, {
      headers: { storeId: storeId },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

const CategoryList: React.FC<{ categories: any[]; categoriesLength?: number }> = ({
  categories,
  categoriesLength,
}) => {
  if (!categories || categories.length === 0) return null;
  const visibleCategories = categories.slice(0, SHOW_CATEGORIES_LIMIT);

  return (
    <ul className="list-disc list-inside ml-4 space-y-1">
      {visibleCategories.map((cat) => (
        <li key={cat.slug}>
          <Link href={`/category/${cat.slug}`} className="text-[#333333] !font-normal text-[14px] underline">
            {cat.name}
          </Link>
          {cat.subcategories && cat.subcategories.length > 0 && (
            <CategoryList categories={cat.subcategories} />
          )}
        </li>
      ))}
      {categoriesLength !== undefined && categoriesLength > SHOW_CATEGORIES_LIMIT && (
        <li style={{ listStyleType: "circle" }}>
          <Link href="/sitemap/categories" className="text-[#333333] !font-normal text-[14px] underline">
            Show All
          </Link>
        </li>
      )}
    </ul>
  );
};

function BrandsList({ brands }: { brands: any[] }) {
  const visibleBrands = brands.slice(0, SHOW_BRANDS_LIMIT);

  return (
    <ul className="list-disc list-inside ml-4 space-y-1">
      {visibleBrands.map((brand: any) => (
        <li key={brand.slug} style={{ listStyleType: "circle" }}>
          <Link href={`/brand/${brand.brand.slug}`} className="text-[#333333] text-[14px]  !font-normal underline">
            {brand.brand.name}
          </Link>
        </li>
      ))}
      {brands.length > SHOW_BRANDS_LIMIT && (
        <li style={{ listStyleType: "circle" }}>
          <Link href="/sitemap/brands" className="text-[#333333] !font-normal text-[14px] underline">
            Show All
          </Link>
        </li>
      )}
    </ul>
  );
}

export default async function SitemapPage() {
  const categories = await fetchCategories();
  const brands = await fetchBrands();
  const webPages = await fetchWebPages();

  return (
    <main className="w-full max-w-[1170px]  mx-auto mt-8 lg:px-6 xl:px-4">
      <h1 className="text-[28px] text-[#333333] !font-normal mb-6">Sitemap</h1>

      {webPages?.length > 0 && (
        <WebDynamicList webPages={webPages} />
      )}

      {categories?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[22px] text-[#333333] !font-normal mb-2">• Categories</h2>
          <CategoryList categories={categories} categoriesLength={categories.length} />
        </section>
      )}

      {brands?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[22px] text-[#333333] !font-normal mb-2">• Brands</h2>
          <BrandsList brands={brands} />
        </section>
      )}
    </main>
  );
}
