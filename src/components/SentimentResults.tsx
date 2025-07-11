import React from 'react';
import { NewsAnalysis } from '../types';
import SentimentIcon from './SentimentIcon';
import NewsCard from './NewsCard';
import Card from './ui/Card';

interface SentimentResultsProps {
  analysis: NewsAnalysis;
  showTitle?: boolean;
}

const SentimentResults: React.FC<SentimentResultsProps> = ({ analysis, showTitle = true }) => {
  const parsePercentage = (percentageString: string) => {
    if (!percentageString) return 0;
    return parseFloat(percentageString.replace('%', '')) || 0;
  };

  const getSentimentData = () => [
    {
      type: 'positive' as const,
      label: 'Positivas',
      percentage: parsePercentage(analysis.porcentaje?.positivas || '0%'),
      news: analysis.top_positivas || [],
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      type: 'negative' as const,
      label: 'Negativas',
      percentage: parsePercentage(analysis.porcentaje?.negativas || '0%'),
      news: analysis.top_negativas || [],
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      type: 'neutral' as const,
      label: 'Neutras',
      percentage: parsePercentage(analysis.porcentaje?.neutras || '0%'),
      news: analysis.top_neutras || [],
      color: 'text-slate-600',
      bgColor: 'bg-slate-100'
    }
  ];

  const getTotalNews = () => {
    return analysis.total_analizadas || analysis.total || 0;
  };

  // Validación de datos del análisis
  if (!analysis) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No hay datos de análisis disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {showTitle && (
        <Card>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Análisis de "{analysis.keyword || 'Sin palabra clave'}"
            </h2>
            <p className="text-slate-600">
              {getTotalNews()} noticias analizadas - {analysis.date || 'Fecha no disponible'}
            </p>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {getSentimentData().map((sentiment) => (
          <Card key={sentiment.type} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${sentiment.bgColor} mb-3`}>
              <SentimentIcon sentiment={sentiment.type} className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-slate-700 mb-1">
              {sentiment.label}
            </h3>
            <p className={`text-2xl font-bold ${sentiment.color}`}>
              {sentiment.percentage.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {sentiment.news.length} noticias
            </p>
          </Card>
        ))}
      </div>

      {/* Detailed News Lists */}
      <div className="space-y-8">
        {getSentimentData().map((sentiment) => (
          sentiment.news.length > 0 && (
            <div key={sentiment.type}>
              <div className="flex items-center space-x-2 mb-4">
                <SentimentIcon sentiment={sentiment.type} className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Top 5 Noticias {sentiment.label}
                </h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sentiment.news.slice(0, 5).map((news, index) => (
                  <NewsCard 
                    key={index} 
                    news={news} 
                    rank={index + 1}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default SentimentResults;