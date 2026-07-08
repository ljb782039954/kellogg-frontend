import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language } from "@/cms/types";
import type { LilianImageItem } from "../../types/common";
import { createTranslate } from "../../utils/i18n";

export interface MasonryGalleryImageProps {
  image: string;
  imageAlt?: string;
  caption?: string;
  heightClass?: string;
}

export interface MasonryGalleryImageContent extends LilianImageItem {
  heightClass?: string;
}

export interface MasonryGalleryContent {
  images: MasonryGalleryImageContent[];
}

export interface MasonryGalleryProps {
  content?: MasonryGalleryContent;
  lang?: Language;
  images?: MasonryGalleryImageProps[];
}

export default function MasonryGallery({ content, lang = "en", images = [] }: MasonryGalleryProps) {
  const translate = createTranslate(lang);
  const resolvedImages = content
    ? content.images.map((item) => ({
        image: item.image,
        imageAlt: translate(item.imageAlt),
        caption: translate(item.caption),
        heightClass: item.heightClass,
      }))
    : images;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="columns-2 md:columns-3 gap-3">
        {resolvedImages.map((item, index) => (
          <div
            key={`${item.image}-${index}`}
            className={`${item.heightClass || "h-72"} overflow-hidden rounded-sm mb-3 break-inside-avoid`}
          >
            <OptimizedImage
              src={item.image}
              alt={item.imageAlt || item.caption || ""}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 400px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}


