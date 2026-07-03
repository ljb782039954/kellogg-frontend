import type { Translation } from "@/cms/types";
import type {
  BrandValuesContent,
  CategoriesContent,
  CarouselContent,
  CountdownContent,
  CtaBannerContent,
  FAQContent,
  FeatureListContent,
  FeaturedProductsContent,
  GalleryContent,
  ImageBannerContent,
  ImageBannerTagContent,
  ImageFullContent,
  ImageTextContent,
  NewArrivalsContent,
  PartnerLogosContent,
  ProductGridContent,
  StatisticsContent,
  TestimonialsContent,
  TextSectionContent,
  VideoSectionContent,
} from "../block-adapters";

export interface BlockContentMap {
  carousel: CarouselContent;
  categories: CategoriesContent;
  newArrivals: NewArrivalsContent;
  featuredProducts: FeaturedProductsContent;
  productGrid: ProductGridContent;
  brandValues: BrandValuesContent;
  statistics: StatisticsContent;
  testimonials: TestimonialsContent;
  faq: FAQContent;
  textSection: TextSectionContent;
  imageFull: ImageFullContent;
  inquiry: Record<string, never>;
  imageBanner: ImageBannerContent;
  imageBannerTag: ImageBannerTagContent;
  videoSection: VideoSectionContent;
  imageText: ImageTextContent;
  ctaBanner: CtaBannerContent;
  countdown: CountdownContent;
  partnerLogos: PartnerLogosContent;
  gallery: GalleryContent;
  featureList: FeatureListContent;
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
