import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

function RecenterMap({ position }) {
  const map = useMap();

  if (position) {
    map.setView(position, 16);
  }

  return null;
}

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

export default function MapPicker({
  latitude,
  longitude,
  onLocationChange,
}) {
  const position =
    latitude && longitude
      ? [Number(latitude), Number(longitude)]
      : [15.3647, 75.1240];

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap
        position={
          latitude && longitude
            ? [Number(latitude), Number(longitude)]
            : null
        }
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