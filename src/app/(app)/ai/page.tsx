"use client";

import { useState, useRef, useEffect } from "react";
import {
  Brain,
  Send,
  Cpu,
  Globe,
  HardDrive,
  Zap,
  Target,
  Bug,
  Shield,
  ChevronRight,
  RefreshCw,
  Settings,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Copy,
  Code,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "analysis" | "exploit" | "payload" | "recon" | "normal";
};

const aiModels = [
  { id: "cloud-gpt4", label: "GPT-4o (Cloud)", provider: "OpenAI", icon: Globe, color: "#00d4ff" },
  { id: "cloud-claude", label: "Claude 3.5 (Cloud)", provider: "Anthropic", icon: Globe, color: "#9b59ff" },
  { id: "cloud-gemini", label: "Gemini Pro (Cloud)", provider: "Google", icon: Globe, color: "#ffd700" },
  { id: "local-llama", label: "Llama 3.1 (Local)", provider: "Meta", icon: HardDrive, color: "#00ff88" },
  { id: "local-mistral", label: "Mistral 7B (Local)", provider: "Mistral AI", icon: HardDrive, color: "#ff8c00" },
  { id: "local-codellama", label: "CodeLlama (Local)", provider: "Meta", icon: HardDrive, color: "#ff3366" },
];

const quickPrompts = [
  { label: "Analyze Attack Surface", icon: Target, prompt: "Analyze the attack surface for a target running Apache 2.4.50, OpenSSH 7.4, and MySQL 5.7. Identify vulnerabilities and suggest exploitation paths." },
  { label: "Find Exploits for CVE", icon: Bug, prompt: "Find available exploits for CVE-2024-1234 and provide step-by-step exploitation instructions for a penetration test." },
  { label: "Generate Payload", icon: Zap, prompt: "Generate a stealthy reverse shell payload for a Linux target that evades common AV detection. Include obfuscation techniques." },
  { label: "Privilege Escalation", icon: Shield, prompt: "I have a low-privilege shell on a Linux system running kernel 5.4. What are the best privilege escalation techniques to try?" },
  { label: "Network Recon Plan", icon: Globe, prompt: "Create a comprehensive network reconnaissance plan for a 192.168.1.0/24 subnet. Include passive and active techniques." },
  { label: "Post-Exploitation", icon: Cpu, prompt: "I've gained initial access to a Windows 10 machine. What are the best post-exploitation steps for lateral movement and persistence?" },
];

