import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { NewsAnalysis, AnalysisFormData } from '../types';

interface NewsState {
  currentAnalysis: NewsAnalysis | null;
  currentSearchData: AnalysisFormData | null;
  previousAnalyses: NewsAnalysis[];
  loading: boolean;
  error: string | null;
}

type NewsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_ANALYSIS'; payload: NewsAnalysis }
  | { type: 'SET_CURRENT_SEARCH_DATA'; payload: AnalysisFormData }
  | { type: 'SET_PREVIOUS_ANALYSES'; payload: NewsAnalysis[] }
  | { type: 'CLEAR_CURRENT_ANALYSIS' };

const initialState: NewsState = {
  currentAnalysis: null,
  currentSearchData: null,
  previousAnalyses: [],
  loading: false,
  error: null,
};

const newsReducer = (state: NewsState, action: NewsAction): NewsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CURRENT_ANALYSIS':
      return { ...state, currentAnalysis: action.payload, loading: false, error: null };
    case 'SET_CURRENT_SEARCH_DATA':
      return { ...state, currentSearchData: action.payload };
    case 'SET_PREVIOUS_ANALYSES':
      return { ...state, previousAnalyses: action.payload };
    case 'CLEAR_CURRENT_ANALYSIS':
      return { ...state, currentAnalysis: null, currentSearchData: null };
    default:
      return state;
  }
};

const NewsContext = createContext<{
  state: NewsState;
  dispatch: React.Dispatch<NewsAction>;
} | null>(null);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(newsReducer, initialState);

  return (
    <NewsContext.Provider value={{ state, dispatch }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};