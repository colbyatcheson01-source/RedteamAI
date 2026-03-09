"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Wifi,
  WifiOff,
  Radio,
  MapPin,
  Play,
  Square,
  Download,
  Filter,
  Signal,
  Lock,
  Unlock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  Database,
} from "lucide-react";

// Dynamic import for Leaflet (no SSR)
const MapComponent = dynamic(() => import("@/components/WarDriveMap"), { ssr: false, loading: () => (
  <div className="w-full h-full flex items-center justify-center bg-[#0a1520]">
    <div className="text-center">
      <RefreshCw className="w-8 h-8 text-[#00d4ff] animate-rotate mx-auto mb-3" />
      <p className="text-[#3d6b7a] text-sm">Loading map...</p>
    </div>
  </div>
) });

const mockNetworks = [
  { id: 1, ssid: "HomeNetwork_5G", bssid: "AA:BB:CC:DD:EE:01", signal: -42, channel: 36, security: "WPA3", lat: 40.7128, lng: -74.006, vendor: "Netgear", firstSeen: "10:23:14", lastSeen: "10:45:22", clients: 4 },
  { id: 2, ssid: "CoffeeShop_Guest", bssid: "AA:BB:CC:DD:EE:02", signal: -67, channel: 6, security: "Open", lat: 40.7135, lng: -74.0055, vendor: "Cisco", firstSeen: "10:24:01", lastSeen: "10:45:22", clients: 12 },
  { id: 3, ssid: "NETGEAR_5G_EXT", bssid: "AA:BB:CC:DD:EE:03", signal: -55, channel: 149, security: "WPA2", lat: 40.7122, lng: -74.0065, vendor: "Netgear", firstSeen: "10:25:33", lastSeen: "10:44:18", clients: 2 },
  { id: 4, ssid: "ATT-WIFI-7823", bssid: "AA:BB:CC:DD:EE:04", signal: -71, channel: 11, security: "WPA2", lat: 40.7140, lng: -74.0048, vendor: "AT&T", firstSeen: "10:26:45", lastSeen: "10:43:55", clients: 7 },
  { id: 5, ssid: "xfinitywifi", bssid: "AA:BB:CC:DD:EE:05", signal: -78, channel: 1, security: "Open", lat: 40.7118, lng: -74.0072, vendor: "Comcast", firstSeen: "10:27:12", lastSeen: "10:42:30", clients: 23 },
  { id: 6, ssid: "TP-Link_2.4G_9A3F", bssid: "AA:BB:CC:DD:EE:06", signal: -61, channel: 6, security: "WPA2", lat: 40.7131, lng: -74.0061, vendor: "TP-Link", firstSeen: "10:28:00", lastSeen: "10:45:22", clients: 1 },
  { id: 7, ssid: "DIRECT-Samsung-TV", bssid: "AA:BB:CC:DD:EE:07", signal: -48, channel: 36, security: "WPA2", lat: 40.7126, lng: -74.0058, vendor: "Samsung", firstSeen: "10:29:44", lastSeen: "10:41:10", clients: 0 },
  { id: 8, ssid: "HiddenNetwork", bssid: "AA:BB:CC:DD:EE:08", signal: -83, channel: 11, security: "WPA2", lat: 40.7145, lng: -74.0042, vendor: "Unknown", firstSeen: "10:30:22", lastSeen: "10:40:05", clients: 3 },
];

const signalStrength = (signal: number) => {
  if (signal > -50) return { label: "Excellent", color: "#00ff88", bars: 4 };
  if (signal > -60) return { label: "Good", color: "#00d4ff", bars: 3 };
  if (signal > -70) return { label: "Fair", color: "#ffd700", bars: 2 };
  return { label: "Weak", color: "#ff8c00", bars: 1 };
};

