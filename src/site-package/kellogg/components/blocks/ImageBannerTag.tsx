import ImageBannerTagView, { type ImageBannerTagViewProps } from "../ui-blocks/ImageBannerTagView";

export type ImageBannerTagProps = ImageBannerTagViewProps;

export default function ImageBannerTag(props: ImageBannerTagProps) {
  return <ImageBannerTagView {...props} />;
}
