import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, MessageSquare, Send, RefreshCw, AlertCircle, User, Bot, CornerDownLeft } from "lucide-react";
import { Campaign } from "../types";

interface ChatAssistantProps {
  campaigns: Campaign[];
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function ChatAssistant({ campaigns }: ChatAssistantProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hello! I am your Autonomous Marketing Copilot. Ask me to optimize copy, formulate launch sequences, draft SMS follow-ups, or brainstorm target user personas.",
      timestamp: new Date()
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage("");
    setError("");

    // Add user message to state
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date()
    };
    
    // Capture state for payload
    const currentMessagesPayload = [
      ...messages.map(m => ({
        role: m.sender === "bot" ? "assistant" : "user",
        content: m.text
      })),
      { role: "user", content: userText }
    ];

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Find campaign name if chosen
      const camp = campaigns.find(c => c.id === selectedCampaignId);
      const campName = camp ? camp.name : "None selected";
      const campProduct = camp ? camp.product : "";

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          messages: currentMessagesPayload,
          campaignName: campName,
          product: campProduct
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to retrieve copilot response.");

      // Add bot message
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: data.reply || data.text || "No reply returned.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (err: any) {
      setError(err.message || "An error occurred in conversation sockets.");
      // Add error text
      const errMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: "My apologies, but my connection was temporarily interrupted. Please verify your Gemini API credentials and retry your message.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-200px)]">
      {/* Header Info Banner */}
      <div className="shrink-0">
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-blue-500" />
          Autonomous Marketing Copilot
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Brainstorm promotional sequences, write ad copies, optimize cold outreaches or formulate customer segmentation criteria in real-time.
        </p>
      </div>

      {/* Main chat Workspace container */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left column: Context selector (1/4) */}
        <div className="xl:col-span-1 p-5 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-4 shrink-0 h-fit">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
            Conversation Context
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Target Workspace Campaign</label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">-- Chat generally with Copilot --</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 leading-normal pt-1">
              Selecting a campaign feeds product variables and specifications directly into Gemini's context window.
            </p>
          </div>
        </div>

        {/* Right column: Interactive Conversational Screen (3/4) */}
        <div className="xl:col-span-3 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col h-full min-h-0 overflow-hidden shadow-sm">
          {/* Chat bubbles viewport scroll area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-4 max-w-3xl ${m.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                {/* avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold ${
                  m.sender === "user" 
                    ? "bg-blue-600/10 border-blue-500/20 text-blue-400" 
                    : "bg-purple-600/10 border-purple-500/20 text-purple-400"
                }`}>
                  {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* message body */}
                <div className="space-y-1">
                  <div className={`p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-500/5 rounded-tr-none"
                      : "bg-slate-950/80 border border-slate-850 text-slate-200 rounded-tl-none"
                  }`}>
                    {m.text}
                  </div>
                  <span className={`text-[9px] font-mono text-slate-500 block ${m.sender === "user" ? "text-right" : ""}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 max-w-2xl">
                <div className="w-8 h-8 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 text-xs font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  Copilot is processing campaign variables...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat input form box */}
          <div className="shrink-0 p-4 bg-slate-950/40 border-t border-slate-800/80">
            {error && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                required
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="e.g. Brainstorm a promotional sequence for launch..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-24 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
              />
              <div className="absolute right-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold p-1.5 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
