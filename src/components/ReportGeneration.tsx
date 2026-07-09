import React, { useState } from "react";
import { motion } from "motion/react";
import { FileText, Sparkles, Printer, AlertCircle, TrendingUp, Compass, Target, Download, DollarSign } from "lucide-react";
import { Campaign } from "../types";
import { downloadCampaignsCSV } from "../utils/csvExport";

interface ReportGenerationProps {
  campaigns: Campaign[];
}

export default function ReportGeneration({ campaigns }: ReportGenerationProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

  const handlePrintReport = () => {
    if (!selectedCampaign) return;
    setIsGenerating(true);
    setTimeout(() => {
      window.print();
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-8 print:bg-white print:text-black">
      {/* Header hidden when printing */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-500" />
            AI Executive Report Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Export vector-crisp PDF summaries containing detailed conversion logs, metrics, objectives, and recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadCampaignsCSV(campaigns)}
            disabled={campaigns.length === 0}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV Analytics
          </button>

          {selectedCampaign && (
            <button
              onClick={handlePrintReport}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <Printer className="w-4 h-4 animate-bounce" />
              ) : (
                <Printer className="w-4 h-4" />
              )}
              Download PDF Campaign Report
            </button>
          )}
        </div>
      </div>

      {/* Select Campaign Box - hidden when printing */}
      <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-4 shadow-sm print:hidden">
        <div className="space-y-1.5 max-w-md">
          <label className="text-xs font-semibold text-slate-400">Target Campaign for Audit</label>
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="">-- Choose Campaign workspace --</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
            ))}
          </select>
        </div>
      </div>

      {/* No Campaign state */}
      {!selectedCampaign && (
        <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 min-h-[300px] print:hidden">
          <FileText className="w-12 h-12 text-slate-600 animate-pulse" />
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-white">Report Generation Engine Offline</p>
            <p className="text-xs text-slate-400 max-w-sm">Select an active campaign above to generate an enterprise-ready executive marketing analysis report.</p>
          </div>
        </div>
      )}

      {/* Report Canvas Print Node */}
      {selectedCampaign && (
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1E293B] border border-slate-800 rounded-xl p-8 max-w-4xl mx-auto space-y-8 shadow-lg print:border-none print:p-0 print:bg-white print:text-black print:shadow-none"
        >
          {/* Printable Report Header */}
          <div className="flex justify-between items-start border-b border-slate-800/80 pb-6 print:border-slate-300">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase font-mono print:text-blue-600">Executive Briefing Audit</span>
              <h2 className="text-2xl font-extrabold text-white font-display print:text-black">{selectedCampaign.name}</h2>
              <p className="text-xs text-slate-400 font-mono">Date Compiled: {new Date().toLocaleDateString()} · Status: {selectedCampaign.status}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xl font-black text-white font-display uppercase tracking-tight print:text-black">
                AgentMail <span className="text-blue-500">AI</span>
              </span>
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest block mt-0.5">Autonomous Report</p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/40 print:bg-slate-50 print:border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Campaign Budget</span>
              <p className="text-lg font-bold text-white font-display print:text-black mt-1">${selectedCampaign.budget?.toLocaleString() || "2,500"}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/40 print:bg-slate-50 print:border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Target Demographic</span>
              <p className="text-xs font-bold text-white print:text-black mt-1.5 truncate">{selectedCampaign.audience || "CRM segments"}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/40 print:bg-slate-50 print:border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Avg Open Rate</span>
              <p className="text-lg font-bold text-white font-display print:text-black mt-1">68.2%</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/40 print:bg-slate-50 print:border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Avg click rate</span>
              <p className="text-lg font-bold text-white font-display print:text-black mt-1">34.5%</p>
            </div>
          </div>

          {/* Core Product definition */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5 print:text-black">
              <Compass className="w-4 h-4 text-blue-500" />
              Product Definition & Target Offer
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/40 print:bg-slate-50 print:border-slate-200 print:text-slate-800">
              {selectedCampaign.product || "No product parameters mapped for this sequence yet."}
            </p>
          </div>

          {/* AI generated Strategy Summary */}
          {selectedCampaign.plan && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5 print:text-black">
                <Sparkles className="w-4 h-4 text-purple-500" />
                AI Strategy Plan & Sequence Overview
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/40 print:bg-slate-50 print:border-slate-200 print:text-slate-800">
                {selectedCampaign.plan}
              </p>
            </div>
          )}

          {/* Persona and Conversion objectives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5 print:text-black">
                <Target className="w-4 h-4 text-emerald-500" />
                Sequence Marketing Objective
              </h3>
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/40 h-full print:bg-slate-50 print:border-slate-200 print:text-slate-800 whitespace-pre-line">
                {selectedCampaign.objective || `• Generate curiosity and engagement indicators.\n• Deliver passive, consultative email sequences.\n• Secure initial scheduled trial interactions.`}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5 print:text-black">
                <DollarSign className="w-4 h-4 text-rose-500" />
                Primary Call-to-Action Callout
              </h3>
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/40 h-full print:bg-slate-50 print:border-slate-200 print:text-slate-800 whitespace-pre-line">
                {selectedCampaign.cta || `• CTA trigger: Click interactive scheduler links inside footer.\n• Style: Consultative, low friction calendar inputs.\n• Goal: Set up a high-quality demo.`}
              </div>
            </div>
          </div>

          {/* Cadence Timeline and Sequence Dates */}
          {selectedCampaign.timeline && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5 print:text-black">
                <FileText className="w-4 h-4 text-blue-400" />
                Campaign Cadence Timeline
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/40 print:bg-slate-50 print:border-slate-200 print:text-slate-800 whitespace-pre-line">
                {selectedCampaign.timeline}
              </p>
            </div>
          )}

          {/* Report Footer */}
          <div className="border-t border-slate-800 pt-6 flex justify-between items-center text-[10px] text-slate-500 print:border-slate-300">
            <span>Compiled via AgentMail Autonomous Marketing agent.</span>
            <span>Page 1 of 1</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
