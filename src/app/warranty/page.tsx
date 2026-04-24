import React from 'react'

const page = () => {
  return (
      <main className="flex flex-col gap-30" role="main">
            <div className="w-full max-w-[1170px] mx-auto lg:px-6 xl:px-0">
                <div className="py-2">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


                        {/* Content */}
                        <div className="lg:col-span-12">
                            <h2 className=""><span
                                className="text-[11px] !text-[#D42020]"
                                itemProp="name"
                            >
                                Home
                            </span> {" "} <span className="mt-2 mx-3 text-gray-400 text-[11px]" aria-hidden="true">/</span> {" "} <span
                                className="!text-[#D42020] text-[11px]"
                                itemProp="name"
                            >
                                    Warranty
                                </span></h2>

                            {/* Page Title */}
                            <h1 className="text-4xl mb-4 text-[#4A4A4A] mt-5">
                                Warranty
                            </h1>



                            <ul className="text-[14px] leading-[20px] pl-5 my-5">
                                <li>Warranty Terms:</li>
                            </ul>


                            {/* Policy Content */}
                            <ol className="space-y-6 list-decimal pl-5">

                                <li className="text-[14px] leading-[20px]">
                                    <strong>Coverage:</strong> We warrant that the electronic parts
                                     we sell will be free from defects in materials and workmanship
                                      under normal use for a period of 30 days
                                </li>

                                <li className="text-[14px] leading-[20px]">
                                    <strong>Limitations:</strong>  This warranty does not cover damages
                                     caused by misuse, abuse, accidental damage, or unauthorized 
                                     modification of the product.
                                </li>

                                <li className="text-[14px] leading-[20px]">
                                    <strong>Remedies:  </strong>  If a product fails to conform to the warranty, 
                                    we will, at our option, repair or replace the product, or refund the purchase 
                                    price, in accordance with the terms and conditions of this warranty.
                                </li>

                                <li className="text-[14px] leading-[20px]">
                                    <strong>Disclaimer: </strong>: Except for the express warranty set forth above,
                                     we make no other warranties, express or implied, and we specifically disclaim
                                      any implied warranties of merchantability or fitness for a particular purpose.
                                </li>

                                <li className="text-[14px] leading-[20px]">
                                    <strong>Limitation of Liability:</strong> Our liability under this warranty is limited 
                                    to the amount paid by the customer for the product. In no event will we be liable
                                     for any indirect, incidental, or consequential damages arising out of the use of the product.
                                </li>

                            </ol>

                        </div>
                    </div>
                </div>
            </div>
        </main>
  )
}

export default page