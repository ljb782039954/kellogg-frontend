// import type { Category, Language, Product } from "@/cms/types";
// import FeaturedProducts, { type FeaturedProductsContent } from "../blocks/FeaturedProducts";

// export interface FeaturedProductsContainerProps extends FeaturedProductsContent {
//   initialProducts?: Product[];
//   products?: Product[];
//   categories?: Category[];
//   lang: Language;
// }

// export default function FeaturedProductsContainer({
//   initialProducts = [],
//   products: providedProducts,
//   categories = [],
//   lang,
//   ...content
// }: FeaturedProductsContainerProps) {
//   const products = providedProducts || initialProducts;

//   return (
//     <FeaturedProducts
//       content={content}
//       products={products}
//       categories={categories}
//       lang={lang}
//     />
//   );
// }
