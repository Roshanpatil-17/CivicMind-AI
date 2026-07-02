import L from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { api } from '../api/client.js';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapPage() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.listIssues().then(setIssues).catch(() => setIssues([]));
  }, []);

  const center = issues.length ? [issues[0].latitude, issues[0].longitude] : [28.6139, 77.209];

  return (
    <section className="map-page">
      <div className="page-heading">
        <h1>Issue map</h1>
      </div>
      <MapContainer center={center} zoom={12} scrollWheelZoom className="map-canvas">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {issues.map((issue) => (
          <Marker key={issue.id} position={[issue.latitude, issue.longitude]} icon={markerIcon}>
            <Popup>
              <strong>{issue.title}</strong>
              <br />
              {issue.category} | {issue.priority}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}

