import type {
  BlogGridContent,
  ProductGridContent,
} from "../block-adapters";

export interface ProductCardContent {
  productId?: number;
}

export interface InquiryContent {}
import type { CategoriesContent } from "../components/blocks/Categories";
export type { CategoriesContent };

import type { FeaturedProductsContent } from "../components/blocks/FeaturedProducts";
import type { NewArrivalsContent } from "../components/blocks/NewArrivals";
export type { FeaturedProductsContent, NewArrivalsContent };
import type { BeforeAfterSliderContent } from "../components/blocks/BeforeAfterSlider";
import type { BrochureDownloadContent } from "../components/blocks/BrochureDownload";
import type { BrandManifestoContent } from "../components/blocks/BrandManifesto";
import type { Categories2Content } from "../components/blocks/Categories2";
import type { CertificationBadgesContent } from "../components/blocks/CertificationBadges";
import type { FaqAccordionContent } from "../components/blocks/FaqAccordion";
import type { FeatureListContent } from "../components/blocks/FeatureList";
import type { FullWidthBannerContent } from "../components/blocks/FullWidthBanner";
import type { FullscreenImageBackgroundContent } from "../components/blocks/FullscreenImageBackground";
import type { VideoPopupContent } from "../components/blocks/FullscreenVideoPopup";
import type { ImageCarouselContent } from "../components/blocks/ImageCarousel";
import type { ImagePairGridContent } from "../components/blocks/ImagePairGrid";
import type { ImageTextSplitContent } from "../components/blocks/ImageTextSplit";
import type { LightboxGalleryContent } from "../components/blocks/LightboxGallery";
import type { MainHeadingContent } from "../components/blocks/MainHeading";
import type { MasonryGalleryContent } from "../components/blocks/MasonryGallery";
import type { NumberCounterContent } from "../components/blocks/NumberCounter";
import type { ParallaxImageContent } from "../components/blocks/ParallaxImage";
import type { RichTextBlockContent } from "../components/blocks/RichTextBlock";
import type { TextGridContent } from "../components/blocks/TextGrid";
import type { TestimonialMasonryContent } from "../components/blocks/TestimonialMasonry";
import type { VideoGridContent } from "../components/blocks/VideoGrid";

export interface BlockContentMap {
  productCard: ProductCardContent;
  categories: CategoriesContent;
  newArrivals: NewArrivalsContent;
  featuredProducts: FeaturedProductsContent;
  productGrid: ProductGridContent;
  featureList: FeatureListContent;
  inquiry: InquiryContent;
  blogGrid: BlogGridContent;
  imagePairGrid: ImagePairGridContent;
  masonryGallery: MasonryGalleryContent;
  imageCarousel: ImageCarouselContent;
  fullWidthBanner: FullWidthBannerContent;
  imageTextSplit: ImageTextSplitContent;
  categories2: Categories2Content;
  parallaxImage: ParallaxImageContent;
  beforeAfterSlider: BeforeAfterSliderContent;
  lightboxGallery: LightboxGalleryContent;
  fullscreenImageBackground: FullscreenImageBackgroundContent;
  videoGrid: VideoGridContent;
  fullscreenVideoPopup: VideoPopupContent;
  brandManifesto: BrandManifestoContent;
  numberCounter: NumberCounterContent;
  testimonialMasonry: TestimonialMasonryContent;
  faqAccordion: FaqAccordionContent;
  certificationBadges: CertificationBadgesContent;
  brochureDownload: BrochureDownloadContent;
  mainHeading: MainHeadingContent;
  richTextBlock: RichTextBlockContent;
  textGrid: TextGridContent;
}

export type BlockType = keyof BlockContentMap;
