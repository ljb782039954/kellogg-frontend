import type { Language, Translation } from "../../types";
import { createTranslate } from "../../../../core/lib/i18n";
import OptimizedImage from "../../../../core/components/OptimizedImage";
import RichText from "../../../../core/components/RichText";

export interface ImageTextProps {
  title?: Translation;
  content?: Translation;
  image?: string;
  imagePosition?: "left" | "right";
  buttonText?: Translation;
  buttonLink?: string;
  lang: Language;
}

export default function ImageText({ title, content, image, imagePosition = "left", buttonText, buttonLink, lang }: ImageTextProps) {
  const t = createTranslate(lang);
  const isInternal = buttonLink?.startsWith("/");

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] items-center gap-8 md:gap-12 px-4 ${imagePosition === "right" ? "md:[&>*:first-child]:order-2" : ""}`}>
          <div className="flex-1 w-full">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <OptimizedImage src={image} alt={title ? t(title) : "Section Image"} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            {title && <h3 className="text-2xl md:text-4xl font-bold">{t(title)}</h3>}
            {content && <RichText value={t(content)} className="text-gray-600 text-md md:text-lg leading-relaxed content-rich-text" />}
            {buttonText && buttonLink && (
              <a href={buttonLink} target={isInternal ? undefined : "_blank"} rel={isInternal ? undefined : "noopener noreferrer"} className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                {t(buttonText)}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
