import { useEffect, useState } from "react";
import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Translation, NavLink } from "@/cms/types";
import type { LilianImageItem } from "../../types/common";
import { createTranslate } from "../../utils/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface FullscreenImageCarouselContent extends LilianImageItem {
  title?: Translation;
  subtitle?: Translation; // Used as subheading or description
  buttonText?: Translation;
  link?: NavLink;
}

export interface ImageCarouselContent {
  images: FullscreenImageCarouselContent[];
  autoplay?: boolean;
  interval?: number;
}

export interface ImageCarouselProps {
  content: ImageCarouselContent;
  lang: Language;
}

export default function FullscreenImageCarousel({
  content: { images = [], autoplay = true, interval = 5000 },
  lang = "en",
}: ImageCarouselProps) {
  const t = createTranslate(lang);
  const resolvedAutoplay = autoplay;
  const resolvedInterval = interval;
  const [current, setCurrent] = useState(0);
  const [autoplayKey, setAutoplayKey] = useState(0);

  const resetAutoplayTimer = () => {
    if (resolvedAutoplay) {
      setAutoplayKey((k) => k + 1);
    }
  };

  const handlePrev = () => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
    resetAutoplayTimer();
  };

  const handleNext = () => {
    setCurrent((c) => (c + 1) % images.length);
    resetAutoplayTimer();
  };

  const handleDotClick = (index: number) => {
    setCurrent(index);
    resetAutoplayTimer();
  };

  useEffect(() => {
    if (!resolvedAutoplay || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, resolvedInterval);
    return () => clearInterval(timer);
  }, [resolvedAutoplay, resolvedInterval, images.length, autoplayKey]);

  if (images.length === 0) return null;

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-ink select-none">
      {/* Slides Area */}
      <div className="relative w-full h-full">
        {images.map((item, index) => {
          const resolvedTitle = t(item.title);
          const resolvedSubtitle = t(item.subtitle);
          const resolvedCaption = t(item.caption);
          const buttonHref = item.link?.href;
          const buttonLabel = t(item.buttonText) || t(item.link?.name) || (lang === "zh" ? "了解更多" : "Learn More");

          return (
            <div
              key={`${item.image}-${index}`}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
                index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with slow Ken Burns effect */}
              <div
                className="absolute inset-0 transition-transform ease-out"
                style={{
                  transitionDuration: "8000ms",
                  transform: index === current ? "scale(1.05)" : "scale(1.0)",
                }}
              >
                <OptimizedImage
                  src={item.image}
                  alt={t(item.imageAlt) || resolvedCaption || ""}
                  className="w-full h-full object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20 z-10" />

              {/* Content Text Wrapper (Staggered fade-up entry) */}
              <div className="relative z-20 max-w-4xl mx-auto px-8 text-center text-on-dark flex flex-col items-center justify-center">
                {resolvedSubtitle && (
                  <p
                    className="text-xs md:text-sm tracking-[0.25em] text-on-dark-soft uppercase mb-4 transition-all duration-700 transform"
                    style={{
                      transitionDelay: index === current ? "200ms" : "0ms",
                      transform: index === current ? "translateY(0)" : "translateY(16px)",
                      opacity: index === current ? 1 : 0,
                    }}
                  >
                    {resolvedSubtitle}
                  </p>
                )}

                {resolvedTitle && (
                  <h2
                    className="font-luxury-heading text-4xl md:text-7xl font-light tracking-wide mb-6 leading-tight transition-all duration-700 transform"
                    style={{
                      transitionDelay: index === current ? "400ms" : "0ms",
                      transform: index === current ? "translateY(0)" : "translateY(16px)",
                      opacity: index === current ? 1 : 0,
                    }}
                  >
                    {resolvedTitle}
                  </h2>
                )}

                {resolvedCaption && (
                  <p
                    className="max-w-2xl text-sm md:text-base text-on-dark-soft font-light leading-relaxed mb-8 transition-all duration-700 transform"
                    style={{
                      transitionDelay: index === current ? "600ms" : "0ms",
                      transform: index === current ? "translateY(0)" : "translateY(16px)",
                      opacity: index === current ? 1 : 0,
                    }}
                  >
                    {resolvedCaption}
                  </p>
                )}

                {buttonHref && (
                  <div
                    className="transition-all duration-700 transform"
                    style={{
                      transitionDelay: index === current ? "800ms" : "0ms",
                      transform: index === current ? "translateY(0)" : "translateY(16px)",
                      opacity: index === current ? 1 : 0,
                    }}
                  >
                    <a
                      href={buttonHref}
                      className="inline-flex items-center justify-center px-8 py-3.5 border border-on-dark text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-on-dark bg-transparent hover:bg-on-dark hover:text-ink transition-all duration-300 rounded-sm"
                    >
                      {buttonLabel}
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center border border-on-dark/20 hover:border-on-dark text-on-dark bg-transparent hover:bg-black/20 backdrop-blur-xs rounded-full transition-all duration-300 group cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center border border-on-dark/20 hover:border-on-dark text-on-dark bg-transparent hover:bg-black/20 backdrop-blur-xs rounded-full transition-all duration-300 group cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {/* Progress Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleDotClick(index)}
              className="py-2 px-1 focus:outline-none group cursor-pointer"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`h-[2px] transition-all duration-500 rounded-full ${
                  index === current ? "bg-on-dark w-10" : "bg-on-dark/30 w-6 group-hover:bg-on-dark/60"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
