'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

type Coords = { lat: number; lng: number };

interface LocationMapProps {
  onConfirm: (coords: Coords) => void;
}

const RecenterMap: React.FC<{ coords: Coords }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
};

const LocationMap: React.FC<LocationMapProps> = ({ onConfirm }) => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [address, setAddress] = useState<string>('');
  const [markerIcon, setMarkerIcon] = useState<any>(null);

  useEffect(() => {
    // Leaflet import inside useEffect to avoid SSR issues
    import('leaflet').then(L => {
      const icon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setMarkerIcon(icon);
    });

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const currentCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCoords(currentCoords);
          setAddress(
            `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`
          );
        },
        err => {
          console.error(err);
          alert('Location access denied!');
        }
      );
    } else {
      alert('Geolocation not supported!');
    }
  }, []);

  if (!coords || !markerIcon) return <p>লোকেশন লোড হচ্ছে...</p>;

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="mb-2">
        <input
          type="text"
          value={address}
          readOnly
          className="w-full border px-3 py-2 rounded bg-blue-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <small className="text-gray-500">Format: lat,lng</small>
      </div>

      <div className="flex-1">
        <MapContainer center={coords} zoom={15} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap coords={coords} />
          <Marker
            position={coords}
            draggable
            eventHandlers={{
              dragend: e => {
                const newPos = e.target.getLatLng();
                setCoords(newPos);
                setAddress(`${newPos.lat.toFixed(6)}, ${newPos.lng.toFixed(6)}`);
              },
            }}
            icon={markerIcon}
          >
            <Popup>Drag your location 🗺️</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="mt-2 flex justify-center">
        <button
          onClick={() => onConfirm(coords)}
          className="px-5 py-2 text-lg bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          CONFIRM LOCATION
        </button>
      </div>
    </div>
  );
};

export default LocationMap;
