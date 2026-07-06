import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

function LocationMarker({ position, onChange }) {
  useMapEvents({
    click(e) {
      onChange({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ latitude, longitude, onLocationChange }) {
  const position =
    latitude && longitude
      ? [Number(latitude), Number(longitude)]
      : [15.3647, 75.1240]; // Default center (Karnataka)

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{
        height: '350px',
        width: '100%',
        borderRadius: '12px',
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        position={
          latitude && longitude
            ? [Number(latitude), Number(longitude)]
            : null
        }
        onChange={onLocationChange}
      />
    </MapContainer>
  );
}