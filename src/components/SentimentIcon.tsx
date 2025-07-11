import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

interface SentimentIconProps {
  sentiment: 'positive' | 'negative' | 'neutral';
  className?: string;
}

const SentimentIcon: React.FC<SentimentIconProps> = ({ sentiment, className = '' }) => {
  const getIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <Smile className={`text-green-500 ${className}`} />;
      case 'negative':
        return <Frown className={`text-red-500 ${className}`} />;
      case 'neutral':
        return <Meh className={`text-slate-400 ${className}`} />;
      default:
        return <Meh className={`text-slate-400 ${className}`} />;
    }
  };

  return getIcon();
};

export default SentimentIcon;