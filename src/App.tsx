import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import { useNews } from './context/NewsContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PreviousAnalysesPage from './pages/PreviousAnalysesPage';

const AppContent: React.FC = () => {
  const { fetchPreviousAnalyses } = useNews();

  useEffect(() => {
    // Only fetch previous analyses if we're not in development or if explicitly needed
    // This prevents connection errors on initial load when backend might not be running
    const shouldFetchPrevious = import.meta.env.PROD || import.meta.env.VITE_FETCH_ON_LOAD === 'true';
    
    if (shouldFetchPrevious) {
      fetchPreviousAnalyses();
    }
  }, [fetchPreviousAnalyses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analisis-previos" element={<PreviousAnalysesPage />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <NewsProvider>
      <AppContent />
    </NewsProvider>
  );
}

export default App;