import React from 'react';
import { ExternalLink } from 'lucide-react';
import { NewsItem } from '../types';
import SentimentIcon from './SentimentIcon';

interface NewsCardProps {
  news: NewsItem;
  rank?: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, rank }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'border-green-200 bg-green-50';
      case 'negative':
        return 'border-red-200 bg-red-50';
      case 'neutral':
        return 'border-slate-200 bg-slate-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className={`border rounded-xl p-4 ${getSentimentColor(news.sentiment)} hover:shadow-sm transition-shadow`}>
      <div className="flex items-start justify-between space-x-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {rank && (
              <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-full">
                #{rank}
              </span>
            )}
            <SentimentIcon sentiment={news.sentiment} className="w-4 h-4" />
            <span className="text-xs text-slate-500 font-medium capitalize">
              {news.sentiment === 'positive' ? 'Positivo' : 
               news.sentiment === 'negative' ? 'Negativo' : 'Neutral'}
            </span>
          </div>
          <h4 className="font-medium text-slate-800 mb-2 line-clamp-2">
            {news.title}
          </h4>
          <p className="text-sm text-slate-600 mb-3 line-clamp-3">
            {news.snippet}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Score: {news.score.toFixed(3)}
            </span>
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 text-sm flex items-center space-x-1 transition-colors"
            >
              <span>Leer más</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;