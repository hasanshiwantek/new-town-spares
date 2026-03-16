"use client";

import Link from "next/link";
import React from "react";

const ProductOverview = ({ product }: { product: any }) => {
  return (
    <section className="my-8" aria-labelledby="product-overview-heading">
      <div className="w-full max-w-[1719px] flex flex-col ">
        <div className="flex flex-col gap-8">
          {/* Main Overview Heading */}

          {/* Intro Paragraph */}
         
           {/* <div className="description-content" 
         dangerouslySetInnerHTML={{ __html: product?.description }}>
    </div> */}
          {/* <p className="h5-regular !leading-relaxed w-full xl:w-[60rem] 2xl:w-[80rem]">
            Introducing the {product?.name || "N/A"}, a versatile solution for
            your networking needs. This product is manufactured by
            {product?.brand?.name || "N/A"}, offering reliable performance for
            enterprises and organizations.
          </p> */}

          {/* Key Features */}
          {/* <section className="" aria-labelledby="key-features-heading">
            <h3 className="h5-regular !mb-2">Key Features:</h3>
            <ul className="!list-disc !list-inside !space-y-3">
              <li className="h5-regular">
                <span className="">SKU:</span> {product?.sku || "N/A"}
              </li>
              <li className="h5-regular">
                <span className="">MPN:</span> {product?.mpn || "N/A"}
              </li>
              <li className="h5-regular">
                <span className="">Brand:</span> {product?.brand?.name || "N/A"}
              </li>
              <li className="h5-regular">
                <span className="">Category:</span>{" "}
                {product?.categories?.[0]?.name || "N/A"}
              </li>
              <li className="h5-regular">
                <span className="">Availability:</span>{" "}
                {product?.availabilityText || "N/A"}
              </li>
              <li className="h5-regular">
                <span className="">Weight:</span>{" "}
                {product?.dimensions?.weight
                  ? `${product.dimensions.weight} lbs`
                  : "N/A"}
              </li>
            </ul>
          </section> */}

          {/* Closing Paragraph */}
          {/* <p
            className="!mb-10 !leading-relaxed h5-regular"
            dangerouslySetInnerHTML={{
              __html:
                product?.metaDescription ||
                product?.description ||
                "No description available for this product.",
            }}
          ></p> */}
        </div>

        {/* Product Details Section */}
        <section className="border" aria-labelledby="product-details-heading">
          <div className=" p-4">
          <h2 className="text-[20px] text-[#333333]">Description</h2>
          </div>
          <div className="px-4">
            <h2 className="text-[16px] text-[#33333]!mb-2">{product?.metaDescription || "N/A"}</h2>
          </div>
          <div className=" p-4">
          <h2 className="text-[20px] text-[#333333]">Details</h2>
          </div>
<hr className="border-t border-2 border-[#333333] opacity-80 w-[98%] mx-auto mb-3" />
          {/* Key-Value Details */}
          <dl className="p-2 space-y-4">
  {[
    ["Brand", product?.brand?.name || "N/A"],
    [
      "Weight",
      product?.dimensions?.weight
        ? `${product.dimensions.weight} lbs`
        : "N/A",
    ],
    ["MSRP", product?.msrp ? `$${product.msrp}` : "N/A"],
    ["Price", product?.price ? `$${product.price}` : "N/A"],
    ["Condition", product?.showCondition ? "Yes" : "N/A"],
    ["Availability", product?.availabilityText || "N/A"],
    ["Stock", product?.currentStock ?? "N/A"],
  ].map(([key, value], index) => (
    <div
      key={key}
      className={`!grid  !grid-cols-[180px_1fr] lg:!grid-cols-[350px_1fr] !items-center !p-2 ${
        index % 2 === 1 ? "" : "bg-[#F2F2F2]"
      }`}
    >
      <dt className="text-[16px] text-[#333333]">{key}</dt>
      <dd className="text-[16px] text-[#333333]">
        {key === "Brand" && product?.brand?.name ? (
          <Link
            href={`/brand/${product.brand.slug}`}
          >
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  ))}
</dl>

        </section>
      </div>
    </section>
  );
};

export default ProductOverview;
