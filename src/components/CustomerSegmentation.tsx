import React, { useState } from "react";
import { motion } from "motion/react";
import { Users, Upload, RefreshCw, AlertCircle, Sparkles, Filter, Database, Check } from "lucide-react";
import { Customer } from "../types";

interface CustomerSegmentationProps {
  customers: Customer[];
  onCustomersSegmented: (list: Customer[]) => void;
}

export default function CustomerSegmentation({ customers, onCustomersSegmented }: CustomerSegmentationProps) {
  // Manual raw paste input
  const [csvText, setCsvText] = useState(
    "Name,Email,Revenue,OpenRate,ClickRate\n" +
    "Richard Hendricks,richard@piper.net,42000,95,78\n" +
    "Dinesh Chugtai,dinesh@piper.net,8500,72,25\n" +
    "Bertram Gilfoyle,gilfoyle@piper.net,12000,85,62\n" +
    "Jared Dunn,jared@piper.net,25000,98,90\n" +
    "Nelson Bighetti,bighead@piper.net,0,10,0\n" +
    "Gavin Belson,gavin@hooli.xyz,145000,90,52\n" +
    "Monica Hall,monica@raviga.com,32000,88,45\n" +
    "Laurie Bream,laurie@raviga.com,89000,80,30\n" +
    "Erlich Bachman,erlich@bachmanity.com,150,45,12"
  );

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Parse custom pasted CSV to JSON array
  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length <= 1) return [];
    
    // Header check
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    
    const results = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(",").map(v => v.trim());
      
      const obj: any = {};
      headers.forEach((header, idx) => {
        const val = values[idx];
        if (header === "revenue" || header === "openrate" || header === "clickrate") {
          obj[header] = Number(val) || 0;
        } else {
          obj[header] = val || "";
        }
      });
      results.push({
        name: obj.name || "Unnamed Contact",
        email: obj.email || "unknown@domain.com",
        revenue: obj.revenue || 0,
        openRate: obj.openrate || 0,
        clickRate: obj.clickrate || 0
      });
    }
    return results;
  };

  const handleRunSegmentation = async () => {
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const parsed = parseCSV(csvText);
      if (parsed.length === 0) {
        throw new Error("Invalid CSV format. Please verify you have Name, Email, Revenue headers.");
      }

      const res = await fetch("/api/ai/segment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customers: parsed })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to segment CRM database.");

      onCustomersSegmented(data.segmentedCustomers);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during customer clustering.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoCSV = () => {
    setCsvText(
      "Name,Email,Revenue,OpenRate,ClickRate\n" +
      "Elon Musk,elon@spacex.com,950000,92,72\n" +
      "Mark Zuckerberg,zuck@meta.com,340000,75,34\n" +
      "Satya Nadella,satya@microsoft.com,580000,85,60\n" +
      "Tim Cook,tim@apple.com,1250000,78,28\n" +
      "Jack Dorsey,jack@block.xyz,4500,98,90\n" +
      "Parag Agrawal,parag@coldmail.com,0,12,1\n" +
      "Jeff Bezos,jeff@blueorigin.com,890000,60,18\n" +
      "Sundar Pichai,sundar@google.com,750000,98,82\n" +
      "Jensen Huang,jensen@nvidia.com,2400000,99,95\n" +
      "Sam Altman,sam@openai.com,150000,99,92\n" +
      "Cold Lead,cold@gmail.com,0,0,0"
    );
  };

  const filteredCustomers = activeFilter === "All"
    ? customers
    : customers.filter(c => c.segment === activeFilter);

  // Compute distribution aggregates for SVG charts
  const dist = customers.reduce((acc: any, c) => {
    acc[c.segment] = (acc[c.segment] || 0) + 1;
    return acc;
  }, { VIP: 0, Premium: 0, Regular: 0, Inactive: 0, New: 0 });

  const totalSegmented = customers.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-500" />
          AI Customer Segmentation Engine
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Import client lists and utilize server-side Gemini clusters to classify contacts into VIP, Premium, Regular, Inactive, and New demographics.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Side: CSV Paste Input (2/5) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 bg-[#1E293B] border border-slate-800/80 rounded-xl space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-400" />
                CRM CSV Bulk Paste
              </h3>
              <button
                onClick={loadDemoCSV}
                className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer border border-blue-500/20 px-2 py-1 rounded bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
              >
                Load Enterprise Demo CSV
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 block">Comma-separated client list (Name, Email, Revenue, OpenRate, ClickRate)</label>
              <textarea
                rows={11}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all font-mono leading-relaxed resize-y"
              />
            </div>

            <button
              onClick={handleRunSegmentation}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Clustering Analytics...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Cluster & Segment Contacts
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Segmented Output Table and SVG charts (3/5) */}
        <div className="xl:col-span-3 space-y-6">
          {isLoading && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
              <p className="text-sm font-bold text-white">Modeling Behavioral Demographics</p>
              <p className="text-xs text-slate-400 max-w-sm">Gemini is parsing contact vectors, weighting lifetime customer value, and modeling engagement filters into behavioral clusters.</p>
            </div>
          )}

          {!isLoading && totalSegmented === 0 && (
            <div className="p-12 bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
              <Database className="w-12 h-12 text-slate-600" />
              <p className="text-sm font-bold text-white">No CRM Contacts Classified</p>
              <p className="text-xs text-slate-400 max-w-xs">Load or paste your CSV contact parameters on the left and run AI Clustering to display detailed analytics.</p>
            </div>
          )}

          {!isLoading && totalSegmented > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {success && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
                  <Check className="w-4.5 h-4.5" />
                  Successfully partitioned {totalSegmented} contacts with zero data collisions.
                </div>
              )}

              {/* Graphical aggregates distribution */}
              <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-5 shadow-sm">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Cluster Allocation Distribution</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {Object.keys(dist).map((key) => {
                    const count = dist[key];
                    const percent = Math.round((count / totalSegmented) * 100) || 0;
                    return (
                      <div key={key} className="bg-slate-950/80 p-3 rounded-lg border border-slate-850 text-center space-y-1">
                        <span className={`text-[10px] font-bold tracking-wider uppercase font-mono ${
                          key === "VIP" ? "text-emerald-400" :
                          key === "Premium" ? "text-blue-400" :
                          key === "Regular" ? "text-purple-400" :
                          key === "Inactive" ? "text-slate-500" :
                          "text-amber-400"
                        }`}>{key}</span>
                        <p className="text-xl font-extrabold text-white font-display">{count}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{percent}% of CRM</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Table Records display */}
              <div className="p-6 bg-[#1E293B] border border-slate-800 rounded-xl space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-slate-400" />
                    Segment Filters ({filteredCustomers.length} Records)
                  </h4>
                  
                  {/* Category select filters */}
                  <div className="flex flex-wrap gap-1">
                    {["All", "VIP", "Premium", "Regular", "Inactive", "New"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-colors border ${
                          activeFilter === f 
                            ? "bg-blue-600 border-blue-500 text-white font-bold" 
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-mono text-[9px]">
                        <th className="pb-3 font-semibold">Subscriber Details</th>
                        <th className="pb-3 font-semibold">Lifetime Value</th>
                        <th className="pb-3 font-semibold text-center">Open Rate</th>
                        <th className="pb-3 font-semibold text-center">Click Rate</th>
                        <th className="pb-3 font-semibold text-right">Cluster Segment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {filteredCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="py-3 pr-2">
                            <p className="font-semibold text-slate-200">{c.name}</p>
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{c.email}</span>
                          </td>
                          <td className="py-3 font-mono font-medium text-slate-300">
                            ${c.revenue.toLocaleString()}
                          </td>
                          <td className="py-3 text-center font-mono text-slate-400">{c.openRate}%</td>
                          <td className="py-3 text-center font-mono text-slate-400">{c.clickRate}%</td>
                          <td className="py-3 text-right">
                            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                              c.segment === "VIP" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                              c.segment === "Premium" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                              c.segment === "Regular" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                              c.segment === "Inactive" ? "bg-slate-800 border-slate-700 text-slate-400" :
                              "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            }`}>
                              {c.segment}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
