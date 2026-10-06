import type { BannerPlacement } from "@/lib/api/banners";
import { prepareBanner } from "@/lib/bannerStyles";

interface BannerHtmlProps {
  html: string;
  placement: BannerPlacement;
}

// Server component: sanitizes the banner and builds the CSS it needs (Tailwind
// classes, pasted <style>/<link> stylesheets, Font Awesome) scoped to this
// banner only, so it's in the initial HTML instead of popping in after hydration.
export default async function BannerHtml({ html, placement }: BannerHtmlProps) {
  const banner = await prepareBanner(html).catch(() => null);

  if (!banner?.html.trim()) return null;
  return (
    <>
      {banner.css && (
        // React hoists this into <head> and de-duplicates it by href.
        <style href={`banner-${banner.scopeId}`} precedence="default">
          {banner.css}
        </style>
      )}
      <section
        aria-label={`${placement} banner`}
        data-banner={banner.scopeId}
        className="banner-html w-full overflow-hidden"
        dangerouslySetInnerHTML={{ __html: banner.html.trim() }}
      />
    </>
  );
}
