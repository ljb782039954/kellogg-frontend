import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Loader2 } from 'lucide-react';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import TawkChat from './components/tawkChat';

// Pages
import DynamicPage from './pages/DynamicPage';
import ProductDetail from './pages/ProductDetail';
import Inquiry from './pages/Inquiry';

function AppRoutes() {
  const { content } = useContent();

  return (
    <>
      <Header theme="light" />
      <TawkChat />
      <div className="mt-16 md:mt-20">
        <Routes>
          {/* Dynamic Pages defined in config */}
          {content!.pages.map((page) => (
            <Route
              key={page.id}
              path={page.path}
              element={
                page.id === 'system-inquiry' ? (
                  <Inquiry />
                ) : (
                  <DynamicPage page={page} />
                )
              }
            />
          ))}

          {/* Fixed Dynamic Route for relational Models */}
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer theme="light" />
    </>
  );
}

function AppContent() {
  const { content, isLoading, error } = useContent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
        加载失败，请刷新重试 (Error loading content)
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ContentProvider>
        <CurrencyProvider>
          <AppContent />
        </CurrencyProvider>
      </ContentProvider>
    </LanguageProvider>
  );
}

export default App;
