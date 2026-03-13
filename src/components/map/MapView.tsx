"use client";

import { useEffect, useState } from "react";
import type { Place } from "@/types";

// Lazy load to avoid SSR issues with Leaflet
let L: typeof import("leaflet") | null = null;
let MapContainer: typeof import("react-leaflet").MapContainer | null = null;
let TileLayer: typeof import("react-leaflet").TileLayer | null = null;
let Marker: typeof import("react-leaflet").Marker | null = null;
let Popup: typeof import("react-leaflet").Popup | null = null;

interface MapViewProps {
  places: Place[];
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MapView({ places }: MapViewProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadLeaflet() {
      const leaflet = await import("leaflet");
      const rl = await import("react-leaflet");
      L = leaflet;
      MapContainer = rl.MapContainer;
      TileLayer = rl.TileLayer;
      Marker = rl.Marker;
      Popup = rl.Popup;

      // Fix default icon issue
      delete (leaflet.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      setLoaded(true);
    }
    loadLeaflet();
  }, []);

  if (!loaded || !MapContainer || !TileLayer || !Marker || !Popup || !L) {
    return (
      <div className="w-full h-[70vh] bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500">Đang tải bản đồ...</p>
      </div>
    );
  }

  // Calculate center from places or default to Vietnam
  const center: [number, number] = places.length > 0
    ? [
        places.reduce((sum, p) => sum + p.lat, 0) / places.length,
        places.reduce((sum, p) => sum + p.lng, 0) / places.length,
      ]
    : [16.0, 106.0];

  const heartIcon = L.divIcon({
    html: `<div style="font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">&#10084;&#65039;</div>`,
    className: "leaflet-heart-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });

  const MC = MapContainer;
  const TL = TileLayer;
  const M = Marker;
  const P = Popup;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
      />
      <style>{`
        .leaflet-heart-icon { background: none !important; border: none !important; }
      `}</style>
      <MC
        center={center}
        zoom={places.length > 0 ? 7 : 6}
        className="w-full h-[70vh] rounded-2xl overflow-hidden shadow-lg z-0"
        scrollWheelZoom
      >
        <TL
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <M key={place.id} position={[place.lat, place.lng]} icon={heartIcon}>
            <P>
              <div className="min-w-[200px] max-w-[280px]">
                {place.image && (
                  <img
                    src={place.image}
                    alt={place.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <h3 className="font-bold text-gray-900 text-sm">{place.title}</h3>
                {place.date && (
                  <p className="text-xs text-primary-500 mt-1">{formatDate(place.date)}</p>
                )}
                {place.description && (
                  <p className="text-xs text-gray-600 mt-1">{place.description}</p>
                )}
              </div>
            </P>
          </M>
        ))}
      </MC>
    </>
  );
}
