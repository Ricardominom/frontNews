import React, { useEffect, useState } from 'react';
import { Clock, TrendingUp, Calendar, Filter, X } from 'lucide-react';
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
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [filteredAnalyses, setFilteredAnalyses] = useState<NewsAnalysis[]>([]);

  useEffect(() => {
    fetchPreviousAnalyses();
  }, [fetchPreviousAnalyses]);

  useEffect(() => {
    if (!dateFilter) {
      setFilteredAnalyses(state.previousAnalyses);
    } else {
      const filtered = state.previousAnalyses.filter(analysis => {
        // Crear fechas en la zona horaria local para evitar problemas de UTC
        const analysisDate = new Date(analysis.createdAt);
        const filterDate = new Date(dateFilter + 'T00:00:00');
        
        // Comparar solo año, mes y día
        return analysisDate.getFullYear() === filterDate.getFullYear() &&
               analysisDate.getMonth() === filterDate.getMonth() &&
               analysisDate.getDate() === filterDate.getDate();
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
    setShowDatePicker(false);
  };

  const clearDateFilter = () => {
    setDateFilter('');
    setShowDatePicker(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const getFilterButtonText = () => {
    if (!dateFilter) return 'Filtrar por fecha';
    
    const filterDate = new Date(dateFilter + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (filterDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (filterDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return filterDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
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
          
          <div className="relative">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDatePicker}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                  dateFilter 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{getFilterButtonText()}</span>
              </button>
              
              {dateFilter && (
                <button
                  onClick={clearDateFilter}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
                  title="Limpiar filtro"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Date picker dropdown */}
            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-10 min-w-[280px]">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-700">Seleccionar fecha</h4>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={clearDateFilter}
                      className="text-sm text-slate-500 hover:text-slate-700 underline"
                    >
                      Mostrar todos
                    </button>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close date picker */}
        {showDatePicker && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setShowDatePicker(false)}
          />
        )}

        {/* Active filter indicator */}
        {dateFilter && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Mostrando análisis del {new Date(dateFilter + 'T00:00:00').toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <button
              onClick={clearDateFilter}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Quitar filtro
            </button>
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-slate-600">
          <span>
            {filteredAnalyses.length} análisis 
            {dateFilter ? ' encontrados' : ' disponibles'}
          </span>
        </div>

        {/* Analysis list */}
        {filteredAnalyses.length === 0 ? (
          <div className="text-center py-12">
            {dateFilter ? (
              <>
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-600 mb-2">
                  No hay análisis para esta fecha
                </h4>
                <p className="text-slate-500 mb-4">
                  No se encontraron análisis para el {new Date(dateFilter + 'T00:00:00').toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <button
                  onClick={clearDateFilter}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Ver todos los análisis
                </button>
              </>
            ) : (
              <>
                <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No hay análisis previos disponibles</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAnalyses.map((analysis) => {
              const dominantSentiment = getDominantSentiment(analysis);
              
              return (
                <div 
                  key={analysis._id} 
                  className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer"
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