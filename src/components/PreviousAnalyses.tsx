import React, { useEffect, useState } from 'react';
import { Clock, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { useNewsApi } from '../hooks/useNewsApi';
import { NewsAnalysis } from '../types';
import Card from './ui/Card';
import Modal from './ui/Modal';
import SentimentIcon from './SentimentIcon';
import SentimentResults from './SentimentResults';

const PreviousAnalyses: React.FC = () => {
  const { state } = useNews();
  const { fetchPreviousAnalyses } = useNewsApi();
  const [selectedAnalysis, setSelectedAnalysis] = useState<NewsAnalysis | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [filteredAnalyses, setFilteredAnalyses] = useState<NewsAnalysis[]>([]);

  useEffect(() => {
    fetchPreviousAnalyses();
  }, [fetchPreviousAnalyses]);

  useEffect(() => {
    if (!dateFilter) {
      setFilteredAnalyses(state.previousAnalyses);
    } else {
      const filtered = state.previousAnalyses.filter(analysis => {
        const analysisDate = new Date(analysis.createdAt);
        const filterDate = new Date(dateFilter);
        
        // Comparar solo la fecha (sin hora)
        return analysisDate.toDateString() === filterDate.toDateString();
      });
      setFilteredAnalyses(filtered);
    }
  }, [state.previousAnalyses, dateFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const getDominantSentiment = (analysis: NewsAnalysis) => {
    const parsePercentage = (value?: string) => {
      if (!value) return 0;
      return parseFloat(value.replace('%', '')) || 0;
    };
    
    const sentiments = [
      { type: 'positive' as const, percentage: parsePercentage(analysis.porcentaje?.positivas) },
      { type: 'negative' as const, percentage: parsePercentage(analysis.porcentaje?.negativas) },
      { type: 'neutral' as const, percentage: parsePercentage(analysis.porcentaje?.neutras) }
    ];
    
    return sentiments.reduce((max, current) => 
      current.percentage > max.percentage ? current : max
    );
  };

  const handleAnalysisClick = (analysis: NewsAnalysis) => {
    setSelectedAnalysis(analysis);
  };

  const handleCloseModal = () => {
    setSelectedAnalysis(null);
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
  };

  const clearDateFilter = () => {
    setDateFilter('');
  };

  if (state.previousAnalyses.length === 0) {
    return (
      <Card title="Análisis Previos">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No hay análisis previos disponibles</p>
        </div>
      </Card>
    );
  }

  const parsePercentage = (value?: string) => {
    if (!value) return 0;
    return parseFloat(value.replace('%', '')) || 0;
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header with filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-800">Análisis Previos</h3>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={dateFilter}
                onChange={handleDateFilterChange}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {dateFilter && (
              <button
                onClick={clearDateFilter}
                className="text-sm text-slate-500 hover:text-slate-700 underline"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            {filteredAnalyses.length} análisis encontrados
            {dateFilter && (
              <span className="ml-2 text-blue-600">
                para {new Date(dateFilter).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            )}
          </span>
        </div>

        {/* Analysis list */}
        {filteredAnalyses.length === 0 ? (
          <div className="text-center py-8">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              {dateFilter 
                ? 'No se encontraron análisis para la fecha seleccionada'
                : 'No hay análisis disponibles'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAnalyses.map((analysis) => {
          const dominantSentiment = getDominantSentiment(analysis);
          
          return (
            <div 
              key={analysis._id} 
              className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => handleAnalysisClick(analysis)}
            >
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <SentimentIcon sentiment={dominantSentiment.type} className="w-4 h-4" />
                    <h4 className="font-medium text-slate-800">
                      {analysis.keyword}
                    </h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {getDateLabel(analysis.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{analysis.total_analizadas || analysis.total || 0} noticias</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(analysis.createdAt)}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs">
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Positivo: {analysis.porcentaje?.positivas || '0%'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Negativo: {analysis.porcentaje?.negativas || '0%'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <span>Neutro: {analysis.porcentaje?.neutras || '0%'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
            })}
          </div>
        )}
      </div>

      {/* Modal for detailed analysis */}
      <Modal
        isOpen={!!selectedAnalysis}
        onClose={handleCloseModal}
        title={`Análisis detallado: ${selectedAnalysis?.keyword}`}
      >
        {selectedAnalysis && (
          <div className="p-6">
            <SentimentResults analysis={selectedAnalysis} showTitle={false} />
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default PreviousAnalyses;