import React, { useEffect, useState } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { useNewsApi } from '../hooks/useNewsApi';
import { NewsAnalysis } from '../types';
import Card from './ui/Card';
import Modal from './ui/Modal';
import SentimentIcon from './SentimentIcon';
import SentimentResults from './SentimentResults';

const PreviousAnalyses: React.FC = () => {
  const { state } = useNews();
  const { fetchPreviousAnalyses } = useNewsApi();
  const [selectedAnalysis, setSelectedAnalysis] = useState<NewsAnalysis | null>(null);

  useEffect(() => {
    fetchPreviousAnalyses();
  }, [fetchPreviousAnalyses]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDominantSentiment = (analysis: NewsAnalysis) => {
    const parsePercentage = (value?: string) => {
      if (!value) return 0;
      return parseFloat(value.replace('%', '')) || 0;
    };
    
    const sentiments = [
      { type: 'positive' as const, percentage: parsePercentage(analysis.porcentaje?.positivas) },
      { type: 'negative' as const, percentage: parsePercentage(analysis.porcentaje?.negativas) },
      { type: 'neutral' as const, percentage: parsePercentage(analysis.porcentaje?.neutras) }
    ];
    
    return sentiments.reduce((max, current) => 
      current.percentage > max.percentage ? current : max
    );
  };

  const handleAnalysisClick = (analysis: NewsAnalysis) => {
    setSelectedAnalysis(analysis);
  };

  const handleCloseModal = () => {
    setSelectedAnalysis(null);
  };

  if (state.previousAnalyses.length === 0) {
    return (
      <Card title="Análisis Previos">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No hay análisis previos disponibles</p>
        </div>
      </Card>
    );
  }

const parsePercentage = (value?: string) => {
  if (!value) return 0;
  return parseFloat(value.replace('%', '')) || 0;
};

  return (
    <Card title="Análisis Previos">
      <div className="space-y-3">
        {state.previousAnalyses.map((analysis) => {
          const dominantSentiment = getDominantSentiment(analysis);
          
          return (
            <div 
              key={analysis._id} 
              className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => handleAnalysisClick(analysis)}
            >
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <SentimentIcon sentiment={dominantSentiment.type} className="w-4 h-4" />
                    <h4 className="font-medium text-slate-800">
                      {analysis.keyword}
                    </h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      Hoy
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{analysis.total_analizadas || analysis.total || 0} noticias</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(analysis.createdAt)}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs">
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Positivo: {analysis.porcentaje?.positivas || '0%'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Negativo: {analysis.porcentaje?.negativas || '0%'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <span>Neutro: {analysis.porcentaje?.neutras || '0%'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for detailed analysis */}
      <Modal
        isOpen={!!selectedAnalysis}
        onClose={handleCloseModal}
        title={`Análisis detallado: ${selectedAnalysis?.keyword}`}
      >
        {selectedAnalysis && (
          <div className="p-6">
            <SentimentResults analysis={selectedAnalysis} showTitle={false} />
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default PreviousAnalyses;