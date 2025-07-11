import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Droplets, History } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleNavigateToPrevious = () => {
    navigate('/analisis-previos');
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleNavigateHome}
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Agua de Puebla
              </h1>
              <p className="text-sm text-slate-600">
                Análisis de Sentimientos en Noticias
              </p>
            </div>
          </div>
          
          <button
            onClick={handleNavigateToPrevious}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              location.pathname === '/analisis-previos'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <History className="w-5 h-5" />
            <span className="text-sm font-medium">Análisis Previos</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;