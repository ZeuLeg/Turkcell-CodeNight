import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon not showing correctly in React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

// Mock station data
const stations = [
  { id: 1, name: 'TR-IST-01 (Maslak)', lat: 41.1118, lng: 29.0232, status: 'normal', signal: '-65 dBm' },
  { id: 2, name: 'TR-IST-02 (Kadıköy)', lat: 40.9819, lng: 29.0277, status: 'warning', signal: '-82 dBm' },
  { id: 3, name: 'TR-ANK-01 (Kızılay)', lat: 39.9208, lng: 32.8541, status: 'critical', signal: '-95 dBm' },
  { id: 4, name: 'TR-IZM-01 (Konak)', lat: 38.4192, lng: 27.1287, status: 'offline', signal: 'N/A' },
  { id: 5, name: 'TR-ANT-01 (Muratpaşa)', lat: 36.8969, lng: 30.7133, status: 'normal', signal: '-70 dBm' },
];

const getMarkerIcon = (status: string) => {
  let hue = 120; // normal - green
  if (status === 'warning') hue = 45; // yellow
  if (status === 'critical') hue = 0; // red
  if (status === 'offline') hue = 0; // we'll use grayscale filter for offline

  const iconHtml = `
    <div style="
      background-color: hsl(${hue}, 80%, 50%);
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.4);
      ${status === 'offline' ? 'filter: grayscale(100%);' : ''}
    "></div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-station-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

export function StationMap() {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer 
        center={[39.9208, 35.8541]} // Center of Turkey roughly
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map(station => (
          <Marker 
            key={station.id} 
            position={[station.lat, station.lng]}
            icon={getMarkerIcon(station.status)}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-slate-800">{station.name}</h3>
                <div className="mt-2 text-sm text-slate-600">
                  <p><span className="font-semibold">Durum:</span> <span className="uppercase">{station.status}</span></p>
                  <p><span className="font-semibold">Sinyal Gücü:</span> {station.signal}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
