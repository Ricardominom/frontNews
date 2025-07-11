export interface NewsAnalysis {
  _id: string;
  keyword: string;
  date: string;
  totalNews: number;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  positiveNews: NewsItem[];
  negativeNews: NewsItem[];
  neutralNews: NewsItem[];
  createdAt: string;
  porcentaje?: {
    positivas: string;
    negativas: string;
    neutras: string;
  };
}

export interface NewsItem {
  title: string;
  link: string;
  snippet: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
}

export interface AnalysisFormData {
  keyword: string;
  date: 'hoy' | 'ayer';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}