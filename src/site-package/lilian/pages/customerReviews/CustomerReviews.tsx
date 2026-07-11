import { useState } from "react";
import OptimizedImage from "@/runtime/components/OptimizedImage";
import { Pagination } from "../../components/base";
// import type { Language, Translation } from "@/cms/types";
// import { createTranslate } from "../../utils/i18n";

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
  itemsPerPage?: number;
  totalText?: string;
}

export default function CustomerReviews({
  items = [],
  emptyTitle,
  emptyDescription,
  noMediaText = "No media",
  itemsPerPage = 20,
  totalText,
}: CustomerReviewsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <p className="font-luxury-heading text-2xl font-light text-ink-strong">{emptyTitle}</p>
        <p className="mt-2 text-sm text-body">{emptyDescription}</p>
      </section>
    );
  }

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const pageItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="mx-auto max-w-6xl space-y-10 px-6 py-12">
      {pageItems.map((review) => {
        return (
          <article key={review.id} className="overflow-hidden rounded-md border border-border bg-surface">
            <div className="grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="bg-page p-5 md:p-6">
                {review.media?.kind === "embed" ? (
                  <div className="w-full aspect-video overflow-hidden rounded-md bg-black">
                    <iframe className="w-full h-full" src={review.media.url} title={review.media.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
                  </div>
                ) : review.media?.kind === "video" ? (
                  <video className="w-full aspect-video rounded-md bg-black" src={review.media.url} controls preload="metadata" />
                ) : review.media?.kind === "image" ? (
                  <div className="w-full aspect-video overflow-hidden rounded-md bg-media">
                    <OptimizedImage src={review.media.url} alt={review.media.alt} width={800} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="flex w-full aspect-video items-center justify-center rounded-md bg-media text-sm text-subtle">{noMediaText}</div>
                )}
              </div>
              <div className="flex flex-col justify-center border-t border-border px-6 py-7 md:border-l md:border-t-0 md:px-8">
                <h3 className="font-luxury-heading text-3xl font-light leading-snug text-ink-strong">{review.clientName}</h3>
                {review.country && <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">{review.country}</p>}
                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span key={starIndex} className={starIndex < review.fullStars ? "text-rating" : "text-border"}>★</span>
                  ))}
                  <span className="ml-2 text-[11px] text-subtle">{review.ratingText}</span>
                </div>
                <div className="mt-5 text-sm leading-7 text-body" dangerouslySetInnerHTML={{ __html: review.reviewHtml }} />
              </div>
            </div>
          </article>
        );
      })}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalCount={items.length}
          totalText={totalText}
        />
      )}
    </section>
  );
}
