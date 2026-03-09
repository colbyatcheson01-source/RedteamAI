"use client";

import { useState } from "react";
import {
  Database,
  Search,
  Filter,
  Download,
  Trash2,
  Wifi,
  Lock,
  Unlock,
  MapPin,
  Clock,
  Signal,
  ChevronDown,
  ChevronUp,
  Eye,
  Zap,
  BarChart3,
  Globe,
  RefreshCw,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

const dbNetworks = [
  { id: 1, ssid: "HomeNetwork_5G", bssid: "AA:BB:CC:DD:EE:01", signal: -42, channel: 36, security: "WPA3", lat: 40.7128, lng: -74.006, vendor: "Netgear", firstSeen: "2024-03-01 10:23:14", lastSeen: "2024-03-09 10:45:22", clients: 4, location: "New York, NY", notes: "Residential - strong signal", tags: ["residential", "strong"] },
  { id: 2, ssid: "CoffeeShop_Guest", bssid: "AA:BB:CC:DD:EE:02", signal: -67, channel: 6, security: "Open", lat: 40.7135, lng: -74.0055, vendor: "Cisco", firstSeen: "2024-03-05 08:12:00", lastSeen: "2024-03-09 10:45:22", clients: 12, location: "New York, NY", notes: "Public hotspot - no encryption", tags: ["public", "open", "high-traffic"] },
  { id: 3, ssid: "NETGEAR_5G_EXT", bssid: "AA:BB:CC:DD:EE:03", signal: -55, channel: 149, security: "WPA2", lat: 40.7122, lng: -74.0065, vendor: "Netgear", firstSeen: "2024-03-02 14:30:00", lastSeen: "2024-03-09 10:44:18", clients: 2, location: "New York, NY", notes: "Range extender", tags: ["extender"] },
  { id: 4, ssid: "ATT-WIFI-7823", bssid: "AA:BB:CC:DD:EE:04", signal: -71, channel: 11, security: "WPA2", lat: 40.7140, lng: -74.0048, vendor: "AT&T", firstSeen: "2024-03-03 09:00:00", lastSeen: "2024-03-09 10:43:55", clients: 7, location: "New York, NY", notes: "ISP router", tags: ["isp", "att"] },
  { id: 5, ssid: "xfinitywifi", bssid: "AA:BB:CC:DD:EE:05", signal: -78, channel: 1, security: "Open", lat: 40.7118, lng: -74.0072, vendor: "Comcast", firstSeen: "2024-03-01 11:00:00", lastSeen: "2024-03-09 10:42:30", clients: 23, location: "New York, NY", notes: "Xfinity public hotspot", tags: ["public", "open", "xfinity"] },
  { id: 6, ssid: "TP-Link_2.4G_9A3F", bssid: "AA:BB:CC:DD:EE:06", signal: -61, channel: 6, security: "WPA2", lat: 40.7131, lng: -74.0061, vendor: "TP-Link", firstSeen: "2024-03-04 16:45:00", lastSeen: "2024-03-09 10:45:22", clients: 1, location: "New York, NY", notes: "", tags: [] },
  { id: 7, ssid: "DIRECT-Samsung-TV", bssid: "AA:BB:CC:DD:EE:07", signal: -48, channel: 36, security: "WPA2", lat: 40.7126, lng: -74.0058, vendor: "Samsung", firstSeen: "2024-03-06 20:00:00", lastSeen: "2024-03-09 10:41:10", clients: 0, location: "New York, NY", notes: "Smart TV direct connect", tags: ["iot", "tv"] },
  { id: 8, ssid: "HiddenNetwork", bssid: "AA:BB:CC:DD:EE:08", signal: -83, channel: 11, security: "WPA2", lat: 40.7145, lng: -74.0042, vendor: "Unknown", firstSeen: "2024-03-07 22:30:00", lastSeen: "2024-03-09 10:40:05", clients: 3, location: "New York, NY", notes: "Hidden SSID - suspicious", tags: ["hidden", "suspicious"] },
];

const channelData = [
  { channel: "1", count: 3 },
  { channel: "6", count: 4 },
  { channel: "11", count: 2 },
  { channel: "36", count: 3 },
  { channel: "149", count: 2 },
];

const securityData = [
  { name: "WPA3", value: 1, color: "#00ff88" },
  { name: "WPA2", value: 5, color: "#00d4ff" },
  { name: "Open", value: 2, color: "#ff3366" },
];

const vendorData = [
  { vendor: "Netgear", count: 2 },
  { vendor: "Cisco", count: 1 },
  { vendor: "AT&T", count: 1 },
  { vendor: "Comcast", count: 1 },
  { vendor: "TP-Link", count: 1 },
  { vendor: "Samsung", count: 1 },
  { vendor: "Unknown", count: 1 },
];

export default function DatabasePage() {
  const [search, setSearch] = useState("");
  const [filterSecurity, setFilterSecurity] = useState("all");
  const [sortBy, setSortBy] = useState<"signal" | "firstSeen" | "clients">("signal");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<"table" | "analytics">("table");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const filtered = dbNetworks
    .filter((n) => {
      const matchSearch = n.ssid.toLowerCase().includes(search.toLowerCase()) ||
        n.bssid.toLowerCase().includes(search.toLowerCase()) ||
        n.vendor.toLowerCase().includes(search.toLowerCase());
      const matchSecurity = filterSecurity === "all" || n.security.toLowerCase() === filterSecurity;
      return matchSearch && matchSecurity;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "signal") return (a.signal - b.signal) * dir;
      if (sortBy === "clients") return (a.clients - b.clients) * dir;
      return a.firstSeen.localeCompare(b.firstSeen) * dir;
    });

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortDir("desc"); }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#e0f4ff] tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
            NETWORK <span className="text-[#00d4ff]">DATABASE</span>
          </h1>
          <p className="text-[#3d6b7a] text-xs mt-0.5">Discovered Networks & Intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#3d6b7a]">{dbNetworks.length} networks</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1a3a4a] text-[#7ab8cc] text-xs hover:border-[#00d4ff] hover:text-[#00d4ff] transition-colors">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1a3a4a] text-[#7ab8cc] text-xs hover:border-[#00d4ff] hover:text-[#00d4ff] transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Sync
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Networks", value: dbNetworks.length, color: "#00d4ff", icon: Wifi },
          { label: "Open Networks", value: dbNetworks.filter(n => n.security === "Open").length, color: "#ff3366", icon: Unlock },
          { label: "Unique Vendors", value: new Set(dbNetworks.map(n => n.vendor)).size, color: "#9b59ff", icon: Globe },
          { label: "Total Clients", value: dbNetworks.reduce((s, n) => s + n.clients, 0), color: "#00ff88", icon: Signal },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="cyber-card p-3 flex items-center gap-3">
              <Icon className="w-5 h-5 flex-shrink-0" style={{ color: stat.color }} />
              <div>
                <div className="text-xl font-black font-mono" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[10px] text-[#3d6b7a] uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 border-b border-[#1a3a4a]">
        {(["table", "analytics"] as const).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 text-xs uppercase tracking-widest transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
              activeView === view
                ? "border-[#00d4ff] text-[#00d4ff]"
                : "border-transparent text-[#3d6b7a] hover:text-[#7ab8cc]"
            }`}
          >
            {view === "table" ? <Database className="w-3 h-3" /> : <BarChart3 className="w-3 h-3" />}
            {view === "table" ? "Network Table" : "Analytics"}
          </button>
        ))}
      </div>

      {activeView === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Security Distribution */}
          <div className="cyber-card p-4">
            <h3 className="text-xs font-semibold text-[#e0f4ff] mb-4">Security Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={securityData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {securityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0d1f2d", border: "1px solid #1a3a4a", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {securityData.map(s => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[10px] text-[#3d6b7a]">{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Usage */}
          <div className="cyber-card p-4">
            <h3 className="text-xs font-semibold text-[#e0f4ff] mb-4">Channel Usage</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={channelData}>
                <XAxis dataKey="channel" tick={{ fill: "#3d6b7a", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#3d6b7a", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0d1f2d", border: "1px solid #1a3a4a", fontSize: "11px" }} />
                <Bar dataKey="count" fill="#00d4ff" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Vendor Distribution */}
          <div className="cyber-card p-4">
            <h3 className="text-xs font-semibold text-[#e0f4ff] mb-4">Vendor Distribution</h3>
            <div className="space-y-2">
              {vendorData.map((v) => (
                <div key={v.vendor} className="flex items-center gap-2">
                  <span className="text-[11px] text-[#7ab8cc] w-20 truncate">{v.vendor}</span>
                  <div className="flex-1 cyber-progress">
                    <div
                      className="cyber-progress-bar"
                      style={{ width: `${(v.count / dbNetworks.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#3d6b7a] w-4 text-right">{v.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === "table" && (
        <>
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 text-[#3d6b7a] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search SSID, BSSID, vendor..."
                className="cyber-input pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#3d6b7a]" />
              {["all", "open", "wpa2", "wpa3"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterSecurity(f)}
                  className={`px-2.5 py-1.5 rounded border text-[10px] uppercase tracking-wider transition-all ${
                    filterSecurity === f
                      ? "border-[rgba(0,212,255,0.5)] bg-[rgba(0,212,255,0.1)] text-[#00d4ff]"
                      : "border-[#1a3a4a] text-[#3d6b7a] hover:text-[#7ab8cc]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 p-3 rounded border border-[rgba(0,212,255,0.3)] bg-[rgba(0,212,255,0.05)]">
              <span className="text-xs text-[#00d4ff]">{selectedIds.size} selected</span>
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[rgba(255,51,102,0.3)] text-[#ff3366] text-[10px] hover:bg-[rgba(255,51,102,0.1)]">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[rgba(255,140,0,0.3)] text-[#ff8c00] text-[10px] hover:bg-[rgba(255,140,0,0.1)]">
                <Zap className="w-3 h-3" /> Scan Selected
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[rgba(0,212,255,0.3)] text-[#00d4ff] text-[10px] hover:bg-[rgba(0,212,255,0.1)]">
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
          )}

          {/* Table */}
          <div className="cyber-card overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-[#1a3a4a] bg-[#0d1f2d]">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  className="accent-[#00d4ff]"
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds(new Set(filtered.map(n => n.id)));
                    else setSelectedIds(new Set());
                  }}
                />
              </div>
              <div className="col-span-3 text-[10px] text-[#3d6b7a] uppercase tracking-widest">SSID / BSSID</div>
              <div className="col-span-2 text-[10px] text-[#3d6b7a] uppercase tracking-widest">Security</div>
              <button
                className="col-span-2 text-[10px] text-[#3d6b7a] uppercase tracking-widest text-left flex items-center gap-1"
                onClick={() => toggleSort("signal")}
              >
                Signal {sortBy === "signal" && (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
              </button>
              <button
                className="col-span-2 text-[10px] text-[#3d6b7a] uppercase tracking-widest text-left flex items-center gap-1"
                onClick={() => toggleSort("clients")}
              >
                Clients {sortBy === "clients" && (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
              </button>
              <div className="col-span-2 text-[10px] text-[#3d6b7a] uppercase tracking-widest">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#1a3a4a]">
              {filtered.map((network) => {
                const isExpanded = expandedId === network.id;
                const isSelected = selectedIds.has(network.id);
                return (
                  <div key={network.id} className={isSelected ? "bg-[rgba(0,212,255,0.03)]" : ""}>
                    <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(network.id)}
                          className="accent-[#00d4ff]"
                        />
                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-1.5">
                          {network.security === "Open" ? (
                            <Unlock className="w-3 h-3 text-[#ff3366] flex-shrink-0" />
                          ) : (
                            <Lock className="w-3 h-3 text-[#00d4ff] flex-shrink-0" />
                          )}
                          <span className="text-xs text-[#e0f4ff] truncate">{network.ssid}</span>
                        </div>
                        <div className="text-[10px] text-[#3d6b7a] font-mono mt-0.5">{network.bssid}</div>
                      </div>
                      <div className="col-span-2">
                        <span className={`cyber-badge text-[9px] ${network.security === "Open" ? "badge-critical" : network.security === "WPA3" ? "badge-low" : "badge-info"}`}>
                          {network.security}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className={`text-xs font-mono ${network.signal > -60 ? "text-[#00ff88]" : network.signal > -70 ? "text-[#ffd700]" : "text-[#ff8c00]"}`}>
                          {network.signal} dBm
                        </span>
                        <div className="text-[10px] text-[#3d6b7a]">Ch {network.channel}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs text-[#7ab8cc]">{network.clients}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : network.id)}
                          className="p-1 text-[#3d6b7a] hover:text-[#00d4ff] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 text-[#3d6b7a] hover:text-[#ff8c00] transition-colors">
                          <Zap className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 text-[#3d6b7a] hover:text-[#ff3366] transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <div className="px-4 pb-4 bg-[rgba(0,0,0,0.2)] border-t border-[#1a3a4a]">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
                          <div>
                            <div className="text-[10px] text-[#3d6b7a] mb-1">Vendor</div>
                            <div className="text-[#7ab8cc]">{network.vendor}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-[#3d6b7a] mb-1">Location</div>
                            <div className="flex items-center gap-1 text-[#7ab8cc]">
                              <MapPin className="w-3 h-3" />
                              {network.location}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-[#3d6b7a] mb-1">First Seen</div>
                            <div className="flex items-center gap-1 text-[#7ab8cc] font-mono text-[11px]">
                              <Clock className="w-3 h-3" />
                              {network.firstSeen}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-[#3d6b7a] mb-1">Coordinates</div>
                            <div className="text-[#7ab8cc] font-mono text-[11px]">{network.lat}°N {Math.abs(network.lng)}°W</div>
                          </div>
                          {network.notes && (
                            <div className="col-span-2 md:col-span-4">
                              <div className="text-[10px] text-[#3d6b7a] mb-1">Notes</div>
                              <div className="text-[#7ab8cc]">{network.notes}</div>
                            </div>
                          )}
                          {network.tags.length > 0 && (
                            <div className="col-span-2 md:col-span-4 flex flex-wrap gap-1.5">
                              {network.tags.map(tag => (
                                <span key={tag} className="cyber-badge badge-info text-[9px]">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
