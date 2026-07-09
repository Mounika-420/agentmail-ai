import React, { useState } from "react";
import { motion } from "motion/react";
import { Sliders, Sparkles, AlertCircle, RefreshCw, Copy, Check, TrendingUp } from "lucide-react";

export default function SubjectGenerator() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [generatedResults, setGeneratedResults] = useState<any | null>(null);

  const handleGenerateSubjects = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setError("");
    setIsLoading(true);
    setGeneratedResults(null);

    try {
      const res = await fetch("/api/ai/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, targetAudience: audience, goal })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate optimized subjects.");

      // Sort subjects by open rate descending
      if (data.subjects) {
        data.subjects.sort((a: any, b: any) => b.predictedOpenRate - a.predictedOpenRate);
      }
      setGeneratedResults(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze subject triggers.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <Sliders className="w-8 h-8 text-blue-500" />
          AI Subject Line Optimizer
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Input your target objectives and run machine learning predictions on open-rate distributions across 10 structured copy drafts.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Specification Card */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
              Sequence Inputs
              <Sparkles className="w-4 h-4 text-blue-400" />
            </h3>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleGenerateSubjects} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Product / Offer Name</label>
                <input
                  type="text"
                  required
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. AgentMail Pro"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Target Segment / Audience</label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Inactive Enterprise Leads"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Primary Conversion Goal</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Schedule a 15m Demo"
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
                    Predicting Open Rates...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate & Analyze subjects
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Output Table and SVG Data distribution (3/5) */}
        <div className="xl:col-span-3 space-y-6">
          {isLoading && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
              <p className="text-sm font-bold text-white">Modeling Open Rate Distributions</p>
              <p className="text-xs text-slate-400 max-w-sm">AI is testing readability keywords, psycholinguistic triggers, and historic open rate metrics to identify your campaign champion.</p>
            </div>
          )}

          {!isLoading && !generatedResults && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
              <Sliders className="w-12 h-12 text-slate-600" />
              <p className="text-sm font-bold text-white">Awaiting Campaign Parameters</p>
              <p className="text-xs text-slate-400 max-w-xs">Run the subject line analyzer to evaluate open rate indices, copy performance, and psychological drivers.</p>
            </div>
          )}

          {!isLoading && generatedResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Champion Alert Card */}
              <div className="p-5 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent border border-blue-500/20 rounded-xl space-y-2 relative overflow-hidden">
                <div className="absolute right-4 top-4 opacity-5">
                  <TrendingUp className="w-24 h-24 text-blue-400" />
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-wider uppercase font-mono text-blue-400">AI Champion Predicted</span>
                </div>
                <p className="text-lg font-bold text-white">"{generatedResults.highestPredictedOpenRate}"</p>
                <p className="text-xs text-slate-400 leading-normal">
                  Identified as the highest performing copywriting candidate based on direct B2B emotional triggers and attention hook formulas.
                </p>
              </div>

              {/* Data Visualization - Predicted rates bar chart */}
              <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Predicted Open Rate Distribution Chart</h3>
                
                <div className="space-y-3 pt-2">
                  {generatedResults.subjects.map((item: any, i: number) => (
                    <div key={i} className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-slate-300 truncate max-w-md">
                          {i + 1}. "{item.subject}"
                        </span>
                        <span className="font-mono font-bold text-blue-400 shrink-0 ml-4">
                          {item.predictedOpenRate}% Open Rate
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900/60 relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.predictedOpenRate}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          className={`h-full rounded-full ${
                            item.subject === generatedResults.highestPredictedOpenRate
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                              : "bg-slate-700"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed copy table with copies and copy rationales */}
              <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Detailed Copy Breakdown</h3>
                
                <div className="divide-y divide-slate-800/60">
                  {generatedResults.subjects.map((item: any, i: number) => (
                    <div key={i} className="py-4 flex justify-between items-start gap-4 text-xs">
                      <div className="space-y-1.5 flex-1 pr-4">
                        <p className="font-bold text-slate-200 flex items-center gap-2">
                          <span className="text-slate-500 font-mono text-[10px]">#{i+1}</span>
                          "{item.subject}"
                        </p>
                        <p className="text-slate-400 text-[11px] leading-normal">{item.reason}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.subject, i)}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded p-1.5 text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
                        title="Copy Subject"
                      >
                        {copiedIndex === i ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
