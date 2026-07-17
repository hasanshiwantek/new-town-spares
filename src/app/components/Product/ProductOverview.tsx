import Link from "next/link";

const ProductOverview = ({ product }: { product: any }) => {


  const customFields = product?.customFields?.filter(
    (item: { name: string; value: string }) => item.name && item.value
  )

  return (
    <section className="my-8" aria-labelledby="product-overview-heading">
      <div className="w-full max-w-[1719px] flex flex-col ">
        <div className="flex flex-col gap-8">
        </div>

        {/* Product Details Section */}
        <section className="border" aria-labelledby="product-details-heading">
          <div className="px-[21px] py-[21px]">
            <h2 className="text-[20px] leading-[24px] font-light text-[#333333] mb-[14px]">
              Description
            </h2>

            <div
              className="text-[16px] leading-[24px] text-[#333333]"
              dangerouslySetInnerHTML={{
                __html: product?.description || "No description available for this product.",
              }}
            />
          </div>

          {customFields?.length > 0 && (
            <>
              <div className="px-[21px] pt-[21px]">
                <h2 className="text-[20px] leading-[24px] font-light text-[#333333]">
                  Details
                </h2>
              </div>

              <hr className="mx-[21px] my-3 border-t-2 border-[#333333]" />

              <div className="px-[21px] pb-[21px]">
                <dl className="space-y-2">
                  {customFields?.map(
                    (
                      item: {
                        name: string;
                        value: string;
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className={`grid grid-cols-[180px_1fr] lg:grid-cols-[350px_1fr] items-center p-2 ${index % 2 === 0 ? "bg-[#F2F2F2]" : ""
                          }`}
                      >
                        <dt>{item.name}</dt>

                        <dd>
                          {item.name === "Brand" && product?.brand?.name ? (
                            <Link href={`/brand/${product.brand.slug}`}>
                              {item.value}
                            </Link>
                          ) : (
                            item.value
                          )}
                        </dd>
                      </div>
                    )
                  )}
                </dl>
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
};

export default ProductOverview;
