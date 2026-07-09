import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Compass, ShieldAlert, Check, RefreshCw, FileText, ChevronRight } from "lucide-react";
import { Campaign } from "../types";

interface CampaignPlannerProps {
  campaigns: Campaign[];
  onCampaignCreated: (campaign: Campaign) => void;
  onCampaignUpdated: (campaign: Campaign) => void;
}

export default function CampaignPlanner({ campaigns, onCampaignCreated, onCampaignUpdated }: CampaignPlannerProps) {
  // Input fields
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState("2500");
  
  // Selection or custom mode
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [plannedStrategy, setPlannedStrategy] = useState<any | null>(null);

  const handlePlanCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);
    setPlannedStrategy(null);

    try {
      let activeId = selectedCampaignId;
      let activeName = name;

      // If no campaign selected, create one as draft first
      if (!selectedCampaignId) {
        if (!name || !product) {
          throw new Error("Please specify a campaign name and product definition to start.");
        }
        const createRes = await fetch("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, product, audience, goal, budget })
        });
        const newCamp = await createRes.json();
        if (!createRes.ok) throw new Error(newCamp.error || "Failed to draft campaign.");
        activeId = newCamp.id;
        activeName = newCamp.name;
        onCampaignCreated(newCamp);
      } else {
        const camp = campaigns.find(c => c.id === selectedCampaignId);
        if (camp) {
          activeName = camp.name;
        }
      }

      // Now run the AI Planning engine on the server
      const planRes = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeId,
          product: product || (campaigns.find(c=>c.id === selectedCampaignId)?.product),
          audience: audience || (campaigns.find(c=>c.id === selectedCampaignId)?.audience),
          goal: goal || (campaigns.find(c=>c.id === selectedCampaignId)?.goal),
          budget: Number(budget)
        })
      });
      const data = await planRes.json();
      if (!planRes.ok) throw new Error(data.error || "Failed to generate AI plan.");

      setPlannedStrategy(data);
      setSuccess(true);

      // Trigger update back to parent state
      onCampaignUpdated({
        id: activeId,
        name: activeName,
        product: product || (campaigns.find(c=>c.id === selectedCampaignId)?.product) || "",
        audience: audience || (campaigns.find(c=>c.id === selectedCampaignId)?.audience) || "",
        goal: goal || (campaigns.find(c=>c.id === selectedCampaignId)?.goal) || "",
        budget: Number(budget),
        plan: data.plan,
        strategy: data.strategy,
        objective: data.objective,
        persona: data.persona,
        cta: data.cta,
        timeline: data.timeline,
        status: "Draft",
        createdAt: new Date().toISOString()
      });

    } catch (err: any) {
      setError(err.message || "Failed to run autonomous campaign planning engine.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignSelect = (id: string) => {
    setSelectedCampaignId(id);
    if (id) {
      const camp = campaigns.find(c => c.id === id);
      if (camp) {
        setProduct(camp.product);
        setAudience(camp.audience || "");
        setGoal(camp.goal || "");
        setBudget(camp.budget?.toString() || "1000");
        // Pre-populate planned strategy if already exists
        if (camp.plan) {
          setPlannedStrategy({
            plan: camp.plan,
            strategy: camp.strategy,
            objective: camp.objective,
            persona: camp.persona,
            cta: camp.cta,
            timeline: camp.timeline
          });
        } else {
          setPlannedStrategy(null);
        }
      }
    } else {
      setProduct("");
      setAudience("");
      setGoal("");
      setBudget("1000");
      setPlannedStrategy(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <Compass className="w-8 h-8 text-blue-500" />
          Autonomous Campaign Planner
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Specify your metrics and let Gemini craft customer personas, sequence objectives, target timelines, and core CTAs.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Side: Planning Controls */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3">
              Strategic Specifications
            </h3>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2">
                <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePlanCampaign} className="space-y-4">
              {/* Select Existing Campaign OR Create New */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Target Workspace Campaign</label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => handleCampaignSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="">-- Start a New Campaign Plan --</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
                  ))}
                </select>
              </div>

              {!selectedCampaignId && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Campaign Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Q4 Growth Sequence"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Product / Service Description</label>
                <textarea
                  required
                  rows={2}
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. AgentMail Pro - Autonomous marketing workspace for SaaS founders"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Target Audience Demographic</label>
                <input
                  type="text"
                  required
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. B2B Sales Executives, Marketing Directors"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Campaign Goal / Objective</label>
                <input
                  type="text"
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Drive free demo bookings, recover cart drop-offs"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Budget ($ USD)</label>
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 disabled:opacity-50 transition-all cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    AI is writing strategy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {selectedCampaignId && plannedStrategy ? "Regenerate Strategy Plan" : "Generate Campaign Plan"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Planned Strategy Display */}
        <div className="xl:col-span-3 space-y-6">
          {isLoading && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
                <Sparkles className="w-6 h-6 text-blue-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white">Synthesizing CRM Variables & Audience Psychology</p>
                <p className="text-xs text-slate-400 max-w-sm">Gemini is structuring customer persona matrices, segment timelines, objectives, and copywriting triggers.</p>
              </div>
            </div>
          )}

          {!isLoading && !plannedStrategy && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
              <FileText className="w-12 h-12 text-slate-600" />
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white">No Campaign Strategy Loaded</p>
                <p className="text-xs text-slate-400 max-w-md">Configure your campaign parameters on the left and trigger the AI Planner to output a high-fidelity strategy sequence.</p>
              </div>
            </div>
          )}

          {!isLoading && plannedStrategy && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
                  <Check className="w-4.5 h-4.5" />
                  Campaign variables mapped and saved successfully to active local memory.
                </div>
              )}

              {/* Strategy grid presentation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plan Overview Card */}
                <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl md:col-span-2 space-y-3">
                  <h4 className="text-xs font-semibold tracking-wider text-blue-400 uppercase font-mono">Executive Plan</h4>
                  <p className="text-sm font-bold text-white">Campaign Concept & Context</p>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/40">{plannedStrategy.plan}</p>
                </div>

                {/* Email Strategy Card */}
                <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-semibold tracking-wider text-purple-400 uppercase font-mono">Email Sequence Tactics</h4>
                  <p className="text-sm font-bold text-white">Sequence Logic & Triggers</p>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/40 whitespace-pre-line">{plannedStrategy.strategy}</p>
                </div>

                {/* Target Audience Persona */}
                <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-semibold tracking-wider text-amber-400 uppercase font-mono">Customer Persona Matrix</h4>
                  <p className="text-sm font-bold text-white">Psychographics & Pain Points</p>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/40 whitespace-pre-line">{plannedStrategy.persona}</p>
                </div>

                {/* Quantitative Objectives */}
                <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-semibold tracking-wider text-emerald-400 uppercase font-mono">Marketing Objective</h4>
                  <p className="text-sm font-bold text-white">KPI Targets & Metrics</p>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/40 whitespace-pre-line">{plannedStrategy.objective}</p>
                </div>

                {/* Recommended Call To Action */}
                <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-semibold tracking-wider text-rose-400 uppercase font-mono">Primary Call-to-Action</h4>
                  <p className="text-sm font-bold text-white">Conversion Trigger Hooks</p>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/40 whitespace-pre-line">{plannedStrategy.cta}</p>
                </div>

                {/* Cadence Timeline */}
                <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl md:col-span-2 space-y-3">
                  <h4 className="text-xs font-semibold tracking-wider text-cyan-400 uppercase font-mono">Campaign Cadence Timeline</h4>
                  <p className="text-sm font-bold text-white">Delivery Phase Cadence</p>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/40 whitespace-pre-line">{plannedStrategy.timeline}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
