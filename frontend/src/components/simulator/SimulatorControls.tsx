import React from 'react';

interface SimulatorControlsProps {
  isRunning: boolean;
  onToggle: () => void;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({ isRunning, onToggle }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Simülatör Kontrolü</h2>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">Durum: </span>
          <span className={`font-semibold ${isRunning ? 'text-green-600' : 'text-red-500'}`}>
            {isRunning ? 'Çalışıyor' : 'Durduruldu'}
          </span>
        </div>
        <button
          onClick={onToggle}
          className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? 'Simülatörü Durdur' : 'Simülatörü Başlat'}
        </button>
      </div>
    </div>
  );
};
