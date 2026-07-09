import React, { useState } from "react";
import { motion } from "motion/react";
import { GitBranch, Sparkles, RefreshCw, AlertCircle, Info, CheckCircle, ChevronRight } from "lucide-react";

export default function ABTesting() {
  const [subjectA, setSubjectA] = useState("Is manual email creation slowing your campaigns down?");
  const [subjectB, setSubjectB] = useState("Quick question about your marketing pipelines?");
  const [campaignGoal, setCampaignGoal] = useState("Drive free workspace trials");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any | null>(null);

  const handleABTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectA || !subjectB) return;
    setError("");
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/ab-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectA, subjectB, campaignGoal })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to compare testing copy variants.");

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to run multivariate prediction analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <GitBranch className="w-8 h-8 text-blue-500" />
          Data-Driven A/B Testing Predictor
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Perform digital multivariate comparative simulations between two campaign headers to predict the open rate champion.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Side: Copy Inputs (2/5) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
              Multivariate Variables
              <Sparkles className="w-4 h-4 text-blue-400" />
            </h3>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleABTest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Campaign Main Objective</label>
                <input
                  type="text"
                  required
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  placeholder="e.g. Maximize trial conversions"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Subject Version A</label>
                <input
                  type="text"
                  required
                  value={subjectA}
                  onChange={(e) => setSubjectA(e.target.value)}
                  placeholder="Subject line variant A"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Subject Version B</label>
                <input
                  type="text"
                  required
                  value={subjectB}
                  onChange={(e) => setSubjectB(e.target.value)}
                  placeholder="Subject line variant B"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Modeling Variables performance...
                  </>
                ) : (
                  <>
                    <GitBranch className="w-4 h-4" />
                    Predict Campaign Winner
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Prediction results (3/5) */}
        <div className="xl:col-span-3 space-y-6">
          {isLoading && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[380px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
              <p className="text-sm font-bold text-white">Synthesizing Comparative Eye-Tracking Indices</p>
              <p className="text-xs text-slate-400 max-w-sm">Gemini is weighting curiosity loops, sales indicators, character lengths, and trigger-word indices to simulate performance outputs.</p>
            </div>
          )}

          {!isLoading && !result && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[380px]">
              <Info className="w-12 h-12 text-slate-600 animate-pulse" />
              <p className="text-sm font-bold text-white">Comparative Model Offline</p>
              <p className="text-xs text-slate-400 max-w-xs">Populate Subject Version A and B variables on the left to extract behavioral winner predictions.</p>
            </div>
          )}

          {!isLoading && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Winner Announcement */}
              <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold font-display shrink-0 shadow-lg shadow-emerald-500/5">
                    {result.predictedWinner}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Predicted Champion Winner</span>
                    <p className="text-md font-bold text-white leading-snug">
                      "{result.predictedWinner === "A" ? subjectA : subjectB}"
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2.5 rounded-lg text-center shrink-0 min-w-[120px]">
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider font-mono block">Confidence</span>
                  <p className="text-2xl font-extrabold text-blue-300 font-display">{result.confidenceScore || 85}%</p>
                </div>
              </div>

              {/* Side-by-side comparison indices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Version A Card */}
                <div className={`p-5 rounded-xl border space-y-3 bg-slate-950/80 ${
                  result.predictedWinner === "A" ? "border-emerald-500/20" : "border-slate-850"
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Version A</span>
                    {result.predictedWinner === "A" && (
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">Champion</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-200">"{subjectA}"</p>
                  <p className="text-[10px] text-slate-500">Character count: {subjectA.length} chars</p>
                </div>

                {/* Version B Card */}
                <div className={`p-5 rounded-xl border space-y-3 bg-slate-950/80 ${
                  result.predictedWinner === "B" ? "border-emerald-500/20" : "border-slate-850"
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Version B</span>
                    {result.predictedWinner === "B" && (
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">Champion</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-200">"{subjectB}"</p>
                  <p className="text-[10px] text-slate-500">Character count: {subjectB.length} chars</p>
                </div>
              </div>

              {/* Psychological Rationale explanation */}
              <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-4 shadow-sm">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CheckCircle className="w-4.5 h-4.5 text-blue-400" />
                  Multivariate Simulation Analysis
                </h4>
                
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-5 rounded-lg border border-slate-800/40 whitespace-pre-line">
                  {result.reason}
                </p>

                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 rounded-lg text-xs flex items-start gap-2">
                  <Info className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>
                    <strong>Statistical Recommendation:</strong> Run a 10% pilot sandbox test on Version {result.predictedWinner} first. If actual live open rate performance is within 3% of prediction, scale to the remaining 90% list.
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
