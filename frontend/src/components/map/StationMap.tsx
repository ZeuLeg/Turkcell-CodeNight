import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { dashboardApi } from '@/api/dashboard.api';
import { Station } from '@/types/station.types';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const STATUS_HUE: Record<string, number> = {
  ACTIVE: 120,
  WARNING: 45,
  CRITICAL: 0,
  OFFLINE: 200,
};

const getMarkerIcon = (status: string) => {
  const hue = STATUS_HUE[status] ?? 120;
  const iconHtml = `<div style="background-color:hsl(${hue},80%,50%);width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4);${status === 'OFFLINE' ? 'filter:grayscale(100%);' : ''}"></div>`;
  return L.divIcon({ html: iconHtml, className: 'custom-station-marker', iconSize: [16, 16], iconAnchor: [8, 8] });
};

interface StationMapProps {
  onSelectStation?: (id: string) => void;
}

export function StationMap({ onSelectStation }: StationMapProps) {
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const load = () =>
      dashboardApi.getStations()
        .then((res) => setStations(res.data ?? []))
        .catch(() => {});
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer center={[39.9208, 35.8541]} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[parseFloat(station.latitude), parseFloat(station.longitude)]}
            icon={getMarkerIcon(station.status)}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-slate-800 border-b pb-1 mb-2">{station.name}</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p className="flex justify-between"><span className="font-semibold">Kod:</span> {station.code}</p>
                  <p className="flex justify-between"><span className="font-semibold">Durum:</span> {station.status}</p>
                  <p className="flex justify-between"><span className="font-semibold">Tür:</span> {station.type}</p>
                </div>
                {onSelectStation ? (
                  <button
                    onClick={() => onSelectStation(station.id)}
                    className="mt-3 w-full bg-primary text-white text-xs font-semibold py-1.5 rounded hover:bg-primary/90 transition-colors"
                  >
                    Detayları Görüntüle
                  </button>
                ) : (
                  <Link
                    to={`/stations/${station.id}`}
                    className="mt-3 block w-full bg-primary text-white text-xs font-semibold py-1.5 rounded hover:bg-primary/90 transition-colors text-center"
                  >
                    Detayları Görüntüle
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
