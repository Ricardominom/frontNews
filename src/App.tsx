import React, { useEffect } from 'react';
import { NewsProvider } from './context/NewsContext';
import { useNews } from './context/NewsContext';
import Header from './components/Header';
import AnalysisForm from './components/AnalysisForm';
import SentimentResults from './components/SentimentResults';
import PreviousAnalyses from './components/PreviousAnalyses';

const AppContent: React.FC = () => {
  const { state, fetchPreviousAnalyses } = useNews();

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
        <div className="space-y-8">
          {/* Analysis Form */}
          <div className="max-w-2xl mx-auto">
            <AnalysisForm />
          </div>

          {/* Results */}
          {state.currentAnalysis && (
            <div className="animate-fade-in">
              <SentimentResults analysis={state.currentAnalysis} />
            </div>
          )}

          {/* Previous Analyses */}
          <div className="max-w-4xl mx-auto">
            <PreviousAnalyses />
          </div>
        </div>
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