"use client";

import { useState, useRef } from "react";
import {
  Bug,
  Play,
  Square,
  Target,
  AlertTriangle,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  Cpu,
  Network,
  Lock,
  Globe,
  Server,
  Zap,
  Wifi,
  Signal,
  Eye,
} from "lucide-react";

const scanProfiles = [
  { id: "quick", label: "Quick Scan", desc: "Top 1000 ports, basic vuln check", time: "~2 min" },
  { id: "full", label: "Full Scan", desc: "All 65535 ports, deep analysis", time: "~15 min" },
  { id: "stealth", label: "Stealth Scan", desc: "SYN scan, IDS evasion", time: "~5 min" },
  { id: "vuln", label: "Vuln Scan", desc: "CVE database check + exploit search", time: "~8 min" },
  { id: "web", label: "Web App Scan", desc: "HTTP/HTTPS, SQLi, XSS, CSRF", time: "~10 min" },
];

const mockVulns = [
  {
    id: 1, cve: "CVE-2024-1234", title: "Remote Code Execution via Buffer Overflow",
    severity: "critical", cvss: 9.8, port: 22, service: "OpenSSH 7.4",
    description: "A buffer overflow vulnerability in OpenSSH allows unauthenticated remote code execution.",
    solution: "Upgrade to OpenSSH 8.9 or later. Apply vendor patch immediately.",
    exploitAvailable: true, exploitDB: "EDB-51234",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-1234"],
  },
  {
    id: 2, cve: "CVE-2023-44487", title: "HTTP/2 Rapid Reset Attack (DoS)",
    severity: "high", cvss: 7.5, port: 443, service: "nginx 1.18.0",
    description: "HTTP/2 protocol allows rapid stream resets causing denial of service.",
    solution: "Update nginx to 1.25.3+. Configure max concurrent streams limit.",
    exploitAvailable: true, exploitDB: "EDB-51890",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2023-44487"],
  },
  {
    id: 3, cve: "CVE-2023-4911", title: "GNU C Library Buffer Overflow (Looney Tunables)",
    severity: "high", cvss: 7.8, port: null, service: "glibc 2.35",
    description: "Local privilege escalation via buffer overflow in glibc dynamic loader.",
    solution: "Update glibc to 2.38-4 or later. Apply OS security patches.",
    exploitAvailable: true, exploitDB: "EDB-51945",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2023-4911"],
  },
  {
    id: 4, cve: "CVE-2024-3094", title: "XZ Utils Backdoor",
    severity: "critical", cvss: 10.0, port: 22, service: "xz 5.6.0",
    description: "Malicious backdoor in XZ Utils allows unauthorized SSH access bypass.",
    solution: "Downgrade to xz-utils 5.4.x immediately. Audit all SSH access logs.",
    exploitAvailable: false, exploitDB: null,
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-3094"],
  },
  {
    id: 5, cve: "CVE-2023-38408", title: "OpenSSH Remote Code Execution",
    severity: "critical", cvss: 9.8, port: 22, service: "OpenSSH 9.3",
    description: "Remote code execution in ssh-agent via PKCS#11 provider loading.",
    solution: "Update to OpenSSH 9.3p2 or later.",
    exploitAvailable: true, exploitDB: "EDB-51812",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2023-38408"],
  },
  {
    id: 6, cve: "CVE-2024-0056", title: "Microsoft SQL Server TLS Bypass",
    severity: "medium", cvss: 5.9, port: 1433, service: "MSSQL 2019",
    description: "TLS/SSL certificate validation bypass in SQL Server connection.",
    solution: "Apply Microsoft Security Update KB5033592.",
    exploitAvailable: false, exploitDB: null,
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-0056"],
  },
];

