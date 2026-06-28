import type { Translation } from "./common";
import type { ImageBannerTagContent } from "../block-schemas/imageBannerTag";
import type { ProductGridContent } from "../block-schemas/productGrid";
import type { BrandValuesProps } from "../components/blocks/BrandValues";
import type { CarouselProps } from "../components/blocks/Carousel";
import type { CategoriesProps } from "../components/blocks/Categories";
import type { CountdownProps } from "../components/blocks/Countdown";
import type { CtaBannerProps } from "../components/blocks/CtaBanner";
import type { FAQProps } from "../components/blocks/FAQ";
import type { FeaturedProductsProps } from "../components/blocks/FeaturedProducts";
import type { FeatureListProps } from "../components/blocks/FeatureList";
import type { GalleryProps } from "../components/blocks/Gallery";
import type { ImageBannerProps } from "../components/blocks/ImageBanner";
import type { ImageFullProps } from "../components/blocks/ImageFull";
import type { ImageTextProps } from "../components/blocks/ImageText";
import type { NewArrivalsProps } from "../components/blocks/NewArrivals";
import type { PartnerLogosProps } from "../components/blocks/PartnerLogos";
import type { StatisticProps } from "../components/blocks/Statistics";
import type { TestimonialsProps } from "../components/blocks/Testimonials";
import type { TextSectionProps } from "../components/blocks/TextSection";
import type { VideoSectionProps } from "../components/blocks/VideoSection";

type WithoutLang<T> = Omit<T, "lang">;

export interface BlockContentMap {
  carousel: WithoutLang<CarouselProps>;
  categories: Omit<CategoriesProps, "lang" | "categories">;
  caseStudies: Record<string, never>;
  newArrivals: Omit<NewArrivalsProps, "lang" | "products">;
  featuredProducts: Omit<FeaturedProductsProps, "lang" | "products" | "initialProducts">;
  productGrid: ProductGridContent;
  brandValues: WithoutLang<BrandValuesProps>;
  statistics: WithoutLang<StatisticProps>;
  testimonials: WithoutLang<TestimonialsProps>;
  faq: WithoutLang<FAQProps>;
  textSection: WithoutLang<TextSectionProps>;
  imageFull: WithoutLang<ImageFullProps>;
  inquiry: Record<string, never>;
  imageBanner: WithoutLang<ImageBannerProps>;
  imageBannerTag: ImageBannerTagContent;
  videoSection: WithoutLang<VideoSectionProps>;
  imageText: WithoutLang<ImageTextProps>;
  ctaBanner: WithoutLang<CtaBannerProps>;
  countdown: WithoutLang<CountdownProps>;
  partnerLogos: WithoutLang<PartnerLogosProps>;
  gallery: WithoutLang<GalleryProps>;
  featureList: WithoutLang<FeatureListProps>;
}

export type BlockType = keyof BlockContentMap;
export type ComponentCategory = "product" | "marketing" | "content" | "media";

export interface ComponentMeta<T extends BlockType = BlockType> {
  type: T;
  name: Translation;
  description: Translation;
  icon: string;
  category: ComponentCategory;
  hasGlobalData: boolean;
  singleton?: boolean;
  defaultProps: Partial<BlockContentMap[T]>;
}

export type PageBlock = {
  [T in BlockType]: {
    id: string;
    type: T;
    content: BlockContentMap[T];
    isVisible: boolean;
  };
}[BlockType];

export interface CustomPage {
  id: string;
  path: string;
  title: Translation;
  isFixed: boolean;
  type?: "fixed-block" | "dynamic-block" | "fixed-layout";
  content?: unknown;
  blocks: PageBlock[];
  seo?: {
    title: Translation;
    description: Translation;
    keywords?: Translation;
    targetCountry?: string;
  };
}
