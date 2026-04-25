// import React from 'react';
import type { CustomPage } from '../types';
import { useLanguage } from '../context/LanguageContext';
import DynamicPageRenderer from '../components/DynamicRenderer/DynamicPageRenderer';
import SEOManager from '../components/seo/SEOManager';

interface DynamicPageProps {
  page: CustomPage;
}

export default function DynamicPage({ page }: DynamicPageProps) {
  const { language } = useLanguage();

  const defaultTitle = page.seo?.title?.[language as 'zh' | 'en'] || page.title[language as 'zh' | 'en'];
  const defaultDescription = page.seo?.description?.[language as 'zh' | 'en'] || '';

  return (
    <main className="min-h-screen">
      <SEOManager
        pagePath={page.path}
        seoData={page.seo}
        fallbackTitle={page.title[language as 'zh' | 'en']}
        language={language as 'zh' | 'en'}
      />
      <DynamicPageRenderer language={language} schema={page} theme="light" />
    </main>
  );
}