const mockResponses: Record<string, string> = {
  default: `**Attack Surface Analysis Complete**

Based on the target profile, I've identified the following critical attack vectors:

**🔴 Critical Vulnerabilities:**
- \`CVE-2024-1234\` — OpenSSH 7.4 Buffer Overflow (CVSS 9.8)
  - Remote code execution without authentication
  - Exploit available: EDB-51234
  
- \`CVE-2021-41773\` — Apache 2.4.49 Path Traversal (CVSS 9.8)
  - Directory traversal + RCE via mod_cgi
  - Exploit: \`curl http://TARGET/cgi-bin/.%2e/.%2e/bin/sh -d 'echo;id'\`

**🟠 High Severity:**
- MySQL 5.7 — Multiple privilege escalation vectors
- Default credentials likely (root:root, root:password)
- UDF injection possible if FILE privilege granted

**Recommended Attack Chain:**
1. Exploit Apache path traversal for initial foothold
2. Upload PHP webshell via writable directory
3. Escalate via MySQL UDF injection
4. Establish persistence via cron job

**Suggested Next Steps:**
- Run: \`searchsploit apache 2.4.50\`
- Deploy reverse shell payload to port 4444
- Use AI-assisted payload generation for AV evasion

*Confidence: 94% | Based on CVE database + exploit-db*`,
};

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `**RedOps AI Engine Online** 🔴

I'm your AI-powered red team assistant. I can help you:

- **Analyze attack surfaces** and identify vulnerabilities
- **Find and suggest exploits** for discovered CVEs  
- **Generate custom payloads** with AV evasion
- **Plan penetration testing** strategies
- **Automate reconnaissance** and enumeration

Select a model above (cloud or local), then ask me anything about your target. I'll provide actionable intelligence for your authorized penetration tests.

*⚠️ For authorized security testing only*`,
      timestamp: new Date(),
      type: "normal",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("cloud-gpt4");
  const [isThinking, setIsThinking] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [localModelPath, setLocalModelPath] = useState("/models/llama-3.1-8b.gguf");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    const msgId = crypto.randomUUID();
    const userMsg: Message = {
      id: msgId,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

    const aiMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: mockResponses.default,
      timestamp: new Date(),
      type: "analysis",
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsThinking(false);
  };

  const selectedModelInfo = aiModels.find(m => m.id === selectedModel);
  const isLocal = selectedModel.startsWith("local-");

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e0f4ff">$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background:#0a1520;color:#00ff88;padding:1px 4px;border-radius:3px;font-size:11px">$1</code>')
      .replace(/^- (.*)/gm, '<div style="display:flex;gap:6px;margin:2px 0"><span style="color:#00d4ff">•</span><span>$1</span></div>')
      .replace(/^(\d+)\. (.*)/gm, '<div style="display:flex;gap:6px;margin:2px 0"><span style="color:#ff8c00;min-width:16px">$1.</span><span>$2</span></div>')
      .replace(/^#{1,3} (.*)/gm, '<div style="color:#00d4ff;font-weight:bold;margin:8px 0 4px">$1</div>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-0px)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#1a3a4a] bg-[#0a1520] flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-[#e0f4ff] tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
              AI <span className="text-[#9b59ff]">ENGINE</span>
            </h1>
            <p className="text-[#3d6b7a] text-xs mt-0.5">Intelligent Attack Surface Analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded border border-[#1a3a4a] text-[#3d6b7a] hover:text-[#00d4ff] hover:border-[#00d4ff] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Model Selector */}
        <div className="mt-3 flex flex-wrap gap-2">
          {aiModels.map((model) => {
            const Icon = model.icon;
            return (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[10px] transition-all ${
                  selectedModel === model.id
                    ? "border-opacity-60 bg-opacity-10"
                    : "border-[#1a3a4a] text-[#3d6b7a] hover:text-[#7ab8cc]"
                }`}
                style={selectedModel === model.id ? { borderColor: model.color, background: `${model.color}15`, color: model.color } : {}}
              >
                <Icon className="w-3 h-3" />
                {model.label}
              </button>
            );
          })}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-3 p-3 rounded border border-[#1a3a4a] bg-[#0d1f2d] space-y-3">
            {!isLocal ? (
              <div>
                <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">
                  API Key ({selectedModelInfo?.provider})
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="cyber-input text-xs"
                />
              </div>
            ) : (
              <div>
                <label className="text-[10px] text-[#3d6b7a] uppercase tracking-widest block mb-1.5">
                  Local Model Path
                </label>
                <input
                  type="text"
                  value={localModelPath}
                  onChange={(e) => setLocalModelPath(e.target.value)}
                  className="cyber-input text-xs font-mono"
                />
                <p className="text-[10px] text-[#3d6b7a] mt-1">Supports GGUF format via llama.cpp</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className={`status-dot ${isLocal ? "status-warning" : "status-active"}`} />
              <span className="text-[10px] text-[#7ab8cc]">
                {isLocal ? "Local inference — no data leaves device" : "Cloud API — data sent to provider"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-3 border-b border-[#1a3a4a] bg-[#0a1520] flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {quickPrompts.map((qp) => {
            const Icon = qp.icon;
            return (
              <button
                key={qp.label}
                onClick={() => sendMessage(qp.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1a3a4a] text-[10px] text-[#7ab8cc] hover:border-[#9b59ff] hover:text-[#9b59ff] transition-colors whitespace-nowrap flex-shrink-0"
              >
                <Icon className="w-3 h-3" />
                {qp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === "user"
                  ? "bg-[rgba(0,212,255,0.15)] border border-[rgba(0,212,255,0.3)]"
                  : "bg-[rgba(155,89,255,0.15)] border border-[rgba(155,89,255,0.3)]"
              }`}
            >
              {msg.role === "user" ? (
                <Target className="w-4 h-4 text-[#00d4ff]" />
              ) : (
                <Brain className="w-4 h-4 text-[#9b59ff]" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)]"
                  : "bg-[#0d1f2d] border border-[#1a3a4a]"
              }`}
            >
              {msg.type === "analysis" && (
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3 h-3 text-[#9b59ff]" />
                  <span className="text-[9px] text-[#9b59ff] uppercase tracking-widest">AI Analysis</span>
                </div>
              )}
              <div
                className="text-xs text-[#7ab8cc] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
              />
              <div className="text-[9px] text-[#3d6b7a] mt-2">
                {msg.timestamp.toLocaleTimeString("en-US", { hour12: false })}
                {msg.role === "assistant" && (
                  <span className="ml-2 text-[#3d6b7a]">• {selectedModelInfo?.label}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(155,89,255,0.15)] border border-[rgba(155,89,255,0.3)] flex-shrink-0">
              <Brain className="w-4 h-4 text-[#9b59ff] animate-pulse-glow" />
            </div>
            <div className="bg-[#0d1f2d] border border-[#1a3a4a] rounded-lg p-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3 h-3 text-[#9b59ff] animate-rotate" />
                <span className="text-xs text-[#3d6b7a]">Analyzing...</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#9b59ff]"
                      style={{ animation: `pulse-glow 1s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#1a3a4a] bg-[#0a1520] flex-shrink-0">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask AI to analyze vulnerabilities, suggest exploits, or generate payloads..."
              className="cyber-input resize-none h-12 pr-10 py-3 text-xs"
              rows={1}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isThinking}
            className={`px-4 rounded border font-semibold transition-all flex items-center gap-2 ${
              !input.trim() || isThinking
                ? "border-[#1a3a4a] text-[#3d6b7a] cursor-not-allowed"
                : "border-[#9b59ff] text-[#9b59ff] bg-[rgba(155,89,255,0.1)] hover:bg-[rgba(155,89,255,0.2)]"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className={`status-dot ${isLocal ? "status-warning" : "status-active"}`} />
          <span className="text-[10px] text-[#3d6b7a]">
            {isLocal ? "🔒 Local inference" : "☁️ Cloud API"} • {selectedModelInfo?.label}
          </span>
          <span className="text-[10px] text-[#3d6b7a] ml-auto">Shift+Enter for newline</span>
        </div>
      </div>
    </div>
  );
}
