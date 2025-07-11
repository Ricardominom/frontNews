import React from 'react';
import { BarChart3, Droplets } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
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
          <div className="flex-1"></div>
          <div className="flex items-center space-x-2 text-slate-600">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;