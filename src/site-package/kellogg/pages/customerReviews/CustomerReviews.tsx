import OptimizedImage from "@/core/components/OptimizedImage";

export type CustomerReviewMedia =
  | { kind: "embed"; url: string; title: string }
  | { kind: "video"; url: string; title: string }
  | { kind: "image"; url: string; alt: string }
  | null;

export interface CustomerReviewViewItem {
  id: string;
  clientName: string;
  country?: string;
  rating: number;
  ratingText: string;
  fullStars: number;
  media: CustomerReviewMedia;
  reviewHtml: string;
}

export interface CustomerReviewsProps {
  items?: CustomerReviewViewItem[];
  emptyTitle: string;
  emptyDescription: string;
  noMediaText?: string;
}

export default function CustomerReviews({
  items = [],
  emptyTitle,
  emptyDescription,
  noMediaText = "No media",
}: CustomerReviewsProps) {
  if (items.length === 0) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-24 text-center text-gray-400">
        <p className="text-lg font-medium">{emptyTitle}</p>
        <p className="text-sm mt-1">{emptyDescription}</p>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 space-y-14">
      {items.map((review) => {
        return (
          <article key={review.id} className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-[48%] flex-shrink-0 p-5 md:p-6">
                {review.media?.kind === "embed" ? (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-black">
                    <iframe className="w-full h-full" src={review.media.url} title={review.media.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
                  </div>
                ) : review.media?.kind === "video" ? (
                  <video className="w-full aspect-video rounded-2xl bg-black" src={review.media.url} controls preload="metadata" />
                ) : review.media?.kind === "image" ? (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md">
                    <OptimizedImage src={review.media.url} alt={review.media.alt} width={800} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">{noMediaText}</div>
                )}
              </div>
              <div className="w-full md:w-[52%] flex flex-col justify-center px-5 pb-7 pt-2 md:pt-7 md:pr-8 md:pl-2">
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight leading-snug">{review.clientName}</h3>
                {review.country && <p className="text-sm text-gray-400 mt-1">{review.country}</p>}
                <div className="flex items-center gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span key={starIndex} className={starIndex < review.fullStars ? "text-yellow-400" : "text-gray-200"}>★</span>
                  ))}
                  <span className="text-sm text-gray-400 ml-1">{review.ratingText}</span>
                </div>
                <div className="mt-4 text-gray-600 leading-relaxed text-[15px]" dangerouslySetInnerHTML={{ __html: review.reviewHtml }} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
