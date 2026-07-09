import React, { useState } from "react";
import { motion } from "motion/react";
import { Eye, ShieldAlert, Sparkles, RefreshCw, AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function SpamChecker() {
  const [subject, setSubject] = useState("ACT NOW! Save 50% FREE Access code inside!");
  const [body, setBody] = useState("Hello user,\n\nACT NOW! We have an incredible 100% FREE opportunity to buy our new tool now! Click below immediately to activate your discount! Urgent offer!\n\nBest, Growth Team");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any | null>(null);

  const handleSpamAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body) return;
    setError("");
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/spam-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze copywriting.");

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to parse anti-spam scoring matrices.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <Eye className="w-8 h-8 text-blue-500" />
          AI Copywriting & Spam Compliance Auditor
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Audit any generic email copy against primary inbox delivery filters, readability indicators, spelling and grammar metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Input Panel (2/5) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
              Draft Copy Auditor
              <Sparkles className="w-4 h-4 text-blue-400" />
            </h3>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2">
                <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSpamAnalysis} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Save 50% now!"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Draft Email Body</label>
                <textarea
                  required
                  rows={10}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Paste your newsletter or promotional copy here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all font-sans leading-relaxed resize-y"
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
                    Running Compliance Scan...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Analyze Copy Compliance
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Compliance Outputs (3/5) */}
        <div className="xl:col-span-3 space-y-6">
          {isLoading && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
              <p className="text-sm font-bold text-white">Auditing SMTP Triggers & Grammar Weights</p>
              <p className="text-xs text-slate-400 max-w-sm">Gemini is scanning for spam trigger words, assessing grade level readability, and calculating filter bypass metrics.</p>
            </div>
          )}

          {!isLoading && !result && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
              <Info className="w-12 h-12 text-slate-600 animate-pulse" />
              <p className="text-sm font-bold text-white">No Spam Audit Active</p>
              <p className="text-xs text-slate-400 max-w-xs">Paste your email copy in the left panel and click analyze to audit inbox delivery safety benchmarks.</p>
            </div>
          )}

          {!isLoading && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Compliance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-xl text-center space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Spam filter trigger risk</span>
                  <p className="text-4xl font-extrabold text-white font-display">
                    {result.spamScore}
                    <span className="text-sm text-slate-500 font-normal"> /10</span>
                  </p>
                  <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    result.spamScore > 4 ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {result.spamScore > 4 ? "Failed Compliance" : "Bypass Approved"}
                  </span>
                </div>

                <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-xl text-center space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Readability Grade</span>
                  <p className="text-2xl font-extrabold text-blue-400 font-display pt-1">{result.readability || "Grade 8"}</p>
                  <span className="text-[9px] text-slate-400 block font-light leading-none pt-1">Ideal for high B2B conversions</span>
                </div>

                <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-xl text-center space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Professional Standing</span>
                  <p className="text-4xl font-extrabold text-emerald-400 font-display">{result.professionalScore || 94}%</p>
                  <span className="text-[9px] text-slate-400 block font-light leading-none pt-1">Subject & structure score</span>
                </div>
              </div>

              {/* Spam keywords detected warning */}
              {result.spamWordsFound && result.spamWordsFound.length > 0 ? (
                <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl space-y-3">
                  <p className="font-bold flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-5 h-5" />
                    High-Risk Phrasing Warning
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This copywriting contains high-frequency promotional trigger triggers. These are heavily indexed by modern ISP spam filters (Google Workspace, Office 365) and are highly likely to route your campaign directly to the Junk/Spam folder. Substitution is heavily advised:
                  </p>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {result.spamWordsFound.map((word: string, i: number) => (
                      <span key={i} className="bg-red-500/20 text-red-300 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded border border-red-500/30 uppercase">
                        "{word}"
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl space-y-2">
                  <p className="font-bold flex items-center gap-2 text-sm">
                    <CheckCircle className="w-5 h-5" />
                    Zero Spam Words Found
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Congratulations! The email copy has zero matches in our high-risk SMTP trigger registers. Your content is highly compliant for secure inbox placement.
                  </p>
                </div>
              )}

              {/* Grammar and structural enhancements suggestions */}
              {result.grammarIssues && result.grammarIssues.length > 0 && (
                <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Structural & Spelling Corrections</h4>
                  <div className="space-y-3">
                    {result.grammarIssues.map((issue: string, i: number) => (
                      <div key={i} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs leading-normal text-slate-300 flex items-start gap-2.5">
                        <span className="bg-slate-800 text-slate-400 w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono text-[10px] shrink-0">
                          {i+1}
                        </span>
                        <p>{issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
