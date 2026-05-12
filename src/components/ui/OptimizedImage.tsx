import React, { useMemo } from 'react';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null | undefined;
  width?: number;
  height?: number;
  priority?: boolean;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  width = 768,
  height,
  priority = false,
  responsive,
  className,
  alt = '',
  sizes: propSizes,
  ...props
}) => {
  const imageUrl = useMemo(() => {
    if (!src) return '';
    return api.getOptimizedImageUrl(src, width);
  }, [src, width]);

  const srcSet = useMemo(() => {
    if (!src) return undefined;

    if (responsive) {
      const widths = [
        responsive.sm, 
        responsive.md, 
        responsive.lg, 
        responsive.xl
      ].filter((w): w is number => !!w);

      if (widths.length > 0) {
        return widths
          .sort((a, b) => a - b)
          .map(w => `${api.getOptimizedImageUrl(src, w)} ${w}w`)
          .join(', ');
      }
    }

    const defaultWidths = [320, 480, 768, 1024, 1200, 1600];
    return defaultWidths
      .map(w => `${api.getOptimizedImageUrl(src, w)} ${w}w`)
      .join(', ');
  }, [src, responsive]);

  const sizes = useMemo(() => {
    if (propSizes) return propSizes;
    if (!responsive) return '(max-width: 768px) 100vw, 1200px';

    const parts = [];
    if (responsive.xl) parts.push(`(min-width: 1280px) ${responsive.xl}px`);
    if (responsive.lg) parts.push(`(min-width: 1024px) ${responsive.lg}px`);
    if (responsive.md) parts.push(`(min-width: 768px) ${responsive.md}px`);
    if (responsive.sm) parts.push(`(min-width: 640px) ${responsive.sm}px`);
    
    parts.push(`${width}px`);
    return parts.join(', ');
  }, [responsive, width, propSizes]);

  if (!src) {
    return (
      <div 
        className={cn("bg-gray-100 animate-pulse rounded-lg", className)} 
        style={{ width: width || '100%', height: height || '100%' }} 
      />
    );
  }

  return (
    <img
      src={imageUrl}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn("transition-opacity duration-300", className)}
      onLoad={(e) => {
        (e.currentTarget as HTMLImageElement).style.opacity = '1';
      }}
      style={{ opacity: 0, ...props.style }}
      {...props}
    />
  );
};

export default OptimizedImage;
