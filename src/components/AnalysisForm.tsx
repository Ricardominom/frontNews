import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNewsApi } from '../hooks/useNewsApi';
import { useNews } from '../context/NewsContext';
import { AnalysisFormData } from '../types';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';

const AnalysisForm: React.FC = () => {
  const [formData, setFormData] = useState<AnalysisFormData>({
    keyword: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  
  const { state } = useNews();
  const { analyzeNews } = useNewsApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.keyword.trim()) {
      setFormError('Por favor ingresa una palabra clave');
      return;
    }

    try {
      await analyzeNews(formData);
    } catch (error) {
      // Error is already handled in the context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Search className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">Análisis de Sentimientos</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="keyword" className="block text-sm font-medium text-slate-700">
            Palabra clave
          </label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            value={formData.keyword}
            onChange={handleInputChange}
            placeholder="Ej: tecnología, política, deportes..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            disabled={state.loading}
          />
        </div>

        {formError && (
          <ErrorMessage message={formError} />
        )}

        {state.error && (
          <ErrorMessage 
            message={state.error} 
            onRetry={() => handleSubmit(new Event('submit') as any)}
          />
        )}

        <button
          type="submit"
          disabled={state.loading || !formData.keyword.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {state.loading ? (
            <>
              <LoadingSpinner size="sm" className="text-white" />
              <span>Analizando noticias...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Analizar Noticias</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;