const terminalLines = [
  { type: "prompt", text: "$ nmap -sV -sC -O --script vuln 192.168.1.105" },
  { type: "info", text: "Starting Nmap 7.94 ( https://nmap.org )" },
  { type: "output", text: "Nmap scan report for 192.168.1.105" },
  { type: "output", text: "Host is up (0.0023s latency)." },
  { type: "output", text: "Not shown: 994 closed tcp ports (reset)" },
  { type: "output", text: "PORT     STATE SERVICE    VERSION" },
  { type: "success", text: "22/tcp   open  ssh        OpenSSH 7.4 (protocol 2.0)" },
  { type: "success", text: "80/tcp   open  http       Apache httpd 2.4.6" },
  { type: "success", text: "443/tcp  open  ssl/https  nginx 1.18.0" },
  { type: "success", text: "1433/tcp open  ms-sql-s   Microsoft SQL Server 2019" },
  { type: "warning", text: "| vuln: CVE-2024-1234 - VULNERABLE" },
  { type: "warning", text: "| vuln: CVE-2023-44487 - VULNERABLE" },
  { type: "error", text: "| CRITICAL: CVE-2024-3094 XZ Utils Backdoor DETECTED" },
  { type: "info", text: "OS detection: Linux 5.4 - 5.15 (96%)" },
  { type: "success", text: "Nmap done: 1 IP address (1 host up) scanned in 47.23 seconds" },
];

// Nearby available networks for discovery
const nearbyNetworks = [
  { ip: "192.168.1.1", hostname: "router.local", mac: "00:1A:2B:3C:4D:5E", vendor: "Cisco Systems", type: "Gateway/Router", signal: -45, openPorts: 2, services: ["HTTP", "SSH", "TELNET"] },
  { ip: "192.168.1.105", hostname: "webserver-prod", mac: "AA:BB:CC:DD:EE:FF", vendor: "Dell Inc.", type: "Server", signal: -52, openPorts: 5, services: ["HTTP", "HTTPS", "SSH", "MySQL", "RDP"] },
  { ip: "192.168.1.142", hostname: "dev-machine", mac: "11:22:33:44:55:66", vendor: "HP", type: "Workstation", signal: -58, openPorts: 3, services: ["HTTP", "SSH", "VNC"] },
  { ip: "192.168.1.178", hostname: "iot-camera-01", mac: "A1:B2:C3:D4:E5:F6", vendor: "Hikvision", type: "IoT Device", signal: -65, openPorts: 2, services: ["RTSP", "HTTP"] },
  { ip: "192.168.1.201", hostname: "printer-office", mac: "FF:EE:DD:CC:BB:AA", vendor: "Brother", type: "Printer", signal: -71, openPorts: 1, services: ["HTTP", "IPP"] },
  { ip: "192.168.1.223", hostname: "nas-storage", mac: "12:34:56:78:9A:BC", vendor: "Synology", type: "NAS", signal: -68, openPorts: 4, services: ["SMB", "HTTP", "SSH", "AFP"] },
  { ip: "192.168.1.88", hostname: "win-ad-server", mac: "DE:AD:BE:EF:CA:FE", vendor: "Microsoft", type: "Domain Controller", signal: -48, openPorts: 8, services: ["LDAP", "Kerberos", "DNS", "SMB", "RPC", "HTTP", "HTTPS", "WinRM"] },
  { ip: "192.168.1.254", hostname: "ipcam-hub", mac: "FE:DC:BA:98:76:54", vendor: "Ubiquiti", type: "NVR System", signal: -72, openPorts: 3, services: ["RTSP", "HTTP", "ONVIF"] },
];

const severityConfig: Record<string, { color: string; bg: string; border: string; badge: string }> = {
  critical: { color: "#ff3366", bg: "rgba(255,51,102,0.05)", border: "rgba(255,51,102,0.2)", badge: "badge-critical" },
  high: { color: "#ff8c00", bg: "rgba(255,140,0,0.05)", border: "rgba(255,140,0,0.2)", badge: "badge-high" },
  medium: { color: "#ffd700", bg: "rgba(255,215,0,0.05)", border: "rgba(255,215,0,0.2)", badge: "badge-medium" },
  low: { color: "#00ff88", bg: "rgba(0,255,136,0.05)", border: "rgba(0,255,136,0.2)", badge: "badge-low" },
};

