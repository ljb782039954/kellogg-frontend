import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { $currency, $rates, formatPrice } from '../../../../core/lib/currency';
import type { Product, Language } from '../../types';
import ProductCardStatic from './ProductCardStatic';

interface ProductCardProps {
  product: Product;
  index?: number;
  lang: Language;
}

export default function ProductCard({ product, index = 0, lang }: ProductCardProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const currency = useStore($currency);
  const rates = useStore($rates);
  const bulkPrice = product.bulkPrices?.[0];

  useEffect(() => setHasMounted(true), []);

  const priceText = hasMounted
    ? formatPrice(bulkPrice?.price, currency, rates)
    : formatPrice(bulkPrice?.price);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="h-full">
      <ProductCardStatic product={product} lang={lang} priceText={priceText} />
    </motion.div>
  );
}
