import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, Mail, ShieldAlert, Check, RefreshCw, Eye, Edit3, 
  Trash2, AlertTriangle, CheckCircle, FileText, ChevronRight, Play 
} from "lucide-react";
import { EmailTemplate } from "../types";

interface EmailGeneratorProps {
  templates: EmailTemplate[];
  onTemplateCreated: (template: EmailTemplate) => void;
  onTemplateDeleted: (id: string) => void;
}

export default function EmailGenerator({ templates, onTemplateCreated, onTemplateDeleted }: EmailGeneratorProps) {
  // Inputs
  const [product, setProduct] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [type, setType] = useState<any>("Promotional");
  const [tone, setTone] = useState<any>("Professional");
  const [instructions, setInstructions] = useState("");

  // Editor states
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Status indicators
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Analysis results
  const [spamAnalysis, setSpamAnalysis] = useState<any | null>(null);

  const handleGenerateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsGenerating(true);
    setSpamAnalysis(null);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, targetAudience, type, tone, instructions })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate email content.");

      // Set current editor state
      setSubject(data.subject);
      setBody(data.body);
      setIsEditing(true);
      setSuccess(true);
      onTemplateCreated(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during copy generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunSpamCheck = async () => {
    if (!body) return;
    setIsAnalyzing(true);
    setError("");

    try {
      const res = await fetch("/api/ai/spam-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to run spam metrics.");

      setSpamAnalysis(data);
    } catch (err: any) {
      setError(err.message || "Failed to run spam compliance scan.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectPastTemplate = (template: EmailTemplate) => {
    setSubject(template.subject);
    setBody(template.body);
    setProduct(template.title.split(" - ")[0]);
    setType(template.type);
    setTone(template.tone);
    setSpamAnalysis(template.spamScore !== undefined ? {
      spamScore: template.spamScore,
      readability: template.readability,
      grammarIssues: template.grammarIssues,
      spamWordsFound: template.spamWordsFound,
      professionalScore: template.professionalScore
    } : null);
    setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <Mail className="w-8 h-8 text-blue-500" />
          AI Email Generation Suite
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Compose welcome triggers, promotional blast, or newsletter copy with custom tone guidelines and run live anti-spam checks.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Control Column (2/5) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
              Composer Parameters
              <Sparkles className="w-4 h-4 text-blue-400" />
            </h3>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2">
                <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleGenerateEmail} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Target Product / SaaS Concept</label>
                <input
                  type="text"
                  required
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. AgentMail AI - Autonomous email platform"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Audience Demographic Focus</label>
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. B2B Sales Executives"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Email Goal / Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="Welcome">Welcome Onboarding</option>
                    <option value="Promotional">Promotional Offer</option>
                    <option value="Festival">Festival Celebration</option>
                    <option value="Follow-up">Nurture Follow-up</option>
                    <option value="Cart Abandonment">Cart Recovery</option>
                    <option value="Product Launch">Product Launch Announcement</option>
                    <option value="Newsletter">Editorial Newsletter</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Tone Profile</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Friendly">Friendly / Casual</option>
                    <option value="Luxury">Luxury / Premium</option>
                    <option value="Formal">Formal Business</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Custom Copywriting Instructions (Optional)</label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Emphasize a free trial, include a P.S. note about active safety integrations."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Copy Elements...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Email Template
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Past Templates Drawer */}
          <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3">
              Session Templates History
            </h3>

            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {templates.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No copy iterations generated yet.
                </div>
              ) : (
                templates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => selectPastTemplate(t)}
                    className="p-3 bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 rounded-lg flex justify-between items-center cursor-pointer transition-colors group"
                  >
                    <div className="overflow-hidden pr-2">
                      <p className="font-semibold text-slate-200 text-xs truncate group-hover:text-blue-400 transition-colors">{t.subject}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{t.type} · {t.tone}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTemplateDeleted(t.id);
                      }}
                      className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                      title="Delete Copy"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Composition & Spam compliance workspace (3/5) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Editor Workspace */}
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Email Editor Workspace</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunSpamCheck}
                    disabled={isAnalyzing}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-blue-400 hover:text-blue-300 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    Run AI Spam Compliance Check
                  </button>
                </div>
              </div>

              {success && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5" />
                  Copy generated successfully. Review and edit subject or content directly.
                </div>
              )}

              {/* Subject Input Row */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 font-medium transition-colors"
                />
              </div>

              {/* Body Textarea Row */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Body</label>
                <textarea
                  rows={14}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans leading-relaxed whitespace-pre-wrap transition-colors resize-y"
                />
              </div>
            </motion.div>
          ) : (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
              <Mail className="w-12 h-12 text-slate-600 animate-pulse" />
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white">No Active Copy Template Loaded</p>
                <p className="text-xs text-slate-400 max-w-sm">Complete the parameters form on the left and dispatch the copy generator to fill your active workspace.</p>
              </div>
            </div>
          )}

          {/* AI Spam checker results */}
          {spamAnalysis && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-6 shadow-sm"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                AI Compliance Analysis & Spam Diagnostic
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Dial Meter */}
                <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Filter Risk Score</span>
                  <div className="relative flex items-center justify-center">
                    <span className="text-3xl font-extrabold text-white font-display">
                      {spamAnalysis.spamScore}
                      <span className="text-xs text-slate-500 font-normal"> /10</span>
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    spamAnalysis.spamScore > 4 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse" 
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {spamAnalysis.spamScore > 4 ? "High Risk (Spam Folder)" : "Low Risk (Safe)"}
                  </span>
                </div>

                {/* Readability & Grammar */}
                <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Readability Index</span>
                    <p className="text-lg font-bold text-white">{spamAnalysis.readability || "Grade 8"}</p>
                    <p className="text-[10px] text-slate-400">Excellent index for standard enterprise response conversion rates.</p>
                  </div>
                  <div className="border-t border-slate-800/40 pt-2 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-500">Grammar Issues</span>
                    <span className="bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {spamAnalysis.grammarIssues?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Professional Polish Score */}
                <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Professional Grade</span>
                  <p className="text-3xl font-extrabold text-blue-400 font-display">{spamAnalysis.professionalScore || 95}%</p>
                  <p className="text-[10px] text-slate-400 leading-normal">Evaluated against enterprise editorial copies standard benchmarks.</p>
                </div>
              </div>

              {/* Spam words warnings */}
              {spamAnalysis.spamWordsFound && spamAnalysis.spamWordsFound.length > 0 && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Spam Trigger Words Detected
                  </p>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    The spam analysis discovered high-risk sales keywords. Consider substituting these with passive, consultative alternatives to guarantee inbox delivery:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {spamAnalysis.spamWordsFound.map((word: string, i: number) => (
                      <span key={i} className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold">
                        "{word}"
                      </span>
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
