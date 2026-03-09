"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Wifi,
  Bug,
  Zap,
  Brain,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Radio,
  Lock,
  Unlock,
  Eye,
  ChevronRight,
  Globe,
  Cpu,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const activityData = [
  { time: "00:00", scans: 2, vulns: 0, networks: 1 },
  { time: "04:00", scans: 5, vulns: 2, networks: 3 },
  { time: "08:00", scans: 12, vulns: 4, networks: 8 },
  { time: "12:00", scans: 18, vulns: 7, networks: 12 },
  { time: "16:00", scans: 24, vulns: 11, networks: 18 },
  { time: "20:00", scans: 31, vulns: 14, networks: 22 },
  { time: "Now", scans: 38, vulns: 17, networks: 27 },
];

const recentActivity = [
  { type: "scan", message: "Vulnerability scan completed on 192.168.1.0/24", time: "2m ago", severity: "high" },
  { type: "network", message: "New network discovered: SSID 'CoffeeShop_5G'", time: "8m ago", severity: "info" },
  { type: "vuln", message: "CVE-2024-1234 detected on target host", time: "15m ago", severity: "critical" },
  { type: "ai", message: "AI identified 3 potential attack vectors", time: "22m ago", severity: "warning" },
  { type: "payload", message: "Payload delivery successful on test target", time: "1h ago", severity: "success" },
  { type: "network", message: "GPS lock acquired — 47 networks mapped", time: "2h ago", severity: "info" },
];

const quickActions = [
  { href: "/wardriving", label: "Start War Drive", icon: Wifi, color: "#00ff88", bg: "rgba(0,255,136,0.1)", border: "rgba(0,255,136,0.3)" },
  { href: "/scanner", label: "Quick Scan", icon: Bug, color: "#ff8c00", bg: "rgba(255,140,0,0.1)", border: "rgba(255,140,0,0.3)" },
  { href: "/payloads", label: "Deploy Payload", icon: Zap, color: "#ff3366", bg: "rgba(255,51,102,0.1)", border: "rgba(255,51,102,0.3)" },
  { href: "/ai", label: "AI Analysis", icon: Brain, color: "#9b59ff", bg: "rgba(155,89,255,0.1)", border: "rgba(155,89,255,0.3)" },
];

