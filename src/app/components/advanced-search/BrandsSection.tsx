import Link from 'next/link'
import React from 'react'

const BrandsSection = ({ brands }: { brands: any[] }) => {
    return (
        <div className="mt-2.5">
            <div className="flex flex-wrap items-center text-[14px]">
                {brands?.map((brand, index: number) => (
                    <React.Fragment key={brand?.id}>
                        <Link
                            href={`/brand/${brand?.slug}`}
                            className="text-[#333] underline  whitespace-nowrap"
                        >
                            {brand?.name}
                        </Link>
                        {index < brands?.length - 1 && (
                            <span className="text-gray-500 mx-1">,</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default BrandsSection