export default function WarDrivingPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [networks, setNetworks] = useState(mockNetworks.slice(0, 3));
  const [selectedNetwork, setSelectedNetwork] = useState<typeof mockNetworks[0] | null>(null);
  const [filter, setFilter] = useState("all");
  const [gpsCoords, setGpsCoords] = useState({ lat: 40.7128, lng: -74.006 });
  const [scanProgress, setScanProgress] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const scanInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    let idx = networks.length;
    scanInterval.current = setInterval(() => {
      setScanProgress((p) => Math.min(p + 2, 100));
      if (idx < mockNetworks.length) {
        setNetworks((prev) => [...prev, mockNetworks[idx]]);
        idx++;
      }
    }, 400);
  };

  const stopScan = () => {
    setIsScanning(false);
    if (scanInterval.current) clearInterval(scanInterval.current);
  };

  useEffect(() => {
    return () => { if (scanInterval.current) clearInterval(scanInterval.current); };
  }, []);

  const filteredNetworks = networks.filter((n) => {
    if (filter === "open") return n.security === "Open";
    if (filter === "wpa2") return n.security === "WPA2";
    if (filter === "wpa3") return n.security === "WPA3";
    return true;
  });

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-0px)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#1a3a4a] bg-[#0a1520] flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-[#e0f4ff] tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
              WAR <span className="text-[#00ff88]">DRIVING</span>
            </h1>
            <p className="text-[#3d6b7a] text-xs mt-0.5">GPS-Mapped Network Discovery</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#1a3a4a] bg-[#0d1f2d]">
              <MapPin className="w-3 h-3 text-[#00d4ff]" />
              <span className="text-xs text-[#7ab8cc] font-mono">{gpsCoords.lat.toFixed(4)}°N {Math.abs(gpsCoords.lng).toFixed(4)}°W</span>
            </div>
            <button
              onClick={isScanning ? stopScan : startScan}
              className={`flex items-center gap-2 px-4 py-2 rounded border text-xs font-semibold tracking-wider uppercase transition-all ${
                isScanning
                  ? "border-[#ff3366] text-[#ff3366] bg-[rgba(255,51,102,0.1)] hover:bg-[rgba(255,51,102,0.2)]"
                  : "border-[#00ff88] text-[#00ff88] bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)]"
              }`}
            >
              {isScanning ? <><Square className="w-3 h-3" /> Stop</> : <><Play className="w-3 h-3" /> Scan</>}
            </button>
          </div>
        </div>

        {/* Scan Progress */}
        {isScanning && (
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-[#3d6b7a] mb-1">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#00ff88] animate-pulse-glow" />
                Scanning channels 1-165...
              </span>
              <span className="text-[#00ff88]">{scanProgress}%</span>
            </div>
            <div className="cyber-progress">
              <div className="cyber-progress-bar" style={{ width: `${scanProgress}%`, background: "linear-gradient(90deg, #00ff88, #00d4ff)" }} />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MapComponent networks={filteredNetworks} selectedNetwork={selectedNetwork} onSelectNetwork={setSelectedNetwork} />

          {/* Stats Overlay */}
          <div className="absolute top-4 left-4 z-10 space-y-2">
            <div className="bg-[rgba(10,21,32,0.9)] border border-[#1a3a4a] rounded-lg p-3 backdrop-blur-sm">
              <div className="text-[10px] text-[#3d6b7a] uppercase tracking-widest mb-2">Live Stats</div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-[11px] text-[#7ab8cc]">Networks</span>
                  <span className="text-[11px] text-[#00ff88] font-mono font-bold">{networks.length}</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-[11px] text-[#7ab8cc]">Open</span>
                  <span className="text-[11px] text-[#ff3366] font-mono font-bold">{networks.filter(n => n.security === "Open").length}</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-[11px] text-[#7ab8cc]">WPA2/3</span>
                  <span className="text-[11px] text-[#00d4ff] font-mono font-bold">{networks.filter(n => n.security !== "Open").length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network List Panel */}
        <div className="w-full md:w-80 lg:w-96 bg-[#0a1520] border-l border-[#1a3a4a] flex flex-col overflow-hidden absolute md:relative bottom-0 left-0 right-0 h-64 md:h-auto z-20">
          {/* Filter Bar */}
          <div className="p-3 border-b border-[#1a3a4a] flex items-center gap-2 flex-shrink-0">
            <Filter className="w-3 h-3 text-[#3d6b7a]" />
            {["all", "open", "wpa2", "wpa3"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider transition-all ${
                  filter === f
                    ? "bg-[rgba(0,212,255,0.15)] text-[#00d4ff] border border-[rgba(0,212,255,0.3)]"
                    : "text-[#3d6b7a] hover:text-[#7ab8cc]"
                }`}
              >
                {f}
              </button>
            ))}
            <button className="ml-auto p-1 text-[#3d6b7a] hover:text-[#00d4ff]">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Network List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNetworks.map((network) => {
              const sig = signalStrength(network.signal);
              const isExpanded = expandedId === network.id;
              return (
                <div
                  key={network.id}
                  className={`border-b border-[#1a3a4a] transition-colors ${
                    selectedNetwork?.id === network.id ? "bg-[rgba(0,212,255,0.05)]" : "hover:bg-[rgba(255,255,255,0.02)]"
                  }`}
                >
                  <div
                    className="p-3 cursor-pointer"
                    onClick={() => {
                      setSelectedNetwork(network);
                      setExpandedId(isExpanded ? null : network.id);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {network.security === "Open" ? (
                        <Unlock className="w-3.5 h-3.5 text-[#ff3366] flex-shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#00d4ff] flex-shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-[#e0f4ff] truncate flex-1">{network.ssid}</span>
                      <div className="flex items-end gap-0.5 flex-shrink-0">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className="w-1 rounded-sm"
                            style={{
                              height: `${bar * 3 + 2}px`,
                              background: bar <= sig.bars ? sig.color : "#1a3a4a",
                            }}
                          />
                        ))}
                      </div>
                      {isExpanded ? <ChevronUp className="w-3 h-3 text-[#3d6b7a]" /> : <ChevronDown className="w-3 h-3 text-[#3d6b7a]" />}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-[#3d6b7a] font-mono">{network.bssid}</span>
                      <span className="text-[10px] font-mono" style={{ color: sig.color }}>{network.signal} dBm</span>
                      <span className={`cyber-badge text-[9px] ${network.security === "Open" ? "badge-critical" : "badge-info"}`}>
                        {network.security}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-3 pb-3 bg-[rgba(0,0,0,0.2)]">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div><span className="text-[#3d6b7a]">Channel: </span><span className="text-[#7ab8cc]">{network.channel}</span></div>
                        <div><span className="text-[#3d6b7a]">Vendor: </span><span className="text-[#7ab8cc]">{network.vendor}</span></div>
                        <div><span className="text-[#3d6b7a]">Clients: </span><span className="text-[#7ab8cc]">{network.clients}</span></div>
                        <div><span className="text-[#3d6b7a]">Signal: </span><span style={{ color: sig.color }}>{sig.label}</span></div>
                        <div className="col-span-2"><span className="text-[#3d6b7a]">First Seen: </span><span className="text-[#7ab8cc] font-mono">{network.firstSeen}</span></div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="flex-1 py-1.5 rounded border border-[rgba(0,212,255,0.3)] text-[#00d4ff] text-[10px] hover:bg-[rgba(0,212,255,0.1)] transition-colors flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3" /> Analyze
                        </button>
                        <button className="flex-1 py-1.5 rounded border border-[rgba(0,255,136,0.3)] text-[#00ff88] text-[10px] hover:bg-[rgba(0,255,136,0.1)] transition-colors flex items-center justify-center gap-1">
                          <Database className="w-3 h-3" /> Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
