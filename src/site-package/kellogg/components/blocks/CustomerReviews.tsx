import type { Language } from "../../types";
import OptimizedImage from "../../../../core/components/OptimizedImage";
import { sanitizeCmsHtml } from "../../../../core/lib/contentSecurity";
import { getSafeVideoSource } from "../../../../core/lib/video";

export interface CustomerReview {
  id?: number | string;
  client_name: string;
  country?: string;
  rating: number;
  media_type?: string;
  media_url?: string;
  review_text_zh?: string;
  review_text_en?: string;
}

export interface CustomerReviewsProps {
  lang: Language;
  reviews?: CustomerReview[];
}

export default function CustomerReviews({ lang, reviews = [] }: CustomerReviewsProps) {
  if (reviews.length === 0) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-24 text-center text-gray-400">
        <p className="text-lg font-medium">{lang === "zh" ? "暂无评价内容" : "No customer reviews yet"}</p>
        <p className="text-sm mt-1">{lang === "zh" ? "敬请期待客户真实反馈" : "Customer reviews coming soon"}</p>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 space-y-14">
      {reviews.map((review, index) => {
        const videoSource = review.media_type === "video" && review.media_url
          ? getSafeVideoSource(review.media_url, import.meta.env.PUBLIC_API_ASSETS)
          : null;
        const reviewText = lang === "zh" ? review.review_text_zh : review.review_text_en;
        const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));
        const fullStars = Math.floor(rating);

        return (
          <article key={review.id || `${review.client_name}-${index}`} className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-[48%] flex-shrink-0 p-5 md:p-6">
                {videoSource?.kind === "embed" ? (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-black">
                    <iframe className="w-full h-full" src={videoSource.url} title={`Review by ${review.client_name}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
                  </div>
                ) : videoSource?.kind === "video" ? (
                  <video className="w-full aspect-video rounded-2xl bg-black" src={videoSource.url} controls preload="metadata" />
                ) : review.media_url ? (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md">
                    <OptimizedImage src={review.media_url} alt={`${review.client_name} review`} width={800} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">No media</div>
                )}
              </div>
              <div className="w-full md:w-[52%] flex flex-col justify-center px-5 pb-7 pt-2 md:pt-7 md:pr-8 md:pl-2">
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight leading-snug">{review.client_name}</h3>
                {review.country && <p className="text-sm text-gray-400 mt-1">{review.country}</p>}
                <div className="flex items-center gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span key={starIndex} className={starIndex < fullStars ? "text-yellow-400" : "text-gray-200"}>★</span>
                  ))}
                  <span className="text-sm text-gray-400 ml-1">{rating.toFixed(1)}</span>
                </div>
                <div className="mt-4 text-gray-600 leading-relaxed text-[15px]" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(reviewText || "") }} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
