import { useCallback } from 'react';
import { newsApi } from '../services/api';
import { useNews } from '../context/NewsContext';
import { AnalysisFormData } from '../types';

export const useNewsApi = () => {
  const { dispatch } = useNews();

  const analyzeNews = useCallback(async (data: AnalysisFormData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_CURRENT_SEARCH_DATA', payload: data });
      
      const result = await newsApi.analyzeNews(data);
      dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: result });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [dispatch]);

  const fetchPreviousAnalyses = useCallback(async () => {
    try {
      const analyses = await newsApi.getAnalyses();
      dispatch({ type: 'SET_PREVIOUS_ANALYSES', payload: analyses });
    } catch (error) {
      // Silently handle connection errors on initial load
      // Only log to console, don't show error to user
      if (error instanceof Error && error.message.includes('No se pudo conectar')) {
        console.warn('Backend server not available. Previous analyses will not be loaded.');
      } else {
        console.error('Error fetching previous analyses:', error);
      }
    }
  }, [dispatch]);

  const clearCurrentAnalysis = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_ANALYSIS' });
  }, [dispatch]);

  return {
    analyzeNews,
    fetchPreviousAnalyses,
    clearCurrentAnalysis,
  };
};