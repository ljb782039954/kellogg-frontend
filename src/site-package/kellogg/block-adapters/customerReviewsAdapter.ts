import type { Language } from "@core/types";
import { sanitizeCmsHtml } from "@core/lib/contentSecurity";
import { getSafeVideoSource } from "@core/lib/video";
import type { CustomerReviewRecord } from "../block-schemas";
import type { CustomerReviewsProps } from "../components/blocks";
import { kelloggSiteConfig } from "../config";

export function toCustomerReviewsViewProps(
  reviews: CustomerReviewRecord[] = [],
  lang: Language,
): CustomerReviewsProps {
  return {
    emptyTitle: lang === "zh" ? "暂无评价内容" : "No customer reviews yet",
    emptyDescription: lang === "zh" ? "敬请期待客户真实反馈" : "Customer reviews coming soon",
    noMediaText: "No media",
    items: reviews.map((review, index) => {
      const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));
      const videoSource = review.media_type === "video" && review.media_url
        ? getSafeVideoSource(review.media_url, {
            assetsBase: kelloggSiteConfig.api.assetsBaseUrl,
            providers: kelloggSiteConfig.security?.videoProviders,
          })
        : null;
      const media = videoSource
        ? {
            kind: videoSource.kind,
            url: videoSource.url,
            title: `Review by ${review.client_name}`,
          }
        : review.media_url
          ? {
              kind: "image" as const,
              url: review.media_url,
              alt: `${review.client_name} review`,
            }
          : null;

      return {
        id: String(review.id || `${review.client_name}-${index}`),
        clientName: review.client_name,
        country: review.country,
        rating,
        ratingText: rating.toFixed(1),
        fullStars: Math.floor(rating),
        media,
        reviewHtml: sanitizeCmsHtml((lang === "zh" ? review.review_text_zh : review.review_text_en) || ""),
      };
    }),
  };
}
