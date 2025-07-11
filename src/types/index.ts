export interface NewsAnalysis {
  _id: string;
  keyword: string;
  date: string;
  total?: number;
  total_analizadas?: number;
  top_positivas: NewsItem[];
  top_negativas: NewsItem[];
  top_neutras: NewsItem[];
  createdAt: string;
  porcentaje: {
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