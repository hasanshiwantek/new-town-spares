"use client";
import { useEffect, useState } from "react";
// import CategoriesSidebar from "../components/Home/CategoriesSidebar";
// import BrandsSidebar from "../components/Home/BrandsSidebar";
import BrandsSection from "../components/advanced-search/BrandsSection";
import CategoriesSection from "../components/advanced-search/CategoriesSection";
import { fetchCategories } from "@/lib/api/category";
import { fetchBrands } from "@/lib/api/brand";
import ProductsClientWrapper from "../components/advanced-search/ProductsClientWrapper";
import ProductTabs from "../components/advanced-search/ProductTabs";
import AdvancedSearchForm from "../components/advanced-search/AdvancedSearchForm";
import NoResults from "../components/advanced-search/NoResults";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [currentTab, setCurrentTab] = useState(0);
    const [searchForm, setSearchForm] = useState(false);
    const { loading, products, pagination, categories, brands, error, productCount } = useAppSelector((state: any) => state?.advanceSearch);
    const searchParams = useSearchParams();
    // const query = searchParams.get("q");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState([]);
    const [brand, setBrand] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("advancedSearchFilters");
        if (stored) {
            const parsed = JSON.parse(stored);
            setQuery(parsed.q || "");
        }
    }, []);
    useEffect(() => {
        const loadData = async () => {
            try {
                const catData = await fetchCategories();
                setCategory(catData);

                const brandData = await fetchBrands();
                setBrand(brandData);
            } catch (error) {
                console.error("Failed to load categories/brands", error);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (query && searchForm) {
            setSearchForm(false)
        }
    }, [query])

    return (
        <>
            <main
                role="main"
                className="w-full max-w-[1170px] mx-auto px-4 lg:px-6 xl:px-0"
            >
                <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
                    {/* Left Sidebar - Fixed 235px on desktop */}
                    <aside className="hidden lg:block md:w-[20%] flex-shrink-0">
                        {/* <CategoriesSidebar />
                        <BrandsSidebar /> */}
                    </aside>

                    {/* Main Product Content - Fixed 912px max on desktop */}
                    <article className="w-full lg:max-w-[78%]">
                        <div className="mb-4 px-4 md:px-0">
                            <h2>
                                <Link href={"/"} className="text-[11px]" itemProp="name">
                                    Home
                                </Link>
                                <span>
                                    <span
                                        className="mt-2 mx-3 text-gray-400 text-[11px]"
                                        aria-hidden="true"
                                    >
                                        /
                                    </span>
                                    <span
                                        className={`text-[11px] 
                   !text-[#D42020]
                    `}
                                        itemProp="name"
                                    >
                                        Search
                                    </span>
                                </span>
                            </h2>
                        </div>
                        <div>
                            <h1 className="text-[28px] text-[#545454]">
                                {productCount || 0} results for {query}
                            </h1>
                        </div>
                        <div>
                            <ProductTabs
                                tabs={[
                                    { label: "PRODUCTS", count: productCount },
                                    // { label: "NEWS & INFORMATION", count: 0 },
                                    { label: searchForm ? "HIDE SEARCH FORM" : "SHOW SEARCH FORM", isDivided: true },
                                ]}
                                activeTab={currentTab}
                                onTabChange={(index) => {
                                    if (index == 2) {
                                        setSearchForm(!searchForm)
                                        return
                                    }
                                    setCurrentTab(index);
                                }}
                            />
                        </div>
                        {searchForm && <div>
                            <AdvancedSearchForm categories={category?.slice(0, 10)} brands={brand} onSearch={(values) => {
                                setSearchForm(!searchForm)
                            }} />
                        </div>}
                        <div>
                            {pagination?.currentPage == 1 && <div className=" p-6 rounded">
                                {categories?.length > 0 && <div>
                                    <div className="flex justify-between items-center  pb-1 mb-3">
                                        <h2 className=" text-[15px] text-[#545454] font-light">Categories</h2>
                                    </div>
                                    <CategoriesSection categories={categories} />
                                </div>}
                                {brands?.length > 0 && <div>
                                    <div className="flex justify-between items-center  pb-1 mt-4">
                                        <h2 className=" text-[15px] text-[#545454] font-light">Brands</h2>
                                    </div>
                                    <BrandsSection brands={brands} />
                                </div>}
                            </div>}
                            <div>
                                <ProductsClientWrapper />
                            </div>
                        </div>
                        {/* {products?.length === 0 && (
                            <NoResults
                                searchTerm={query || ""}
                                suggestedTerm=""
                                onRefineSearch={() => setCurrentTab(2)}
                            />
                        )} */}
                    </article>
                </div>
            </main>
        </>
    );
}
