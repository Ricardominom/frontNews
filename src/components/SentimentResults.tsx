import React from 'react';
import { NewsAnalysis } from '../types';
import SentimentIcon from './SentimentIcon';
import NewsCard from './NewsCard';
import Card from './ui/Card';

interface SentimentResultsProps {
  analysis: NewsAnalysis;
}

const SentimentResults: React.FC<SentimentResultsProps> = ({ analysis }) => {
  const formatPercentage = (percentage: number) => {
    return percentage.toFixed(1);
  };

  const getSentimentData = () => [
    {
      type: 'positive' as const,
      label: 'Positivas',
      percentage: analysis.positivePercentage,
      news: analysis.positiveNews,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      type: 'negative' as const,
      label: 'Negativas',
      percentage: analysis.negativePercentage,
      news: analysis.negativeNews,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      type: 'neutral' as const,
      label: 'Neutras',
      percentage: analysis.neutralPercentage,
      news: analysis.neutralNews,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Análisis de "{analysis.keyword}"
          </h2>
          <p className="text-slate-600">
            {analysis.totalNews} noticias analizadas - {analysis.date}
          </p>
        </div>
      </Card>

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
              {formatPercentage(sentiment.percentage)}%
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