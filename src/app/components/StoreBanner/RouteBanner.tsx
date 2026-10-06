import {
  BannerPlacement,
  fetchBanner,
  resolveBannerRequest,
} from "@/lib/api/banners";
import BannerHtml from "./BannerHtml";

interface RouteBannerProps {
  segments?: string[];
  placement: BannerPlacement;
}

// Server component rendered by the @topBanner/@bottomBanner slots: maps the
// URL to a banner location and renders that location's banner, if any.
export default async function RouteBanner({
  segments,
  placement,
}: RouteBannerProps) {
  try {
    const request = await resolveBannerRequest(segments);
    if (!request) return null;

    const banner = await fetchBanner(request, placement);
    if (!banner?.pageContent) return null;

    return <BannerHtml html={banner.pageContent} placement={placement} />;
  } catch {
    return null;
  }
}
