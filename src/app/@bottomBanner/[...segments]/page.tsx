import RouteBanner from "@/app/components/StoreBanner/RouteBanner";

export default async function BottomBanner({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;

  return <RouteBanner segments={segments} placement="bottom" />;
}