const severityColor: Record<string, string> = {
  critical: "#ff3366",
  high: "#ff8c00",
  warning: "#ffd700",
  info: "#00d4ff",
  success: "#00ff88",
};

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [scanCount, setScanCount] = useState(0);
  const [networkCount, setNetworkCount] = useState(0);
  const [vulnCount, setVulnCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Animate counters
    const duration = 1500;
    const steps = 60;
    const targets = { scans: 38, networks: 247, vulns: 17 };
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setScanCount(Math.floor(targets.scans * progress));
      setNetworkCount(Math.floor(targets.networks * progress));
      setVulnCount(Math.floor(targets.vulns * progress));
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-black text-[#e0f4ff] tracking-widest"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            OPERATIONS <span className="text-[#00d4ff]">CENTER</span>
          </h1>
          <p className="text-[#3d6b7a] text-sm mt-1">Red Team Command Dashboard</p>
        </div>
        <div className="text-right">
          <div className="text-[#00d4ff] font-mono text-lg font-bold">
            {time.toLocaleTimeString("en-US", { hour12: false })}
          </div>
          <div className="text-[#3d6b7a] text-xs">
            {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="cyber-card p-3 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="status-dot status-active animate-pulse-glow" />
          <span className="text-xs text-[#00ff88]">SYSTEM ONLINE</span>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-3 h-3 text-[#00d4ff]" />
          <span className="text-xs text-[#7ab8cc]">GPS: 40.7128°N 74.0060°W</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-[#9b59ff]" />
          <span className="text-xs text-[#7ab8cc]">AI Engine: Active</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-[#ff8c00]" />
          <span className="text-xs text-[#7ab8cc]">Cloud: Connected</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <AlertTriangle className="w-3 h-3 text-[#ff8c00]" />
          <span className="text-[10px] text-[#ff8c00] uppercase tracking-wider">Authorized Use Only</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-[#3d6b7a] uppercase tracking-widest">Networks Found</span>
            <Wifi className="w-4 h-4 text-[#00ff88]" />
          </div>
          <div className="text-3xl font-black text-[#00ff88] font-mono">{networkCount}</div>
          <div className="text-[10px] text-[#3d6b7a] mt-1">+12 today</div>
          <div className="cyber-progress mt-3">
            <div className="cyber-progress-bar bg-[#00ff88]" style={{ width: "68%", background: "#00ff88" }} />
          </div>
        </div>

        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-[#3d6b7a] uppercase tracking-widest">Scans Run</span>
            <Activity className="w-4 h-4 text-[#00d4ff]" />
          </div>
          <div className="text-3xl font-black text-[#00d4ff] font-mono">{scanCount}</div>
          <div className="text-[10px] text-[#3d6b7a] mt-1">+5 today</div>
          <div className="cyber-progress mt-3">
            <div className="cyber-progress-bar" style={{ width: "45%" }} />
          </div>
        </div>

        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-[#3d6b7a] uppercase tracking-widest">Vulnerabilities</span>
            <Bug className="w-4 h-4 text-[#ff8c00]" />
          </div>
          <div className="text-3xl font-black text-[#ff8c00] font-mono">{vulnCount}</div>
          <div className="text-[10px] text-[#3d6b7a] mt-1">3 critical</div>
          <div className="cyber-progress mt-3">
            <div className="cyber-progress-bar" style={{ width: "82%", background: "linear-gradient(90deg, #ff8c00, #ff3366)" }} />
          </div>
        </div>

        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-[#3d6b7a] uppercase tracking-widest">Payloads</span>
            <Zap className="w-4 h-4 text-[#ff3366]" />
          </div>
          <div className="text-3xl font-black text-[#ff3366] font-mono">7</div>
          <div className="text-[10px] text-[#3d6b7a] mt-1">2 active</div>
          <div className="cyber-progress mt-3">
            <div className="cyber-progress-bar" style={{ width: "30%", background: "linear-gradient(90deg, #ff3366, #9b59ff)" }} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs text-[#3d6b7a] uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="cyber-card p-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-200 cursor-pointer"
                style={{ borderColor: action.border, background: action.bg }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `rgba(${action.color === "#00ff88" ? "0,255,136" : action.color === "#ff8c00" ? "255,140,0" : action.color === "#ff3366" ? "255,51,102" : "155,89,255"},0.15)`, border: `1px solid ${action.border}` }}
                >
                  <Icon className="w-6 h-6" style={{ color: action.color }} />
                </div>
                <span className="text-xs font-semibold tracking-wide" style={{ color: action.color }}>
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#e0f4ff] tracking-wide">Activity Timeline</h2>
            <TrendingUp className="w-4 h-4 text-[#00d4ff]" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="vulnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff3366" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: "#3d6b7a", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#3d6b7a", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0d1f2d", border: "1px solid #1a3a4a", borderRadius: "6px", fontSize: "11px" }}
                labelStyle={{ color: "#7ab8cc" }}
              />
              <Area type="monotone" dataKey="networks" stroke="#00ff88" strokeWidth={2} fill="url(#netGrad)" />
              <Area type="monotone" dataKey="scans" stroke="#00d4ff" strokeWidth={2} fill="url(#scanGrad)" />
              <Area type="monotone" dataKey="vulns" stroke="#ff3366" strokeWidth={2} fill="url(#vulnGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00ff88]" /><span className="text-[10px] text-[#3d6b7a]">Networks</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00d4ff]" /><span className="text-[10px] text-[#3d6b7a]">Scans</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ff3366]" /><span className="text-[10px] text-[#3d6b7a]">Vulns</span></div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#e0f4ff] tracking-wide">Recent Activity</h2>
            <Clock className="w-4 h-4 text-[#3d6b7a]" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-[#1a3a4a] last:border-0">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: severityColor[item.severity], boxShadow: `0 0 6px ${severityColor[item.severity]}` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#7ab8cc] leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-[#3d6b7a]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threat Overview */}
      <div className="cyber-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#e0f4ff] tracking-wide">Threat Overview</h2>
          <Target className="w-4 h-4 text-[#ff3366]" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Critical", count: 3, color: "#ff3366", icon: AlertTriangle },
            { label: "High", count: 7, color: "#ff8c00", icon: Unlock },
            { label: "Medium", count: 12, color: "#ffd700", icon: Eye },
            { label: "Low", count: 24, color: "#00ff88", icon: CheckCircle },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: `rgba(${item.color === "#ff3366" ? "255,51,102" : item.color === "#ff8c00" ? "255,140,0" : item.color === "#ffd700" ? "255,215,0" : "0,255,136"},0.05)`, border: `1px solid rgba(${item.color === "#ff3366" ? "255,51,102" : item.color === "#ff8c00" ? "255,140,0" : item.color === "#ffd700" ? "255,215,0" : "0,255,136"},0.2)` }}>
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: item.color }} />
                <div>
                  <div className="text-xl font-black font-mono" style={{ color: item.color }}>{item.count}</div>
                  <div className="text-[10px] text-[#3d6b7a] uppercase tracking-wider">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/wardriving", title: "War Driving", desc: "GPS-mapped network discovery with real-time mapping and signal strength analysis", icon: Wifi, color: "#00ff88" },
          { href: "/scanner", title: "Vulnerability Scanner", desc: "Deep scan targets for CVEs, misconfigurations, and exploitable weaknesses", icon: Bug, color: "#ff8c00" },
          { href: "/ai", title: "AI Engine", desc: "AI-powered attack surface analysis, exploit suggestions, and automated payload delivery", icon: Brain, color: "#9b59ff" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="cyber-card p-5 group hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-5 h-5" style={{ color: item.color }} />
                <h3 className="text-sm font-semibold text-[#e0f4ff]">{item.title}</h3>
                <ChevronRight className="w-4 h-4 text-[#3d6b7a] ml-auto group-hover:text-[#00d4ff] transition-colors" />
              </div>
              <p className="text-xs text-[#3d6b7a] leading-relaxed">{item.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
