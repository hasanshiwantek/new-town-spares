// import Link from 'next/link'
// import React from 'react'

// const CategoriesSection = ({ categories }: { categories: any[] }) => {
//   const categoryPairs: { parent: any; child: any }[] = []
//   categories?.forEach((category: any) => {
//     if (category?.subcategories?.length > 0) {
//       category.subcategories.slice(0, 3).forEach((sub: any) => {
//         categoryPairs.push({ parent: category, child: sub })
//       })
//     }
//   })

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-3 text-sm">
//       {categoryPairs?.map((pair, index) => (
//         <div key={index} className="text-[15px]">
//           <Link
//             href={`/category/${pair.parent.slug}`}
//             className="text-[#d42020] underline "
//           >
//             {pair.parent.name}
//           </Link>
//           <span className="text-gray-500 mx-1">&gt;</span>
//           <Link
//             href={`/category/${pair.child.slug}`}
//             className="text-[#d42020] underline"
//           >
//             {pair.child.name}
//           </Link>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default CategoriesSection
import Link from 'next/link'
import React from 'react'

const CategoriesSection = ({ categories }: { categories: any[] }) => {
  const categoryChains: any[][] = []

  const buildChains = (category: any, chain: any[] = []) => {
    const currentChain = [...chain, category]
    // Always push the current chain as a row
    if (chain.length > 0) {
      categoryChains.push(currentChain)
    }
    // Continue deeper if subcategories exist
    if (category?.subcategories?.length > 0) {
      category.subcategories.forEach((sub: any) => {
        buildChains(sub, currentChain)
      })
    }
  }
   const poppinsFont = "Poppins, sans-serif";

  categories?.forEach((category: any) => {
    // Top-level with no children — show alone
    if (!category?.subcategories?.length) {
      categoryChains.push([category])
    } else {
      category.subcategories.forEach((sub: any) => {
        buildChains(sub, [category])
      })
    }
  })

  return (
    <div className="flex flex-col gap-y-[2px]" style={{fontFamily:poppinsFont}}>
      {categoryChains?.map((chain, index) => (
        <div key={index} className="flex items-center flex-wrap text-[14px] leading-[22px]">
          {chain.map((cat, i) => (
            <React.Fragment key={cat.slug || i}>
              <Link
                href={`/category/${cat.slug}`}
                className="text-[#333333] underline hover:text-black"
              >
                {cat.name}
              </Link>
              {i < chain.length - 1 && (
                <span className="text-gray-400 mx-1">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  )
}

export default CategoriesSection