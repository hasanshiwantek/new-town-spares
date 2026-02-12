"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductFAQs = () => {
  return (
    <section
      className="my-8 w-full max-w-[1719px] flex flex-col gap-8 "
      aria-labelledby="product-faqs-heading"
    >
      <h2 className="h1-secondary-medium">FAQs</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <Accordion type="single" collapsible className="w-full space-y-5">
          <AccordionItem value="q1" className="border rounded-md px-3">
            <AccordionTrigger className="h3-secondary ">
              What is the purpose of the Targus 720KB external floppy drive?
            </AccordionTrigger>
            <AccordionContent className="h5-20px-regular  leading-8">
              The Targus 720KB external floppy drive provides innovative and
              intelligent solutions for data storage. This makes it an excellent
              choice for developers, startups, and enterprises that aim to
              manage their digital products with utmost efficiency. With its
              reliable performance and user-friendly design, it caters to the
              diverse needs of modern businesses.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2" className="border rounded-md px-3">
            <AccordionTrigger className="h3-secondary">
              Professionals restoring old software or files from floppy disks.
            </AccordionTrigger>
            <AccordionContent className="h5-20px-regular leading-8">
              Perfect for IT specialists and engineers handling legacy files,
              ensuring smooth migration and restoration from floppy disk
              formats.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Right Column */}
        <Accordion type="single" collapsible className="w-full space-y-5">
          <AccordionItem value="q3" className="border rounded-md px-3">
            <AccordionTrigger className="h3-secondary ">
              Who can benefit from using the Targus 720KB external floppy drive?
            </AccordionTrigger>
            <AccordionContent className="h5-20px-regular leading-8">
              This device is ideal for both professionals and hobbyists looking
              for reliable legacy data storage access.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4" className="border rounded-md px-3">
            <AccordionTrigger className="h3-secondary">
              Individuals with legacy systems needing floppy disk access.
            </AccordionTrigger>
            <AccordionContent className="h5-20px-regular leading-8">
              Perfect for those maintaining or repairing old systems still
              dependent on floppy media.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5" className="border rounded-md px-3">
            <AccordionTrigger className="h3-secondary">
              Collectors of vintage technology requiring data retrieval.
            </AccordionTrigger>
            <AccordionContent className="h5-20px-regular leading-8">
              Enthusiasts and collectors benefit by accessing and preserving
              historical data stored on floppy disks.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q6" className="border rounded-md px-3">
            <AccordionTrigger className="h3-secondary">
              Students studying computer history and technology evolution.
            </AccordionTrigger>
            <AccordionContent className="h5-20px-regular leading-8">
              Educational institutions and students can explore how early data
              storage shaped computing.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default ProductFAQs;
