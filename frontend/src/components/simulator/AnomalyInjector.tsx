import React, { useState } from 'react';

// İleride API'den dinamik çekilecek olan mock veri
const STATIONS = ["ST-101", "ST-202", "ST-303"];
const ANOMALY_TYPES = ["CPU_SPIKE", "STATION_DOWN", "LATENCY_BURST", "PACKET_LOSS"];

interface AnomalyInjectorProps {
  onInject: (anomaly: { stationId: string; type: string; duration: number }) => void;
}

export const AnomalyInjector: React.FC<AnomalyInjectorProps> = ({ onInject }) => {
  const [stationId, setStationId] = useState(STATIONS[0]);
  const [type, setType] = useState(ANOMALY_TYPES[0]);
  const [duration, setDuration] = useState(60); // varsayılan 60 saniye

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInject({ stationId, type, duration });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Manuel Anomali Tetikle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İstasyon</label>
          <select 
            value={stationId} 
            onChange={(e) => setStationId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {STATIONS.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anomali Tipi</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {ANOMALY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Süre (saniye): {duration}
          </label>
          <input 
            type="range" 
            min="10" 
            max="300" 
            step="10"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors mt-2"
        >
          Anomali Başlat
        </button>
      </form>
    </div>
  );
};
