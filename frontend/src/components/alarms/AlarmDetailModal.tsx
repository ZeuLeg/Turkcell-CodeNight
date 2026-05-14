import React, { useState } from 'react';

interface AlarmDetailModalProps {
  alarm: any; // Tip tanımlamaları yapılınca burası güncellenir
  onClose: () => void;
  onResolve: (alarmId: string, resolutionNote: string) => void;
}

export const AlarmDetailModal: React.FC<AlarmDetailModalProps> = ({ alarm, onClose, onResolve }) => {
  const [resolutionNote, setResolutionNote] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  if (!alarm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Alarm Detayı</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Durum</p>
              <p className={`font-medium ${alarm.status === 'OPEN' ? 'text-red-600' : 'text-green-600'}`}>
                {alarm.status === 'OPEN' ? 'Açık' : 'Çözüldü'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Şiddet</p>
              <p className={`font-medium ${alarm.severity === 'CRITICAL' ? 'text-red-700' : 'text-orange-500'}`}>
                {alarm.severity === 'CRITICAL' ? 'Kritik' : 'Uyarı'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Metrik</p>
              <p className="font-medium">{alarm.metricName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tarih</p>
              <p className="font-medium">{new Date(alarm.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">İstasyon</p>
            {/* React Router link eklenebilir: <Link to={`/stations/${alarm.stationId}`}> */}
            <a href={`/stations/${alarm.stationId}`} className="text-blue-600 hover:underline font-medium">
              İstasyon detayına git (ID: {alarm.stationId})
            </a>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Açıklama</p>
            <p className="bg-gray-50 p-3 rounded-md text-sm border border-gray-200">{alarm.message}</p>
          </div>

          {alarm.status === 'OPEN' && (
            <>
              <div>
                <label className="text-sm text-gray-700 block mb-1">Atama Yap (Assign)</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Seçiniz...</option>
                  <option value="user1">Ahmet Yılmaz (NOC)</option>
                  <option value="user2">Ayşe Demir (Mühendis)</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-700 block mb-1">Çözüm Notu</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  rows={3}
                  placeholder="Bu alarm neden oluştu ve nasıl çözüldü?"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                />
              </div>
            </>
          )}

          {alarm.status === 'RESOLVED' && alarm.resolutionNote && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Çözüm Notu</p>
              <p className="bg-green-50 p-3 rounded-md text-sm border border-green-200 text-green-800">
                {alarm.resolutionNote}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Kapat
          </button>
          {alarm.status === 'OPEN' && (
            <button 
              onClick={() => onResolve(alarm.id, resolutionNote)}
              disabled={!resolutionNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Çözüldü Olarak İşaretle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};