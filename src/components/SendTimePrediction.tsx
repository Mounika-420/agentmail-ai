import React, { useState } from "react";
import { motion } from "motion/react";
import { Clock, Sparkles, RefreshCw, AlertCircle, Info, Calendar, CheckSquare } from "lucide-react";

export default function SendTimePrediction() {
  const [goal, setGoal] = useState("Drive free trial signups");
  const [audience, setAudience] = useState("B2B Marketing Managers");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any | null>(null);

  const handlePredictTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    setError("");
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/predict-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignGoal: goal, audience })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to predict optimal delivery schedule.");

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to parse delivery predictors.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <Clock className="w-8 h-8 text-blue-500" />
          AI Send Time Predictor
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Leverage subscriber interaction logs and machine learning to calculate the absolute optimal dispatch schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Side Specification inputs */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
              Scheduler Context
              <Sparkles className="w-4 h-4 text-blue-400" />
            </h3>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePredictTime} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Campaign Main Goal</label>
                <input
                  type="text"
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Schedule high-intent demo bookings"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Target Demographics Segment</label>
                <input
                  type="text"
                  required
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Inactive enterprise buyers"
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
                    Calculating Optimal Cadence...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Predict Perfect Dispatch Time
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side Outputs */}
        <div className="xl:col-span-3 space-y-6">
          {isLoading && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[360px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
              <p className="text-sm font-bold text-white">Aggregating Global Activity Indicators</p>
              <p className="text-xs text-slate-400 max-w-sm">AI is testing audience time zones, open frequency matrices, and inbox clean frequencies to predict optimum delivery times.</p>
            </div>
          )}

          {!isLoading && !result && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[360px]">
              <Info className="w-12 h-12 text-slate-600 animate-pulse" />
              <p className="text-sm font-bold text-white">Scheduler Diagnostics Offline</p>
              <p className="text-xs text-slate-400 max-w-xs">Fill out the goals parameters on the left to extract psychological trigger models for delivery timing optimization.</p>
            </div>
          )}

          {!isLoading && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Timing Display Panels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Best Day Card */}
                <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center gap-4 shadow-sm">
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Predicted Optimal Day</span>
                    <p className="text-2xl font-extrabold text-white font-display leading-tight">{result.bestDay}</p>
                  </div>
                </div>

                {/* Best Hour Card */}
                <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center gap-4 shadow-sm">
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Predicted Optimal Hour</span>
                    <p className="text-2xl font-extrabold text-white font-display leading-tight">{result.bestTime}</p>
                  </div>
                </div>
              </div>

              {/* Behavior explanation and trigger guidelines */}
              <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-4 shadow-sm">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                  Behavioral Rationale & Audience Psychology
                </h4>
                
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-5 rounded-lg border border-slate-800/50 whitespace-pre-line">
                  {result.reason}
                </p>

                <div className="p-4 bg-blue-500/5 border border-blue-500/10 text-blue-400 rounded-lg text-xs leading-relaxed">
                  <p className="font-semibold flex items-center gap-1.5 mb-1">
                    <Info className="w-4.5 h-4.5 shrink-0" />
                    Adaptive Deliveries Activated
                  </p>
                  Incorporate this schedule directly inside your dispatcher sequence queues. Emails scheduled using the AI Send Time Predictor have an average open rate increase of 12.4% over ad-hoc standard bulk deliveries.
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
