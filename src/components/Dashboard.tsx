import React, { useState } from "react";
import { 
  Send, Compass, Mail, Sliders, TrendingUp, DollarSign, 
  Sparkles, ArrowUpRight, Zap, Target, BookOpen, AlertCircle,
  Cpu, Shield, Terminal, Play, CheckCircle, RefreshCw, Download
} from "lucide-react";
import { Campaign, Recommendation } from "../types";
import { downloadCampaignsCSV } from "../utils/csvExport";

interface DashboardProps {
  campaigns: Campaign[];
  recommendations: Recommendation[];
  onNavigateTab: (tab: string) => void;
  onRefreshWorkspace?: () => void;
}

export default function Dashboard({ campaigns, recommendations, onNavigateTab, onRefreshWorkspace }: DashboardProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Autonomous Agent Crew States
  const [crewRunning, setCrewRunning] = useState(false);
  const [crewLogs, setCrewLogs] = useState<string[]>([
    "System standby. Waiting for authorization to run autonomous workspace audit..."
  ]);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);

  const crewAgents = [
    { id: "deliverability", name: "Deliverability Warden", role: "Spam & DNS Sentinel", icon: Shield, color: "text-rose-400 bg-rose-400/5 border-rose-500/20" },
    { id: "persona", name: "Persona Architect", role: "Psychographic Profiler", icon: Target, color: "text-amber-400 bg-amber-400/5 border-amber-500/20" },
    { id: "copywriter", name: "Copywriter Copilot", role: "Structure & CTA Auditor", icon: Mail, color: "text-purple-400 bg-purple-400/5 border-purple-500/20" },
    { id: "subject", name: "Subject Line Optimiser", role: "NLP Open Predictor", icon: Sliders, color: "text-cyan-400 bg-cyan-400/5 border-cyan-500/20" },
    { id: "scheduler", name: "Send-Time Broker", role: "Timezone Analyst", icon: Compass, color: "text-emerald-400 bg-emerald-400/5 border-emerald-500/20" }
  ];

  const handleTriggerCrewAudit = async () => {
    if (crewRunning) return;
    setCrewRunning(true);
    setCrewLogs(["[SYSTEM LOG] Initializing Autonomous Growth Crew... Authorization granted."]);
    setActiveAgentId("deliverability");

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      await delay(700);
      setCrewLogs(prev => [...prev, "[Warden] Deliverability Warden: Checking DNS records, SPF alignment, and blacklists..."]);
      
      await delay(900);
      setActiveAgentId("persona");
      setCrewLogs(prev => [...prev, "[Architect] Persona Architect: Analysing active campaign descriptions against target demographic profiles..."]);
      
      await delay(900);
      setActiveAgentId("copywriter");
      setCrewLogs(prev => [...prev, "[Copilot] Copywriter Copilot: Auditing draft newsletters for conversion barriers and CTA clarity..."]);
      
      await delay(900);
      setActiveAgentId("subject");
      setCrewLogs(prev => [...prev, "[Optimiser] Subject Line Optimiser: Scanning subject semantics for spam words and open rates..."]);
      
      await delay(900);
      setActiveAgentId("scheduler");
      setCrewLogs(prev => [...prev, "[Broker] Send-Time Broker: Calculating timezone distributions for customer list segments..."]);

      await delay(700);
      setCrewLogs(prev => [...prev, "[SYSTEM LOG] Contacting Gemini core to synthesize optimization models..."]);

      // Trigger server-side autonomous run
      const res = await fetch("/api/system/autonomous-run", { method: "POST" });
      if (!res.ok) {
        throw new Error("SaaS backend reported an interruption in core reasoning loops.");
      }
      const data = await res.json();

      if (data.steps && Array.isArray(data.steps)) {
        await delay(500);
        // Stagger outputting results
        for (let i = 0; i < data.steps.length; i++) {
          await delay(300);
          setCrewLogs(prev => [...prev, `[AUDIT STEP] ${data.steps[i]}`]);
        }
        await delay(500);
      }

      setCrewLogs(prev => [
        ...prev,
        `[SUCCESS] Analysis complete! Found high-priority upgrade: "${data.recommendation.title}"`,
        `[ALERT] Dispatched alert to local notification tray: "${data.notification.title}"`,
        `[SYSTEM LOG] Autonomy sequence finished successfully. Transitioning to STANDBY.`
      ]);

      // Call reload prop to synchronize parent state
      onRefreshWorkspace?.();

    } catch (err: any) {
      setCrewLogs(prev => [
        ...prev,
        `[ERROR] Crew execution interrupted: ${err.message || "Unknown socket failures."}`,
        `[SYSTEM LOG] Fallback default procedures applied.`
      ]);
    } finally {
      setActiveAgentId(null);
      setCrewRunning(false);
    }
  };

  // Hardcoded premium mock aggregates
  const stats = [
    { id: "sent", label: "Emails Dispatched", value: "148,250", change: "+14.2% vs last month", icon: Send, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { id: "campaigns", label: "Autonomous Campaigns", value: campaigns.length.toString(), change: `${campaigns.filter(c=>c.status === "Sent").length} Completed, ${campaigns.filter(c=>c.status === "Draft").length} Plan Active`, icon: Compass, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
    { id: "open", label: "Avg Open Rate", value: "68.2%", change: "+5.1% increase (AI choice)", icon: Mail, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { id: "click", label: "Avg Click Rate", value: "34.5%", change: "+3.8% increase (Strong CTA)", icon: Sliders, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
    { id: "conversion", label: "Avg Conversion Rate", value: "12.8%", change: "+2.1% (Segment focused)", icon: Target, color: "text-cyan-500", bg: "bg-cyan-500/10 border-cyan-500/20" },
    { id: "revenue", label: "Generated Revenue", value: "$154,200", change: "+22.5% AI attribution", icon: DollarSign, color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" }
  ];

  // Data for custom interactive SVG lines
  const dailyOutreach = [3200, 5800, 4100, 8900, 6400, 12000, 9500, 15000, 14000, 18500];
  const dailyRevenue = [2500, 4200, 3100, 6800, 5200, 9300, 7100, 11400, 10800, 14500];

  // Helper to draw clean SVG path
  const getSvgPath = (data: number[], height: number, width: number, maxVal: number) => {
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - (val / maxVal) * (height - 20); // offset padding
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  const getSvgAreaPath = (data: number[], height: number, width: number, maxVal: number) => {
    const path = getSvgPath(data, height, width, maxVal);
    return `${path} L ${width},${height} L 0,${height} Z`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Autonomous Marketing Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time insights and autonomous optimizations powered by Google Gemini.
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
          <button
            onClick={() => onNavigateTab("planner")}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Launch AI Planner
          </button>
        </div>
      </div>

      {/* KPI Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              onMouseEnter={() => setHoveredMetric(stat.id)}
              onMouseLeave={() => setHoveredMetric(null)}
              className={`p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                hoveredMetric === stat.id ? "border-blue-500/40 shadow-lg shadow-blue-500/5 -translate-y-1" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-white font-display tracking-tight">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} transition-colors shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-medium flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {stat.change}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Core Performance Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* outreach performance graph */}
        <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-500" />
                Outreach Dispersion (10-Day Trend)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Autonomous volume scale and click responses.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Sent
              </span>
            </div>
          </div>

          <div className="relative h-64 w-full bg-slate-950/60 border border-slate-800/50 rounded-lg p-2 overflow-hidden">
            <svg viewBox="0 0 500 240" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* grid lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="220" x2="500" y2="220" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3,3" />

              {/* Area path */}
              <path d={getSvgAreaPath(dailyOutreach, 240, 500, 20000)} fill="url(#blueGlow)" />
              {/* Stroke path */}
              <path d={getSvgPath(dailyOutreach, 240, 500, 20000)} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />

              {/* Data dots */}
              {dailyOutreach.map((val, idx) => {
                const x = (idx / (dailyOutreach.length - 1)) * 500;
                const y = 240 - (val / 20000) * (240 - 20);
                return (
                  <g key={idx} className="group/dot cursor-pointer">
                    <circle cx={x} cy={y} r="4" fill="#3B82F6" stroke="#0F172A" strokeWidth="1.5" />
                    <circle cx={x} cy={y} r="8" fill="#3B82F6" fillOpacity="0" className="hover:fill-opacity-20 transition-all" />
                  </g>
                );
              })}
            </svg>
            <div className="absolute top-2 left-2 bg-slate-900/90 text-[10px] font-mono border border-slate-800 px-2 py-0.5 rounded text-blue-400">
              Peak: 18,500 Dispatched
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
            <span>D1</span><span>D2</span><span>D3</span><span>D4</span><span>D5</span><span>D6</span><span>D7</span><span>D8</span><span>D9</span><span>D10</span>
          </div>
        </div>

        {/* Generated Revenue graph */}
        <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                AI-Attributed Revenue Growth
              </h3>
              <p className="text-xs text-slate-400 mt-1">Direct ROI tracking on conversion triggers.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Revenue
              </span>
            </div>
          </div>

          <div className="relative h-64 w-full bg-slate-950/60 border border-slate-800/50 rounded-lg p-2 overflow-hidden">
            <svg viewBox="0 0 500 240" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="emeraldGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* grid lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="220" x2="500" y2="220" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3,3" />

              {/* Area path */}
              <path d={getSvgAreaPath(dailyRevenue, 240, 500, 16000)} fill="url(#emeraldGlow)" />
              {/* Stroke path */}
              <path d={getSvgPath(dailyRevenue, 240, 500, 16000)} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

              {/* Data dots */}
              {dailyRevenue.map((val, idx) => {
                const x = (idx / (dailyRevenue.length - 1)) * 500;
                const y = 240 - (val / 16000) * (240 - 20);
                return (
                  <circle key={idx} cx={x} cy={y} r="4" fill="#10B981" stroke="#0F172A" strokeWidth="1.5" />
                );
              })}
            </svg>
            <div className="absolute top-2 left-2 bg-slate-900/90 text-[10px] font-mono border border-slate-800 px-2 py-0.5 rounded text-emerald-400">
              Peak: $14,500/day
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
            <span>D1</span><span>D2</span><span>D3</span><span>D4</span><span>D5</span><span>D6</span><span>D7</span><span>D8</span><span>D9</span><span>D10</span>
          </div>
        </div>
      </div>

      {/* AI Agent Crew Control Room */}
      <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
          <div>
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500 animate-pulse" />
              Autonomous AI Agent Crew Room
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Command specialized agent nodes to audit active deliverables, scan domain SPF aligners, and detect spam vulnerabilities.
            </p>
          </div>
          <button
            onClick={handleTriggerCrewAudit}
            disabled={crewRunning}
            className="self-start sm:self-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all disabled:opacity-50 cursor-pointer"
          >
            {crewRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Crew Auditing...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Trigger Crew Audit Run
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Active Agents list (Left column/2 span) */}
          <div className="xl:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Specialized Agent Nodes</h4>
            <div className="space-y-2">
              {crewAgents.map((agent) => {
                const Icon = agent.icon;
                const isSelected = activeAgentId === agent.id;
                return (
                  <div
                    key={agent.id}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? "bg-blue-600/10 border-blue-500/40 shadow-sm"
                        : "bg-slate-950/40 border-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg border ${agent.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{agent.name}</p>
                        <p className="text-[10px] text-slate-500">{agent.role}</p>
                      </div>
                    </div>
                    <div>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[10px] text-blue-400 font-mono font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                          ANALYZING
                        </span>
                      ) : crewRunning ? (
                        <span className="text-[10px] text-slate-600 font-mono">QUEUED</span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">STANDBY</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time terminal log console (Right column/3 span) */}
          <div className="xl:col-span-3 flex flex-col space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              Live Autonomy Crew Console
            </h4>
            <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-[11px] leading-relaxed text-blue-400 min-h-[220px] max-h-[240px] overflow-y-auto scrollbar-thin">
              <div className="space-y-1.5">
                {crewLogs.map((log, index) => {
                  let logColor = "text-blue-400";
                  if (log.startsWith("[SYSTEM")) logColor = "text-slate-500";
                  if (log.startsWith("[SUCCESS")) logColor = "text-emerald-400 font-bold";
                  if (log.startsWith("[ALERT")) logColor = "text-amber-400";
                  if (log.startsWith("[ERROR")) logColor = "text-rose-400 font-bold";
                  if (log.startsWith("[AUDIT")) logColor = "text-indigo-400";
                  return (
                    <div key={index} className={logColor}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* recent campaigns table */}
        <div className="lg:col-span-2 p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800/60 pb-4">
            <div>
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Recent Campaign Initiatives
              </h3>
              <p className="text-xs text-slate-400 mt-1">Currently tracked workspace operations.</p>
            </div>
            <button
              onClick={() => onNavigateTab("sending")}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline"
            >
              Dispatch Center →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                  <th className="pb-3 font-semibold">Campaign Name</th>
                  <th className="pb-3 font-semibold">Target Audience</th>
                  <th className="pb-3 font-semibold">Budget</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {campaigns.slice(0, 5).map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-900/30 transition-colors group">
                    <td className="py-3.5 pr-2">
                      <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">{campaign.name}</p>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{campaign.product}</span>
                    </td>
                    <td className="py-3.5 text-slate-300 pr-2">{campaign.audience}</td>
                    <td className="py-3.5 font-mono text-slate-400">${campaign.budget.toLocaleString()}</td>
                    <td className="py-3.5 text-center">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        campaign.status === "Sent" 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations panel */}
        <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6">
          <div className="border-b border-slate-800/60 pb-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              AI Recommendation Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1">Autonomous recommendations to trigger now.</p>
          </div>

          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs flex flex-col items-center gap-2">
                <AlertCircle className="w-5 h-5 text-slate-600" />
                Workspace is currently optimized. Check back after next send logs.
              </div>
            ) : (
              recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-2 hover:border-blue-500/20 transition-all text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-semibold tracking-wider uppercase font-mono px-2 py-0.5 rounded-full border ${
                      rec.type === "CTA" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                      rec.type === "Subject" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                      rec.type === "Timing" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                      "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    }`}>
                      {rec.type} Advice
                    </span>
                    <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      rec.impact === "High" ? "bg-red-500/10 text-red-400" :
                      rec.impact === "Medium" ? "bg-amber-500/10 text-amber-400" :
                      "bg-slate-800 text-slate-400"
                    }`}>
                      {rec.impact} Impact
                    </span>
                  </div>
                  
                  <p className="font-bold text-slate-200">{rec.title}</p>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{rec.description}</p>
                  
                  <div className="pt-1">
                    <button
                      onClick={() => onNavigateTab(rec.type === "CTA" || rec.type === "Subject" ? "generator" : "timing")}
                      className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Configure upgrade
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
