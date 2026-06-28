import type { CtaBannerViewProps } from "../ui-blocks/CtaBannerView";
import CtaBannerView from "../ui-blocks/CtaBannerView";

export type CtaBannerProps = CtaBannerViewProps;

export default function CtaBanner(props: CtaBannerProps) {
  return <CtaBannerView {...props} />;
}
