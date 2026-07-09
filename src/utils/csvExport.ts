import { Campaign } from "../types";

/**
 * Converts a list of campaigns into a structured CSV format and triggers a browser download.
 * Handles cell value escaping for quotes, commas, and newlines.
 */
export function downloadCampaignsCSV(campaigns: Campaign[]) {
  if (!campaigns || campaigns.length === 0) {
    return;
  }

  const headers = [
    "Campaign ID",
    "Campaign Name",
    "Target Product",
    "Target Audience",
    "Goal",
    "Budget ($)",
    "Status",
    "Created At",
    "Objective",
    "Primary CTA"
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return "";
    let str = String(val);
    str = str.replace(/"/g, '""');
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str}"`;
    }
    return str;
  };

  const rows = campaigns.map(c => [
    c.id,
    c.name,
    c.product,
    c.audience,
    c.goal,
    c.budget,
    c.status,
    c.createdAt,
    c.objective || "",
    c.cta || ""
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(escapeCSV).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `campaign_analytics_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
