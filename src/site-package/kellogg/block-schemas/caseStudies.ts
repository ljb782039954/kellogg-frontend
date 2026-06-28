export type CaseStudiesContent = Record<string, never>;

export interface CustomerReviewRecord {
  id?: number | string;
  client_name: string;
  country?: string;
  rating: number;
  media_type?: string;
  media_url?: string;
  review_text_zh?: string;
  review_text_en?: string;
}
