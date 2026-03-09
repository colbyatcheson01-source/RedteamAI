"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  Wifi,
  Brain,
  Database,
  Bell,
  Lock,
  Globe,
  HardDrive,
  Palette,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Key,
  Server,
  Radio,
  Cpu,
  Monitor,
  Download,
  Info,
} from "lucide-react";

const sections = [
  { id: "general", label: "General", icon: Settings },
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "network", label: "Network & GPS", icon: Wifi },
  { id: "ai", label: "AI Engine", icon: Brain },
  { id: "security", label: "Security", icon: Shield },
  { id: "database", label: "Database", icon: Database },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-[#00d4ff]" : "bg-[#1a3a4a]"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [saved, setSaved] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(display-mode: standalone)").matches;
    }
    return false;
  });
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Listen for install prompt
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    (installPrompt as any).prompt();
    const { outcome } = await (installPrompt as any).userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  // Settings state
  const [settings, setSettings] = useState({
    // General
    operatorName: "RedOps Operator",
    sessionTimeout: "30",
    autoSave: true,
    telemetry: false,
    // Network
    gpsEnabled: true,
    gpsProvider: "device",
    wifiInterface: "wlan0",
    monitorMode: false,
    channelHop: true,
    hopInterval: "100",
    // AI
    defaultModel: "cloud-gpt4",
    openaiKey: "",
    anthropicKey: "",
    geminiKey: "",
    localModelPath: "/models/llama-3.1-8b.gguf",
    localModelEnabled: false,
    aiAutoAnalyze: true,
    aiSuggestExploits: true,
    aiAutoPayload: false,
    // Security
    encryptDatabase: true,
    masterPassword: "",
    vpnEnabled: false,
    vpnServer: "",
    proxyEnabled: false,
    proxyAddress: "",
    // Database
    dbPath: "/data/redops.db",
    autoBackup: true,
    backupInterval: "24",
    maxEntries: "10000",
    // Notifications
    notifyNewNetwork: true,
    notifyCriticalVuln: true,
    notifyPayloadSuccess: true,
    notifyAIInsight: false,
    // Appearance
    accentColor: "cyan",
    fontSize: "small",
    animationsEnabled: true,
    compactMode: false,
  });

  const update = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-[#e0f4ff] tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
            SYSTEM <span className="text-[#7ab8cc]">SETTINGS</span>
          </h1>
          <p className="text-[#3d6b7a] text-xs mt-0.5">Platform Configuration</p>
        </div>
        <button
          onClick={saveSettings}
          className={`flex items-center gap-2 px-4 py-2 rounded border font-semibold text-xs tracking-wider uppercase transition-all ${
            saved
              ? "border-[#00ff88] text-[#00ff88] bg-[rgba(0,255,136,0.1)]"
              : "border-[#00d4ff] text-[#00d4ff] bg-[rgba(0,212,255,0.1)] hover:bg-[rgba(0,212,255,0.2)]"
          }`}
        >
          {saved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-48 flex-shrink-0">
          <div className="cyber-card p-2 space-y-1">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-all text-left ${
                    activeSection === s.id
                      ? "bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] text-[#00d4ff]"
                      : "text-[#7ab8cc] hover:bg-[rgba(255,255,255,0.03)] border border-transparent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-xs font-medium">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeSection === "general" && (
            <div className="cyber-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-[#e0f4ff] border-b border-[#1a3a4a] pb-3">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">Operator Name</label>
                  <input type="text" value={settings.operatorName} onChange={e => update("operatorName", e.target.value)} className="cyber-input" />
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">Session Timeout (minutes)</label>
                  <input type="number" value={settings.sessionTimeout} onChange={e => update("sessionTimeout", e.target.value)} className="cyber-input" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff]">Auto-save sessions</div>
                    <div className="text-[10px] text-[#3d6b7a]">Automatically save scan results and sessions</div>
                  </div>
                  <Toggle value={settings.autoSave} onChange={v => update("autoSave", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff]">Anonymous telemetry</div>
                    <div className="text-[10px] text-[#3d6b7a]">Send anonymous usage data to improve the platform</div>
                  </div>
                  <Toggle value={settings.telemetry} onChange={v => update("telemetry", v)} />
                </div>
              </div>
            </div>
          )}

          {activeSection === "desktop" && (
            <div className="space-y-4">
              <div className="cyber-card p-5 space-y-5">
                <h2 className="text-sm font-semibold text-[#e0f4ff] border-b border-[#1a3a4a] pb-3">Desktop Installation</h2>
                <div className="space-y-4">
                  {isInstalled ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)]">
                      <CheckCircle className="w-5 h-5 text-[#00ff88]" />
                      <div>
                        <div className="text-xs text-[#00ff88] font-semibold">Installed as Desktop App</div>
                        <div className="text-[10px] text-[#3d6b7a]">RedOps is running as a standalone application</div>
                      </div>
                    </div>
                  ) : installPrompt ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)]">
                        <Monitor className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs text-[#00d4ff] font-semibold">Install RedOps Desktop App</div>
                          <div className="text-[10px] text-[#3d6b7a] mt-1">Get the full desktop experience with offline capability, system tray, and native performance.</div>
                        </div>
                      </div>
                      <button
                        onClick={handleInstall}
                        className="w-full btn-cyber flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Install Desktop App
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-[rgba(255,140,0,0.1)] border border-[rgba(255,140,0,0.3)]">
                      <Info className="w-5 h-5 text-[#ff8c00] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-[#ff8c00] font-semibold">Installation not available</div>
                        <div className="text-[10px] text-[#3d6b7a] mt-1">Desktop installation is only available when accessing via a supported browser (Chrome, Edge, Brave).</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="cyber-card p-5 space-y-5">
                <h2 className="text-sm font-semibold text-[#e0f4ff] border-b border-[#1a3a4a] pb-3">Version Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-[#7ab8cc]">Application Version</span>
                    <span className="text-xs text-[#e0f4ff] font-mono">1.0.0</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-[#7ab8cc]">Platform</span>
                    <span className="text-xs text-[#e0f4ff] font-mono">Web (PWA)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-[#7ab8cc]">Build Date</span>
                    <span className="text-xs text-[#e0f4ff] font-mono">2026-03-09</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-[#1a3a4a]">
                    <span className="text-xs text-[#7ab8cc]">Manifest Version</span>
                    <span className="text-xs text-[#00ff88] font-mono">✓ v1.0.0</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "network" && (
            <div className="cyber-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-[#e0f4ff] border-b border-[#1a3a4a] pb-3">Network & GPS Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff] flex items-center gap-1.5"><Radio className="w-3 h-3 text-[#00d4ff]" /> GPS Enabled</div>
                    <div className="text-[10px] text-[#3d6b7a]">Enable GPS location tracking for war driving</div>
                  </div>
                  <Toggle value={settings.gpsEnabled} onChange={v => update("gpsEnabled", v)} />
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">GPS Provider</label>
                  <select value={settings.gpsProvider} onChange={e => update("gpsProvider", e.target.value)} className="cyber-input">
                    <option value="device">Device GPS</option>
                    <option value="external">External USB GPS</option>
                    <option value="network">Network Location</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">WiFi Interface</label>
                  <input type="text" value={settings.wifiInterface} onChange={e => update("wifiInterface", e.target.value)} className="cyber-input font-mono" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff]">Monitor Mode</div>
                    <div className="text-[10px] text-[#3d6b7a]">Enable promiscuous packet capture</div>
                  </div>
                  <Toggle value={settings.monitorMode} onChange={v => update("monitorMode", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff]">Channel Hopping</div>
                    <div className="text-[10px] text-[#3d6b7a]">Automatically hop between WiFi channels</div>
                  </div>
                  <Toggle value={settings.channelHop} onChange={v => update("channelHop", v)} />
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">Hop Interval (ms)</label>
                  <input type="number" value={settings.hopInterval} onChange={e => update("hopInterval", e.target.value)} className="cyber-input" />
                </div>
              </div>
            </div>
          )}

          {activeSection === "ai" && (
            <div className="space-y-4">
              <div className="cyber-card p-5 space-y-4">
                <h2 className="text-sm font-semibold text-[#e0f4ff] border-b border-[#1a3a4a] pb-3">Cloud AI Settings</h2>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">Default Model</label>
                  <select value={settings.defaultModel} onChange={e => update("defaultModel", e.target.value)} className="cyber-input">
                    <option value="cloud-gpt4">GPT-4o (OpenAI)</option>
                    <option value="cloud-claude">Claude 3.5 (Anthropic)</option>
                    <option value="cloud-gemini">Gemini Pro (Google)</option>
                    <option value="local-llama">Llama 3.1 (Local)</option>
                    <option value="local-mistral">Mistral 7B (Local)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5 flex items-center gap-1.5"><Key className="w-3 h-3" /> OpenAI API Key</label>
                  <input type="password" value={settings.openaiKey} onChange={e => update("openaiKey", e.target.value)} placeholder="sk-..." className="cyber-input font-mono" />
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5 flex items-center gap-1.5"><Key className="w-3 h-3" /> Anthropic API Key</label>
                  <input type="password" value={settings.anthropicKey} onChange={e => update("anthropicKey", e.target.value)} placeholder="sk-ant-..." className="cyber-input font-mono" />
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5 flex items-center gap-1.5"><Key className="w-3 h-3" /> Google Gemini API Key</label>
                  <input type="password" value={settings.geminiKey} onChange={e => update("geminiKey", e.target.value)} placeholder="AIza..." className="cyber-input font-mono" />
                </div>
              </div>

              <div className="cyber-card p-5 space-y-4">
                <h2 className="text-sm font-semibold text-[#e0f4ff] border-b border-[#1a3a4a] pb-3">Local AI Settings</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff] flex items-center gap-1.5"><HardDrive className="w-3 h-3 text-[#00ff88]" /> Local Model Enabled</div>
                    <div className="text-[10px] text-[#3d6b7a]">Run AI inference locally (requires GGUF model)</div>
                  </div>
                  <Toggle value={settings.localModelEnabled} onChange={v => update("localModelEnabled", v)} />
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">Model Path</label>
                  <input type="text" value={settings.localModelPath} onChange={e => update("localModelPath", e.target.value)} className="cyber-input font-mono text-xs" />
                </div>
              </div>

              <div className="cyber-card p-5 space-y-4">
                <h2 className="text-sm font-semibold text-[#e0f4ff] border-b border-[#1a3a4a] pb-3">AI Behavior</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff]">Auto-analyze scan results</div>
                    <div className="text-[10px] text-[#3d6b7a]">Automatically analyze vulnerabilities with AI</div>
                  </div>
                  <Toggle value={settings.aiAutoAnalyze} onChange={v => update("aiAutoAnalyze", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff]">Suggest exploits</div>
                    <div className="text-[10px] text-[#3d6b7a]">AI suggests exploits for discovered vulnerabilities</div>
                  </div>
                  <Toggle value={settings.aiSuggestExploits} onChange={v => update("aiSuggestExploits", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff] flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-[#ff8c00]" /> Auto-generate payloads
                    </div>
                    <div className="text-[10px] text-[#3d6b7a]">AI automatically generates payloads (use with caution)</div>
                  </div>
                  <Toggle value={settings.aiAutoPayload} onChange={v => update("aiAutoPayload", v)} />
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="cyber-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-[#e0f4ff] border-b border-[#1a3a4a] pb-3">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff] flex items-center gap-1.5"><Lock className="w-3 h-3 text-[#00d4ff]" /> Encrypt Database</div>
                    <div className="text-[10px] text-[#3d6b7a]">AES-256 encryption for stored network data</div>
                  </div>
                  <Toggle value={settings.encryptDatabase} onChange={v => update("encryptDatabase", v)} />
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">Master Password</label>
                  <input type="password" value={settings.masterPassword} onChange={e => update("masterPassword", e.target.value)} placeholder="Set encryption password..." className="cyber-input" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff] flex items-center gap-1.5"><Globe className="w-3 h-3 text-[#9b59ff]" /> VPN Enabled</div>
                    <div className="text-[10px] text-[#3d6b7a]">Route traffic through VPN for anonymity</div>
                  </div>
                  <Toggle value={settings.vpnEnabled} onChange={v => update("vpnEnabled", v)} />
                </div>
                {settings.vpnEnabled && (
                  <div>
                    <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">VPN Server</label>
                    <input type="text" value={settings.vpnServer} onChange={e => update("vpnServer", e.target.value)} placeholder="vpn.example.com:1194" className="cyber-input font-mono" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff] flex items-center gap-1.5"><Server className="w-3 h-3 text-[#ffd700]" /> Proxy Enabled</div>
                    <div className="text-[10px] text-[#3d6b7a]">Route requests through SOCKS5/HTTP proxy</div>
                  </div>
                  <Toggle value={settings.proxyEnabled} onChange={v => update("proxyEnabled", v)} />
                </div>
                {settings.proxyEnabled && (
                  <div>
                    <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">Proxy Address</label>
                    <input type="text" value={settings.proxyAddress} onChange={e => update("proxyAddress", e.target.value)} placeholder="socks5://127.0.0.1:9050" className="cyber-input font-mono" />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "database" && (
            <div className="cyber-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-[#e0f4ff] border-b border-[#1a3a4a] pb-3">Database Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">Database Path</label>
                  <input type="text" value={settings.dbPath} onChange={e => update("dbPath", e.target.value)} className="cyber-input font-mono text-xs" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff]">Auto Backup</div>
                    <div className="text-[10px] text-[#3d6b7a]">Automatically backup database</div>
                  </div>
                  <Toggle value={settings.autoBackup} onChange={v => update("autoBackup", v)} />
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">Backup Interval (hours)</label>
                  <input type="number" value={settings.backupInterval} onChange={e => update("backupInterval", e.target.value)} className="cyber-input" />
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">Max Entries</label>
                  <input type="number" value={settings.maxEntries} onChange={e => update("maxEntries", e.target.value)} className="cyber-input" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="btn-cyber text-[10px] flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3" /> Backup Now
                  </button>
                  <button className="btn-cyber btn-cyber-red text-[10px] flex items-center gap-1.5">
                    <Database className="w-3 h-3" /> Clear Database
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="cyber-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-[#e0f4ff] border-b border-[#1a3a4a] pb-3">Notification Settings</h2>
              <div className="space-y-4">
                {[
                  { key: "notifyNewNetwork", label: "New network discovered", desc: "Alert when a new WiFi network is found" },
                  { key: "notifyCriticalVuln", label: "Critical vulnerability found", desc: "Alert on CVSS 9.0+ vulnerabilities" },
                  { key: "notifyPayloadSuccess", label: "Payload delivery success", desc: "Alert when payload is successfully staged" },
                  { key: "notifyAIInsight", label: "AI insights available", desc: "Alert when AI completes analysis" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#e0f4ff]">{item.label}</div>
                      <div className="text-[10px] text-[#3d6b7a]">{item.desc}</div>
                    </div>
                    <Toggle
                      value={settings[item.key as keyof typeof settings] as boolean}
                      onChange={v => update(item.key, v)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="cyber-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-[#e0f4ff] border-b border-[#1a3a4a] pb-3">Appearance Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-2">Accent Color</label>
                  <div className="flex gap-2">
                    {[
                      { id: "cyan", color: "#00d4ff" },
                      { id: "green", color: "#00ff88" },
                      { id: "red", color: "#ff3366" },
                      { id: "purple", color: "#9b59ff" },
                      { id: "orange", color: "#ff8c00" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => update("accentColor", c.id)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${settings.accentColor === c.id ? "scale-110" : "border-transparent"}`}
                        style={{ background: c.color, borderColor: settings.accentColor === c.id ? "white" : "transparent" }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">Font Size</label>
                  <select value={settings.fontSize} onChange={e => update("fontSize", e.target.value)} className="cyber-input">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff]">Animations</div>
                    <div className="text-[10px] text-[#3d6b7a]">Enable UI animations and transitions</div>
                  </div>
                  <Toggle value={settings.animationsEnabled} onChange={v => update("animationsEnabled", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#e0f4ff]">Compact Mode</div>
                    <div className="text-[10px] text-[#3d6b7a]">Reduce padding for smaller screens</div>
                  </div>
                  <Toggle value={settings.compactMode} onChange={v => update("compactMode", v)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
