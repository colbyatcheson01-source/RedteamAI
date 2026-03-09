"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Wifi,
  Bug,
  Zap,
  Brain,
  Database,
  Settings,
  Menu,
  X,
  Radio,
  Terminal,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Shield, color: "cyan" },
  { href: "/wardriving", label: "War Driving", icon: Wifi, color: "green" },
  { href: "/scanner", label: "Vuln Scanner", icon: Bug, color: "orange" },
  { href: "/payloads", label: "Payloads", icon: Zap, color: "red" },
  { href: "/ai", label: "AI Engine", icon: Brain, color: "purple" },
  { href: "/database", label: "Network DB", icon: Database, color: "cyan" },
  { href: "/terminal", label: "Terminal", icon: Terminal, color: "green" },
  { href: "/settings", label: "Settings", icon: Settings, color: "muted" },
];

const colorMap: Record<string, string> = {
  cyan: "text-[#00d4ff]",
  green: "text-[#00ff88]",
  orange: "text-[#ff8c00]",
  red: "text-[#ff3366]",
  purple: "text-[#9b59ff]",
  muted: "text-[#7ab8cc]",
};

const activeBgMap: Record<string, string> = {
  cyan: "bg-[rgba(0,212,255,0.1)] border-[#00d4ff]",
  green: "bg-[rgba(0,255,136,0.1)] border-[#00ff88]",
  orange: "bg-[rgba(255,140,0,0.1)] border-[#ff8c00]",
  red: "bg-[rgba(255,51,102,0.1)] border-[#ff3366]",
  purple: "bg-[rgba(155,89,255,0.1)] border-[#9b59ff]",
  muted: "bg-[rgba(122,184,204,0.1)] border-[#7ab8cc]",
};

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#0a1520] border-r border-[#1a3a4a] fixed left-0 top-0 z-50">
        {/* Logo */}
        <div className="p-6 border-b border-[#1a3a4a]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-[rgba(255,51,102,0.15)] border border-[#ff3366] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#ff3366]" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ff3366] animate-ping-slow" />
            </div>
            <div>
              <div
                className="text-lg font-black text-[#e0f4ff] tracking-widest"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                RED<span className="text-[#ff3366]">OPS</span>
              </div>
              <div className="text-[10px] text-[#3d6b7a] tracking-widest uppercase">
                Red Team Platform
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mx-4 mt-4 p-2 rounded border border-[rgba(255,140,0,0.3)] bg-[rgba(255,140,0,0.05)] flex items-center gap-2">
          <AlertTriangle className="w-3 h-3 text-[#ff8c00] flex-shrink-0" />
          <span className="text-[9px] text-[#ff8c00] tracking-wide uppercase">
            Authorized Use Only
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 group ${
                  isActive
                    ? `${activeBgMap[item.color]} border-opacity-60`
                    : "border-transparent hover:bg-[rgba(255,255,255,0.03)] hover:border-[#1a3a4a]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? colorMap[item.color] : "text-[#3d6b7a] group-hover:" + colorMap[item.color].replace("text-", "")
                  }`}
                />
                <span
                  className={`text-sm font-medium tracking-wide ${
                    isActive ? colorMap[item.color] : "text-[#7ab8cc] group-hover:text-[#e0f4ff]"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <ChevronRight className={`w-3 h-3 ml-auto ${colorMap[item.color]}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Status Footer */}
        <div className="p-4 border-t border-[#1a3a4a]">
          <div className="flex items-center gap-2 mb-3">
            <div className="status-dot status-active" />
            <span className="text-[11px] text-[#7ab8cc]">System Online</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-3 h-3 text-[#3d6b7a]" />
            <span className="text-[10px] text-[#3d6b7a]">GPS: Acquiring...</span>
          </div>
          <div className="cyber-progress mt-2">
            <div className="cyber-progress-bar" style={{ width: "73%" }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-[#3d6b7a]">AI Engine</span>
            <span className="text-[9px] text-[#00d4ff]">73%</span>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a1520] border-b border-[#1a3a4a] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[rgba(255,51,102,0.15)] border border-[#ff3366] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#ff3366]" />
          </div>
          <span
            className="text-base font-black text-[#e0f4ff] tracking-widest"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            RED<span className="text-[#ff3366]">OPS</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded border border-[#1a3a4a] text-[#7ab8cc]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0a1520] border-l border-[#1a3a4a] transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-[#1a3a4a] flex items-center justify-between">
          <span className="text-sm text-[#7ab8cc] uppercase tracking-widest">Navigation</span>
          <button onClick={() => setMobileOpen(false)} className="text-[#3d6b7a]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg border transition-all duration-200 ${
                  isActive
                    ? `${activeBgMap[item.color]} border-opacity-60`
                    : "border-transparent hover:bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? colorMap[item.color] : "text-[#3d6b7a]"}`} />
                <span className={`text-sm font-medium ${isActive ? colorMap[item.color] : "text-[#7ab8cc]"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
