import { useEffect } from 'react';
import { SEO_CONFIG } from '../../config/seoConfig';

interface SEOManagerProps {
  pagePath: string;
  seoData?: {
    title?: { zh: string; en: string };
    description?: { zh: string; en: string };
    keywords?: { zh: string; en: string };
    targetCountry?: string;
  };
  fallbackTitle: string;
  language: 'zh' | 'en';
}

/**
 * SEO & GEO 独立管理组件
 * 职责：统一管理所有页面的 Meta 标签、GEO 标签和 JSON-LD
 */
const SEOManager: React.FC<SEOManagerProps> = ({
  pagePath,
  seoData,
  fallbackTitle,
  language
}) => {

  useEffect(() => {
    // 1. 获取本地代码配置作为兜底
    const cleanPath = pagePath.replace(/^\//, '') || '';
    const override = SEO_CONFIG.pageOverrides[cleanPath as keyof typeof SEO_CONFIG.pageOverrides];
    
    // 2. 优先级：后台填写的 SEO > 代码覆盖配置 > 默认标题
    const finalTitle = seoData?.title?.[language] || override?.title[language] || fallbackTitle;
    const finalDesc = seoData?.description?.[language] || override?.description[language] || '';
    const finalKeywords = seoData?.keywords?.[language] || SEO_CONFIG.keywords.join(', ');
    const targetCountry = seoData?.targetCountry || override ? (cleanPath.split('-')[0].toUpperCase()) : 'Worldwide';

    // 2. 更新标题
    document.title = finalTitle;

    // 3. 更新 Meta 辅助函数
    const updateMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 4. 执行 Meta 更新
    updateMeta('description', finalDesc);
    updateMeta('keywords', finalKeywords);

    // GEO 标签
    const geo = SEO_CONFIG.company.address;
    updateMeta('geo.region', geo.region);
    updateMeta('geo.placename', geo.placename);
    updateMeta('geo.position', geo.position);
    updateMeta('ICBM', geo.position.replace(';', ', '));

    // 5. 注入 JSON-LD (结构化数据)
    let scriptTag = document.getElementById('seo-json-ld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WholesaleStore",
      "name": SEO_CONFIG.company.name,
      "description": finalDesc,
      "url": window.location.origin,
      "image": `${window.location.origin}/logo/logo.jpg`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": geo.placename,
        "addressRegion": "Guangdong",
        "addressCountry": geo.country,
        "streetAddress": geo.locality
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": SEO_CONFIG.company.coordinates.latitude,
        "longitude": SEO_CONFIG.company.coordinates.longitude
      },
      "areaServed": targetCountry !== 'Worldwide' 
        ? ["Worldwide", targetCountry] 
        : ["Worldwide", "USA", "Europe", "UK", "Australia"],
      "knowsAbout": ["Heavyweight Hoodies", "Streetwear Manufacturing", "Custom Apparel"]
    };
    scriptTag.text = JSON.stringify(structuredData);

    // 6. Hreflang 注入 (简单实现)
    const updateLinkRel = (rel: string, hreflang: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"][hreflang="${hreflang}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('hreflang', hreflang);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    updateLinkRel('alternate', 'en', `${window.location.origin}/`);
    updateLinkRel('alternate', 'zh', `${window.location.origin}/zh`);

    return () => {
      // 卸载时不需要特别清理，因为这些是全局 header
    };
  }, [pagePath, seoData, fallbackTitle, language]);

  return null; // 不渲染任何 UI
};

export default SEOManager;
