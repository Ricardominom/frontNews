import React from 'react';
import { useNews } from '../context/NewsContext';
import AnalysisForm from '../components/AnalysisForm';
import SentimentResults from '../components/SentimentResults';

const HomePage: React.FC = () => {
  const { state } = useNews();

  return (
    <div className="space-y-8">
      {/* Analysis Form */}
      <div className="max-w-2xl mx-auto">
        <AnalysisForm />
      </div>

      {/* Results */}
      {state.currentAnalysis && (
        <div className="animate-fade-in">
          <SentimentResults 
            analysis={state.currentAnalysis} 
            searchData={state.currentSearchData}
            showTitle={true} 
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;