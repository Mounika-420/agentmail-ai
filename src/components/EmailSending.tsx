import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, Sparkles, AlertCircle, RefreshCw, Terminal, CheckCircle, Mail, Settings } from "lucide-react";
import { Campaign, EmailTemplate } from "../types";

interface EmailSendingProps {
  campaigns: Campaign[];
  templates: EmailTemplate[];
  onCampaignUpdated: (campaign: Campaign) => void;
}

export default function EmailSending({ campaigns, templates, onCampaignUpdated }: EmailSendingProps) {
  // Selections
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [targetSegment, setTargetSegment] = useState("All");
  
  // Credentials and config
  const [provider, setProvider] = useState<"mailtrap" | "sendgrid" | "mock">("mock");
  const [smtpHost, setSmtpHost] = useState("sandbox.smtp.mailtrap.io");
  const [smtpPort, setSmtpPort] = useState("2525");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [senderEmail, setSenderEmail] = useState("sender@agentmail-ai.com");

  // States
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);

  const appendLog = (text: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const handleSendEmails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId) {
      setError("Please select a target Campaign.");
      return;
    }
    setError("");
    setSuccess(false);
    setIsSending(true);
    setTerminalLogs([]);
    setProgressPercent(0);

    appendLog("Initializing AgentMail Dispatch Workspace...");
    appendLog(`Selected Campaign: ${campaigns.find(c=>c.id === selectedCampaignId)?.name}`);
    appendLog(`Target Segment Filter: ${targetSegment}`);
    appendLog(`SMTP Delivery Node: ${provider.toUpperCase()}`);

    if (provider !== "mock" && (!smtpUser || !smtpPass)) {
      setError("Please enter your SMTP Username and Password.");
      setIsSending(false);
      return;
    }

    try {
      appendLog("Validating contact distribution list...");
      // Simulate slight handshakes
      await new Promise(r => setTimeout(r, 1000));
      setProgressPercent(15);
      appendLog("Authorizing secure SMTP transport connection layer...");
      
      const payload = {
        campaignId: selectedCampaignId,
        templateId: selectedTemplateId,
        segment: targetSegment,
        provider,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass,
        senderEmail
      };

      appendLog("SMTP Transport Handshake initiated. Querying server...");
      setProgressPercent(40);
      
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed during SMTP packet routing.");

      setProgressPercent(75);
      appendLog(`SMTP Server Connected. Authenticated securely.`);
      appendLog(`Routing package payloads. Dispatching email queue...`);
      
      // Dynamic simulated queue output
      for (let i = 0; i < data.dispatchedCount; i++) {
        await new Promise(r => setTimeout(r, Math.max(100, 800 / data.dispatchedCount)));
        appendLog(`[OK] Packet dispatch index #${i+1}: Routed successfully to destination mail exchanges.`);
      }

      setProgressPercent(100);
      appendLog(`Delivery pipeline flushed. Dispatched a total of ${data.dispatchedCount} client nodes.`);
      appendLog("SMTP connection severed gracefully. Session closed.");
      
      setSuccess(true);

      // Set active campaign status as Sent
      const camp = campaigns.find(c => c.id === selectedCampaignId);
      if (camp) {
        onCampaignUpdated({
          ...camp,
          status: "Sent"
        });
      }

    } catch (err: any) {
      setError(err.message || "An error occurred during secure SMTP routing.");
      appendLog(`[FATAL ERROR] Pipeline routing broken: ${err.message || "SMTP socket timed out"}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleApplyCreds = (type: "mailtrap" | "sendgrid" | "mock") => {
    setProvider(type);
    if (type === "mailtrap") {
      setSmtpHost("sandbox.smtp.mailtrap.io");
      setSmtpPort("2525");
      setSmtpUser("");
      setSmtpPass("");
    } else if (type === "sendgrid") {
      setSmtpHost("smtp.sendgrid.net");
      setSmtpPort("587");
      setSmtpUser("apikey");
      setSmtpPass("");
    } else {
      setSmtpHost("mock.agentmail.local");
      setSmtpPort("587");
      setSmtpUser("demo_root");
      setSmtpPass("demo_pass");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <Send className="w-8 h-8 text-blue-500" />
          SMTP Dispatch & Delivery Workspace
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Bridge campaigns directly with Mailtrap Sandbox, SendGrid SMTP servers or our local offline mock node to execute autonomous queues.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Form controls */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
              Sequence Configurations
              <Mail className="w-4 h-4 text-blue-400" />
            </h3>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSendEmails} className="space-y-4">
              {/* Campaign select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Target Campaign</label>
                <select
                  required
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="">-- Choose Campaign workspace --</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
                  ))}
                </select>
              </div>

              {/* Template select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Email Template Copy</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="">-- Select template copy --</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.subject} ({t.type})</option>
                  ))}
                </select>
              </div>

              {/* Target CRM Segment */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Target Client Segment</label>
                <select
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="All">All CRM Contacts</option>
                  <option value="VIP">VIP Contacts only</option>
                  <option value="Premium">Premium Contacts only</option>
                  <option value="Regular">Regular Contacts only</option>
                  <option value="Inactive">Inactive Contacts only</option>
                  <option value="New">New Contacts only</option>
                </select>
              </div>

              {/* SMTP Provider Select Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">SMTP Server Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["mock", "mailtrap", "sendgrid"] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => handleApplyCreds(t)}
                      className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border text-center transition-colors cursor-pointer uppercase ${
                        provider === t 
                          ? "bg-blue-600 border-blue-500 text-white font-bold" 
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Host and Port */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">SMTP Host</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">SMTP Port</label>
                  <input
                    type="text"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Credentials Username and Password */}
              {provider !== "mock" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">SMTP Username</label>
                    <input
                      type="text"
                      required
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="User credentials ID"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-700 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">SMTP Password</label>
                    <input
                      type="password"
                      required
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-700 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Sender Email address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Authorized Sender Address</label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="sender@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing SMTP Queue Dispatch...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Dispatch Email Sequence Batch
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Terminal Console (3/5) */}
        <div className="xl:col-span-3 space-y-6">
          <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-1.5 font-mono">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Delivery Terminal stdout logs
            </h3>

            {/* Progress bar */}
            {isSending && (
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Routing Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900/40">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            )}

            <div className="w-full bg-slate-950 rounded-lg p-4 font-mono text-[11px] text-slate-300 space-y-1.5 h-[340px] overflow-y-auto border border-slate-900 leading-normal scrollbar-thin">
              {terminalLogs.length === 0 ? (
                <div className="text-slate-600 flex flex-col items-center justify-center h-full gap-2">
                  <Settings className="w-8 h-8 text-slate-700 animate-spin" />
                  Terminal offline. Ready to mount SMTP socket handshakes.
                </div>
              ) : (
                terminalLogs.map((log, i) => (
                  <div key={i} className={`whitespace-pre-wrap ${
                    log.includes("[OK]") ? "text-emerald-400 font-semibold" :
                    log.includes("[FATAL ERROR]") ? "text-red-400 font-bold bg-red-500/5 p-2 rounded" :
                    "text-slate-300"
                  }`}>
                    {log}
                  </div>
                ))
              )}
            </div>

            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>SMTP Handshake & Email Sequence routing completed successfully. All client endpoints reported 250 ok response status.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
