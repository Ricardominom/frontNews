import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PreviousAnalyses from '../components/PreviousAnalyses';

const PreviousAnalysesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver al análisis</span>
        </button>
      </div>

      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Análisis Previos
        </h1>
        <p className="text-slate-600">
          Historial completo de análisis de sentimientos realizados
        </p>
      </div>

      {/* Previous Analyses Component */}
      <div className="max-w-4xl mx-auto">
        <PreviousAnalyses />
      </div>
    </div>
  );
};

export default PreviousAnalysesPage;