import type { FeaturedProductsContent } from "../components/blocks/FeaturedProducts";
import type { NewArrivalsContent } from "../components/blocks/NewArrivals";
import type { ProductGridContent } from "../components/blocks/ProductGrid";

export type { FeaturedProductsContent, NewArrivalsContent, ProductGridContent };

// Import component content types and props directly
import type { BrandValuesProps } from "../components/blocks/BrandValues";
import type { CarouselContent } from "../components/blocks/Carousel";
import type { CategoriesContent } from "../components/blocks/Categories";
import type { CtaBannerContent } from "../components/blocks/CtaBanner";
import type { FAQContent } from "../components/blocks/FAQ";
import type { FeatureListContent } from "../components/blocks/FeatureList";
import type { GalleryContent } from "../components/blocks/Gallery";
import type { ImageBannerContent } from "../components/blocks/ImageBanner";
import type { ImageBannerTagContent } from "../components/blocks/ImageBannerTag";
import type { ImageFullContent } from "../components/blocks/ImageFull";
import type { ImageTextContent } from "../components/blocks/ImageText";
import type { PartnerLogosContent } from "../components/blocks/PartnerLogos";
import type { StatisticsContent } from "../components/blocks/Statistics";
import type { TestimonialsContent } from "../components/blocks/Testimonials";
import type { TextSectionContent } from "../components/blocks/TextSection";
import type { VideoSectionContent } from "../components/blocks/VideoSection";

// TODO Countdown Content 这个组件已经移除了，并不需要
// export interface CountdownContent {
//   targetDate?: string;
// }

export interface BlockContentMap {
  brandValues: Omit<BrandValuesProps, "lang">;
  carousel: CarouselContent;
  categories: CategoriesContent;
  ctaBanner: CtaBannerContent;
  faq: FAQContent;
  featureList: FeatureListContent;
  gallery: GalleryContent;
  imageBanner: ImageBannerContent;
  imageBannerTag: ImageBannerTagContent;
  imageFull: ImageFullContent;
  imageText: ImageTextContent;
  partnerLogos: PartnerLogosContent;
  statistics: StatisticsContent;
  testimonials: TestimonialsContent;
  textSection: TextSectionContent;
  videoSection: VideoSectionContent;
  
  newArrivals: NewArrivalsContent;
  featuredProducts: FeaturedProductsContent;
  productGrid: ProductGridContent;
  inquiry: Record<string, never>;
}

export type BlockType = keyof BlockContentMap;