export default function ScannerPage() {
  const [target, setTarget] = useState("192.168.1.105");
  const [profile, setProfile] = useState("vuln");
  const [isScanning, setIsScanning] = useState(false);
  const [scanDone, setScanDone] = useState(true);
  const [expandedVuln, setExpandedVuln] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"results" | "terminal">("results");
  const [terminalIdx, setTerminalIdx] = useState(terminalLines.length);
  const [copied, setCopied] = useState<string | null>(null);
  const [showNearby, setShowNearby] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [discoveredNetworks, setDiscoveredNetworks] = useState<typeof nearbyNetworks>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const scanRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScan = () => {
    setIsScanning(true);
    setScanDone(false);
    setTerminalIdx(0);
    setActiveTab("terminal");
    let idx = 0;
    scanRef.current = setInterval(() => {
      idx++;
      setTerminalIdx(idx);
      if (idx >= terminalLines.length) {
        clearInterval(scanRef.current!);
        setIsScanning(false);
        setScanDone(true);
        setActiveTab("results");
      }
    }, 300);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Discover nearby networks
  const discoverNetworks = () => {
    setDiscovering(true);
    setShowNearby(true);
    setDiscoveredNetworks([]);
    
    // Simulate network discovery with staggered results
    let idx = 0;
    const discoveryInterval = setInterval(() => {
      if (idx < nearbyNetworks.length) {
        setDiscoveredNetworks(prev => [...prev, nearbyNetworks[idx]]);
        idx++;
      } else {
        clearInterval(discoveryInterval);
        setDiscovering(false);
      }
    }, 400);
  };

  // Select a network from discovered list
  const selectNetwork = (network: typeof nearbyNetworks[0]) => {
    setTarget(network.ip);
    setSelectedNetwork(network.ip);
    setShowNearby(false);
  };

  const criticalCount = mockVulns.filter(v => v.severity === "critical").length;
  const highCount = mockVulns.filter(v => v.severity === "high").length;
  const mediumCount = mockVulns.filter(v => v.severity === "medium").length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#e0f4ff] tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
            VULNERABILITY <span className="text-[#ff8c00]">SCANNER</span>
          </h1>
          <p className="text-[#3d6b7a] text-xs mt-0.5">CVE Detection & Exploit Discovery</p>
        </div>
        {scanDone && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.05)]">
            <CheckCircle className="w-3.5 h-3.5 text-[#00ff88]" />
            <span className="text-xs text-[#00ff88]">Scan Complete</span>
          </div>
        )}
      </div>

      {/* Scan Config */}
      <div className="cyber-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target */}
          <div className="md:col-span-1">
            <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-2">Target</label>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#ff8c00] flex-shrink-0" />
              <input
                type="text"
                value={target}
                onChange={(e) => { setTarget(e.target.value); setSelectedNetwork(null); }}
                placeholder="IP, range, or hostname"
                className="cyber-input"
              />
            </div>
            
            {/* Discover Nearby Button */}
            <button
              onClick={discoverNetworks}
              disabled={discovering}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-3 rounded border border-[#00d4ff] text-[#00d4ff] text-xs hover:bg-[rgba(0,212,255,0.1)] transition-all"
            >
              {discovering ? (
                <><Signal className="w-3 h-3 animate-pulse" /> Discovering...</>
              ) : (
                <><Wifi className="w-3 h-3" /> Scan for Nearby Targets</>
              )}
            </button>

            {/* Nearby Networks Dropdown */}
            {showNearby && (
              <div className="mt-2 border border-[#1a3a4a] rounded bg-[#0a1520] max-h-64 overflow-y-auto">
                <div className="sticky top-0 bg-[#0f1f2a] px-3 py-2 border-b border-[#1a3a4a] flex items-center justify-between">
                  <span className="text-[10px] text-[#7ab8cc] uppercase tracking-wider">
                    Discovered {discoveredNetworks.length}/{nearbyNetworks.length}
                  </span>
                  <button onClick={() => setShowNearby(false)} className="text-[#3d6b7a] hover:text-[#ff3366]">
                    <Square className="w-3 h-3" />
                  </button>
                </div>
                {discoveredNetworks.length === 0 && !discovering && (
                  <div className="p-4 text-center text-[#3d6b7a] text-xs">
                    Click scan to discover nearby targets
                  </div>
                )}
                {discoveredNetworks.map((network) => (
                  <div
                    key={network.ip}
                    onClick={() => selectNetwork(network)}
                    className={`px-3 py-2 cursor-pointer border-b border-[#1a3a4a] last:border-b-0 transition-all hover:bg-[rgba(0,212,255,0.05)] ${
                      selectedNetwork === network.ip ? "bg-[rgba(0,212,255,0.15)] border-l-2 border-l-[#00d4ff]" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Network className="w-3 h-3 text-[#00d4ff]" />
                        <span className="text-xs font-mono text-[#e0f4ff]">{network.ip}</span>
                        {network.signal && (
                          <Signal className="w-3 h-3" style={{ color: network.signal > -50 ? "#00ff88" : network.signal > -65 ? "#ff8c00" : "#ff3366" }} />
                        )}
                      </div>
                      <span className="text-[9px] text-[#3d6b7a]">{network.vendor}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-[#7ab8cc]">{network.hostname}</span>
                      <span className="text-[9px] text-[#3d6b7a]">•</span>
                      <span className="text-[9px] text-[#3d6b7a]">{network.type}</span>
                      <span className="text-[9px] text-[#3d6b7a]">•</span>
                      <span className="text-[9px] text-[#ff8c00]">{network.openPorts} ports</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {network.services.slice(0, 4).map((service) => (
                        <span key={service} className="px-1.5 py-0.5 rounded bg-[rgba(0,255,136,0.1)] text-[9px] text-[#00ff88]">
                          {service}
                        </span>
                      ))}
                      {network.services.length > 4 && (
                        <span className="text-[9px] text-[#3d6b7a]">+{network.services.length - 4}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scan Profile */}
          <div className="md:col-span-1">
            <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-2">Scan Profile</label>
            <div className="grid grid-cols-1 gap-1.5">
              {scanProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfile(p.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded border text-left transition-all ${
                    profile === p.id
                      ? "border-[rgba(255,140,0,0.5)] bg-[rgba(255,140,0,0.1)] text-[#ff8c00]"
                      : "border-[#1a3a4a] text-[#3d6b7a] hover:border-[#1a3a4a] hover:text-[#7ab8cc]"
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{p.label}</div>
                    <div className="text-[10px] opacity-70">{p.desc}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] opacity-60">
                    <Clock className="w-3 h-3" />
                    {p.time}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options + Launch */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <div>
              <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-2">Options</label>
              <div className="space-y-2">
                {[
                  { label: "OS Detection", icon: Cpu, default: true },
                  { label: "Service Version", icon: Server, default: true },
                  { label: "Script Scan", icon: Globe, default: true },
                  { label: "Aggressive Mode", icon: Zap, default: false },
                  { label: "Stealth (SYN)", icon: Lock, default: false },
                  { label: "IPv6 Support", icon: Network, default: false },
                ].map((opt) => (
                  <label key={opt.label} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked={opt.default} className="accent-[#00d4ff] w-3 h-3" />
                    <opt.icon className="w-3 h-3 text-[#3d6b7a] group-hover:text-[#7ab8cc]" />
                    <span className="text-xs text-[#7ab8cc]">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={startScan}
              disabled={isScanning}
              className={`mt-auto flex items-center justify-center gap-2 py-3 rounded border font-semibold text-sm tracking-wider uppercase transition-all ${
                isScanning
                  ? "border-[#1a3a4a] text-[#3d6b7a] cursor-not-allowed"
                  : "border-[#ff8c00] text-[#ff8c00] bg-[rgba(255,140,0,0.1)] hover:bg-[rgba(255,140,0,0.2)]"
              }`}
            >
              {isScanning ? (
                <><Cpu className="w-4 h-4 animate-rotate" /> Scanning...</>
              ) : (
                <><Play className="w-4 h-4" /> Launch Scan</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {(scanDone || isScanning) && (
        <>
          {/* Summary */}
          {scanDone && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="cyber-card p-3 text-center">
                <div className="text-2xl font-black text-[#ff3366] font-mono">{criticalCount}</div>
                <div className="text-[10px] text-[#3d6b7a] uppercase tracking-wider mt-1">Critical</div>
              </div>
              <div className="cyber-card p-3 text-center">
                <div className="text-2xl font-black text-[#ff8c00] font-mono">{highCount}</div>
                <div className="text-[10px] text-[#3d6b7a] uppercase tracking-wider mt-1">High</div>
              </div>
              <div className="cyber-card p-3 text-center">
                <div className="text-2xl font-black text-[#ffd700] font-mono">{mediumCount}</div>
                <div className="text-[10px] text-[#3d6b7a] uppercase tracking-wider mt-1">Medium</div>
              </div>
              <div className="cyber-card p-3 text-center">
                <div className="text-2xl font-black text-[#00ff88] font-mono">{mockVulns.filter(v => v.exploitAvailable).length}</div>
                <div className="text-[10px] text-[#3d6b7a] uppercase tracking-wider mt-1">Exploitable</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#1a3a4a]">
            {(["results", "terminal"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[#ff8c00] text-[#ff8c00]"
                    : "border-transparent text-[#3d6b7a] hover:text-[#7ab8cc]"
                }`}
              >
                {tab === "results" ? "Vulnerabilities" : "Terminal Output"}
              </button>
            ))}
          </div>

          {/* Terminal */}
          {activeTab === "terminal" && (
            <div className="terminal h-80 overflow-y-auto">
              {terminalLines.slice(0, terminalIdx).map((line, i) => (
                <div key={i} className={`terminal-line terminal-${line.type}`}>
                  {line.text}
                  {i === terminalIdx - 1 && isScanning && <span className="animate-blink">_</span>}
                </div>
              ))}
            </div>
          )}

          {/* Vulnerability List */}
          {activeTab === "results" && (
            <div className="space-y-3">
              {mockVulns.map((vuln) => {
                const cfg = severityConfig[vuln.severity];
                const isExpanded = expandedVuln === vuln.id;
                return (
                  <div
                    key={vuln.id}
                    className="cyber-card overflow-hidden"
                    style={{ borderColor: cfg.border, background: cfg.bg }}
                  >
                    <div
                      className="p-4 cursor-pointer flex items-start gap-3"
                      onClick={() => setExpandedVuln(isExpanded ? null : vuln.id)}
                    >
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: cfg.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`cyber-badge ${cfg.badge}`}>{vuln.severity.toUpperCase()}</span>
                          <span className="text-[10px] font-mono text-[#7ab8cc]">{vuln.cve}</span>
                          <span className="text-[10px] text-[#3d6b7a]">CVSS: <span style={{ color: cfg.color }}>{vuln.cvss}</span></span>
                          {vuln.exploitAvailable && (
                            <span className="cyber-badge badge-critical text-[9px]">EXPLOIT AVAILABLE</span>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-[#e0f4ff]">{vuln.title}</div>
                        <div className="text-[11px] text-[#3d6b7a] mt-0.5">
                          {vuln.port && `Port ${vuln.port} • `}{vuln.service}
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#3d6b7a] flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#3d6b7a] flex-shrink-0" />}
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-[#1a3a4a] pt-3 space-y-3">
                        <div>
                          <div className="text-[10px] text-[#3d6b7a] uppercase tracking-widest mb-1">Description</div>
                          <p className="text-xs text-[#7ab8cc] leading-relaxed">{vuln.description}</p>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#3d6b7a] uppercase tracking-widest mb-1">Remediation</div>
                          <p className="text-xs text-[#00ff88] leading-relaxed">{vuln.solution}</p>
                        </div>
                        {vuln.exploitDB && (
                          <div>
                            <div className="text-[10px] text-[#3d6b7a] uppercase tracking-widest mb-1">Exploit Reference</div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-[#ff3366]">{vuln.exploitDB}</span>
                              <button
                                onClick={() => copyToClipboard(vuln.exploitDB!, vuln.cve)}
                                className="p-1 text-[#3d6b7a] hover:text-[#00d4ff]"
                              >
                                {copied === vuln.cve ? <CheckCircle className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button className="btn-cyber btn-cyber-red text-[10px] flex items-center gap-1.5">
                            <Zap className="w-3 h-3" /> Send to Payloads
                          </button>
                          <button className="btn-cyber text-[10px] flex items-center gap-1.5">
                            <ExternalLink className="w-3 h-3" /> View CVE
                          </button>
                          <button className="btn-cyber text-[10px] flex items-center gap-1.5">
                            <Shield className="w-3 h-3" /> AI Analysis
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
