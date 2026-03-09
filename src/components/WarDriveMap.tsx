"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Network {
  id: number;
  ssid: string;
  bssid: string;
  signal: number;
  channel: number;
  security: string;
  lat: number;
  lng: number;
  vendor: string;
  firstSeen: string;
  lastSeen: string;
  clients: number;
}

interface Props {
  networks: Network[];
  selectedNetwork: Network | null;
  onSelectNetwork: (n: Network) => void;
}

function createNetworkIcon(security: string, signal: number) {
  const isOpen = security === "Open";
  const color = isOpen ? "#ff3366" : signal > -60 ? "#00ff88" : signal > -70 ? "#00d4ff" : "#ffd700";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="10" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="4" fill="${color}"/>
      <circle cx="14" cy="14" r="10" fill="none" stroke="${color}" stroke-width="1" stroke-opacity="0.4">
        <animate attributeName="r" from="4" to="14" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="stroke-opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function createGPSIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="8" fill="#00d4ff" fill-opacity="0.3" stroke="#00d4ff" stroke-width="2"/>
      <circle cx="16" cy="16" r="3" fill="#00d4ff"/>
      <line x1="16" y1="4" x2="16" y2="10" stroke="#00d4ff" stroke-width="1.5"/>
      <line x1="16" y1="22" x2="16" y2="28" stroke="#00d4ff" stroke-width="1.5"/>
      <line x1="4" y1="16" x2="10" y2="16" stroke="#00d4ff" stroke-width="1.5"/>
      <line x1="22" y1="16" x2="28" y2="16" stroke="#00d4ff" stroke-width="1.5"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapController({ networks, selectedNetwork }: { networks: Network[]; selectedNetwork: Network | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedNetwork) {
      map.flyTo([selectedNetwork.lat, selectedNetwork.lng], 17, { duration: 1 });
    }
  }, [selectedNetwork, map]);
  return null;
}

export default function WarDriveMap({ networks, selectedNetwork, onSelectNetwork }: Props) {
  const center: [number, number] = [40.7128, -74.006];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ width: "100%", height: "100%", background: "#0a1520" }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* GPS Position */}
      <Marker position={center} icon={createGPSIcon()}>
        <Popup className="cyber-popup">
          <div style={{ background: "#0d1f2d", color: "#00d4ff", padding: "8px", borderRadius: "4px", fontSize: "11px", fontFamily: "monospace" }}>
            <strong>Your Position</strong><br />
            40.7128°N 74.0060°W
          </div>
        </Popup>
      </Marker>

      {/* GPS Accuracy Circle */}
      <Circle
        center={center}
        radius={50}
        pathOptions={{ color: "#00d4ff", fillColor: "#00d4ff", fillOpacity: 0.05, weight: 1, dashArray: "4 4" }}
      />

      {/* Network Markers */}
      {networks.map((network) => (
        <Marker
          key={network.id}
          position={[network.lat, network.lng]}
          icon={createNetworkIcon(network.security, network.signal)}
          eventHandlers={{ click: () => onSelectNetwork(network) }}
        >
          <Popup>
            <div style={{ background: "#0d1f2d", color: "#e0f4ff", padding: "10px", borderRadius: "6px", fontSize: "11px", fontFamily: "monospace", minWidth: "180px", border: "1px solid #1a3a4a" }}>
              <div style={{ color: network.security === "Open" ? "#ff3366" : "#00d4ff", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>
                {network.ssid}
              </div>
              <div style={{ color: "#7ab8cc", marginBottom: "2px" }}>{network.bssid}</div>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <span style={{ color: "#3d6b7a" }}>Signal:</span>
                <span style={{ color: network.signal > -60 ? "#00ff88" : "#ffd700" }}>{network.signal} dBm</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ color: "#3d6b7a" }}>Security:</span>
                <span style={{ color: network.security === "Open" ? "#ff3366" : "#00d4ff" }}>{network.security}</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ color: "#3d6b7a" }}>Channel:</span>
                <span style={{ color: "#7ab8cc" }}>{network.channel}</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ color: "#3d6b7a" }}>Vendor:</span>
                <span style={{ color: "#7ab8cc" }}>{network.vendor}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapController networks={networks} selectedNetwork={selectedNetwork} />
    </MapContainer>
  );
}
