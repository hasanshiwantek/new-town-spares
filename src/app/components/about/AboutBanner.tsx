"use client";

import React from "react";
import Link from "next/link";
const font3 = "Poppins, sans-serif";

// Live tokens (measured on newtownspares.com/about-us/). The content there is CMS HTML
// where every heading/paragraph is a flat sibling, so their vertical margins COLLAPSE
// against each other. The markup below is kept flat for the same reason — wrapping these
// in divs stops the collapse and doubles the gaps.
const paraClass = "text-[14px] leading-[21px] mt-[8px] mb-[21px]";
const labelClass = "font-bold text-[14px]";

const AboutBanner = () => {
  return (
    <div className="w-full">
      {/* Breadcrumb — live `ul.breadcrumbs`: 13px/19.5 #333, 21px below, hidden under 551.
          Only the "/" separator is spaced (10.5px = live's 7px margin + 3.5px whitespace).
          mt-[9px]: live sits 21px below the header, PageTransition supplies 12px of that. */}
      <div className="hidden min-[551px]:block mt-[9px] mb-[21px] text-[13px] leading-[19.5px] text-[#333333]">
        <Link href="/" className="underline hover:text-[#F15939] transition-colors">
          Home
        </Link>
        <span className="mx-[10.5px]">/</span>
        <span>About Us</span>
      </div>

      {/* flow-root: without a BFC the h1's top margin escapes this wrapper and collapses
          with the breadcrumb's margin-bottom */}
      <div
        className="max-w-[800px] mx-auto flow-root text-[#333333]"
        style={{ fontFamily: font3 }}
      >
        {/* Page Title — live `h1.page-heading`: 28px/33.6, w400, margin 26.25px 0 */}
        {/* Live's headings all carry letter-spacing 0.25px; its body text does not */}
        <h1 className="text-[28px] leading-[33.6px] tracking-[0.25px] text-[#333333] !font-normal my-[26.25px] text-center">
          About Us
        </h1>

        {/* Live: an <h1> at 28px/33.6 (whose strut sets the 33.6 box height) wrapping a
            <strong><span style="font-size:x-large"> → the visible text is 24px/28.8 BOLD.
            CSS keyword sizes are absolute, so x-large == 24px (and `large` == 18px below).
            At 28px this string is ~787px and wraps to 2 lines at 768; at 24px it fits on
            one, like live. `font-medium` (500) would fall back to Poppins 300 and render
            LIGHT — only 600+ synthesizes bold.
            mt-[47.25px] = live's h1 margin-bottom (26.25) + the 21px contributed by the
            empty <p> its CMS emits above this heading. Margins collapse to the LARGER of
            the two, so this has to carry the full 47.25, not just the 21. */}
        <h2 className="text-[28px] leading-[33.6px] tracking-[0.25px] text-center mt-[47.25px] mb-[11px]">
          <span className="text-[24px] leading-[28.8px] !font-bold">
            Welcome to NewTownSpares – Elevate Your Tech Game!
          </span>
        </h2>

        <p className={`${paraClass} !font-normal`}>
          At NewTownSpares, we're committed to provide you one stop solution to all
          your IT hardware requirements keeping the best quality products which makes
          it easier for you to achieve your results. We are the best solution provider,
          whether you're a business professional required to enhance your equipment’s
          efficiency or a tech enthusiast looking to upgrade your machine
        </p>

        {/* Live: an <h2> at 25px/30 (margin 32/0/11) wrapping an 18px/21.6 <strong>. The
            h2's own 25px strut is what makes the box 30px tall even though the visible
            text is 18px — sizing the h2 itself 18px makes the block 8.4px short. */}
        <h2 className="text-[25px] leading-[30px] tracking-[0.25px] mt-[32px] mb-[11px]">
          <span className="text-[18px] leading-[21.6px] !font-bold">
            Why Choose NewTownSpares?
          </span>
        </h2>

        <p className={paraClass}>
          <span className={labelClass}>Premium Quality:</span>{" "}
          To make sure that our inventory meets the highest quality
          standards for which we check our products periodically so
          that you don’t face any technical difficulty with our
          equipment while performing your chores.
        </p>

        <p className={paraClass}>
          <span className={labelClass}>Expert Guidance:</span>{" "}
          While looking for your requirement our expert tech support will
          be there to assist you throughout the process, so that you can
          make the best decision which meets your criteria. Whether you
          are looking to upgrade your machine, setting up a network or
          just looking for an advice, our support team is always available
          for your assistance.
        </p>

        <p className={paraClass}>
          <span className={labelClass}>Competitive Pricing:</span>{" "}
          As we understand that IT hardware is a costly and a long term
          investment. That’s the reason we always offer our customers with
          the best market price on our complete range without compromising
          on the quality. We believe in elevating your tech game within your budget
        </p>

        <p className={paraClass}>
          <span className={labelClass}>Vast Product Range:</span>{" "}
          At your one stop solution, you will be having a complete range
          of IT hardware products, from motherboards to graphic cards,
          storage solutions to peripheral devices. Here we bring your
          dreams into reality.
        </p>

        <p className={paraClass}>
          <span className={labelClass}>Reliable Customer Support:</span>{" "}
          To make your journey memorable with us, our dedicated customer
          support team will continue to provide you with the state of
          the art after sales support. Your satisfaction is what we work for
        </p>

        <p className={paraClass}>
          As your trusted partner in IT hardware solution, we won’t
          leave you alone throughout the process. Take a look at
          our product catalog and for any query or concern with your
          purchase feel free to reach out to us. We are here to make
          your tech experience worth remembering!
        </p>
      </div>
    </div>
  );
};

export default AboutBanner;
