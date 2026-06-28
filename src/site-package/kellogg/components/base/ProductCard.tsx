import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { $currency, $rates, formatPrice } from '@core/lib/currency';
import { toProductCardStaticProps } from '../../block-adapters/productCardAdapter';
import type { Product, Language } from '../../types';
import ProductCardStatic from './ProductCardStatic';

interface ProductCardProps {
  product: Product;
  index?: number;
  lang: Language;
  variant?: "standard" | "arrival";
}

export default function ProductCard({ product, index = 0, lang, variant = "standard" }: ProductCardProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const currency = useStore($currency);
  const rates = useStore($rates);

  useEffect(() => setHasMounted(true), []);

  const card = toProductCardStaticProps(product, {
    lang,
    variant,
    formatPriceText: (price) => hasMounted
      ? formatPrice(price, currency, rates)
      : formatPrice(price),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="h-full">
      <ProductCardStatic {...card} />
    </motion.div>
  );
}
