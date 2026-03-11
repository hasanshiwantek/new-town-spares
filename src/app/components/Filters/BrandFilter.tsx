interface BrandFilterProps {
  brands: any[];
  handleBrandClick: (brandId: number, brandName: string, slug?: string) => void;
  activeBrandId?: number;
}

export default function BrandFilter({
  brands,
  handleBrandClick,
  activeBrandId,
}: BrandFilterProps) {
  return (
    <ul className="space-y-1 mt-2">
      {brands.map((b: any) => {
        const isActive = activeBrandId === b.brand.id; // ✅ Check if brand is active
        return (
          <li
            key={b.brand.id}
            onClick={() => handleBrandClick(b.brand.id, b.brand.name, b.brand.slug)}
              className={`text-[13px] py-1 rounded-md cursor-pointer transition-all duration-200
              ${
                isActive
                  ? "font-bold text-black"
                  : "text-[#333333] hover:bg-gray-100"
              }`}
          >
            {b.brand.name}
          </li>
        );
      })}
    </ul>
  );
}
