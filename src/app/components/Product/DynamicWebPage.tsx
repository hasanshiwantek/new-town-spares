import Link from 'next/link'
import WebContactForm from "./WebContactForm";

const DynamicWebPage = ({ webPages }: { webPages: any }) => {
    const showTheseFields = webPages?.showTheseFields
    const html =
        webPages?.pageType == "4"
            ? webPages?.rawHtml
            : webPages?.pageContent;
    return (
        <main className="flex flex-col gap-30" role="main">
            <div className="w-full max-w-[1170px] mx-auto lg:px-6 xl:px-0">
                <div className="py-2">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Content */}
                        <div className="lg:col-span-12">
                            <h2 className=""><Link href="/" className="text-[11px] "
                                itemProp="name"
                            >
                                Home
                            </Link> {" "} <span className="mt-2 mx-3 text-gray-400 text-[11px]" aria-hidden="true">/</span> {" "} <span
                                className="!text-[#D42020] text-[11px]"
                                itemProp="name"
                            >
                                    {webPages?.pageName}
                                </span></h2>

                            {/* Page Title */}
                            <h1 className="text-4xl mb-4 text-[#4A4A4A] mt-5">
                                {webPages?.pageName}
                            </h1>

                            <div
                                className="prose prose-sm sm:prose-base max-w-none 
               text-[14px] leading-[20px] 
               [&_ol]:space-y-6 [&_ol]:list-decimal [&_ol]:pl-5 
               [&_li]:text-[14px] [&_li]:leading-[20px] 
               [&_strong]:font-bold [&_p]:mb-0
               [&_img]:max-w-full [&_img]:h-auto [&_img]:mx-auto
               [&_iframe]:max-w-full [&_iframe]:aspect-video [&_iframe]:mx-auto
               [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse
               [&_td]:border [&_th]:border [&_td]:p-2 [&_th]:p-2
               break-words"
                                dangerouslySetInnerHTML={{
                                    __html: html || "",
                                }}
                            />
                            {webPages?.pageType == "3" && (
                                <WebContactForm showTheseFields={showTheseFields} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DynamicWebPage
