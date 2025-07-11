import axios from 'axios';
import { NewsAnalysis, AnalysisFormData, ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 500) {
      throw new Error('Error del servidor. Intenta nuevamente más tarde.');
    } else if (error.response?.status === 400) {
      throw new Error('Datos inválidos. Verifica la información ingresada.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('La solicitud tardó demasiado tiempo. Intenta nuevamente.');
    } else if (!error.response) {
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    }
    return Promise.reject(error);
  }
);

export const newsApi = {
  analyzeNews: async (data: AnalysisFormData): Promise<NewsAnalysis> => {
    const response = await api.post<NewsAnalysis>('/api/news', data);
    return response.data;
  },

  getAnalyses: async (): Promise<NewsAnalysis[]> => {
    const response = await api.get<NewsAnalysis[]>('/api/news');
    return response.data;
  },
};

export default api;