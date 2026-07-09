import React, { useState, useEffect } from "react";
import { 
  Sparkles, LayoutDashboard, Compass, Mail, Sliders, Eye, Users, 
  Clock, GitBranch, Send, FileText, MessageSquare, Settings, 
  LogOut, Bell, ShieldAlert, X, CheckSquare, ListOrdered
} from "lucide-react";
import { User, Notification, AuditLog } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  notifications: Notification[];
  onMarkNotificationsRead: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout,
  notifications,
  onMarkNotificationsRead
}: SidebarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch Audit Logs when opened
  useEffect(() => {
    if (showAuditLogs) {
      fetch("/api/system/audit")
        .then(res => res.json())
        .then(data => setAuditLogs(data))
        .catch(err => console.error(err));
    }
  }, [showAuditLogs]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "planner", label: "AI Campaign Planner", icon: Compass },
    { id: "generator", label: "AI Email Generator", icon: Mail },
    { id: "subjects", label: "AI Subject Optimizer", icon: Sliders },
    { id: "spam", label: "AI Spam Checker", icon: Eye },
    { id: "segmentation", label: "AI Customer Segmentation", icon: Users },
    { id: "timing", label: "AI Send Time Predictor", icon: Clock },
    { id: "ab-testing", label: "A/B Testing", icon: GitBranch },
    { id: "sending", label: "Campaign Dispatcher", icon: Send },
    { id: "reports", label: "Report Auditor", icon: FileText },
    { id: "chat", label: "AI Assistant Chat", icon: MessageSquare },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 text-white relative z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-md">AgentMail AI</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1 text-slate-400 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-slate-400 hover:text-white focus:outline-none"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
      </div>

      {/* Main Sidebar (Desktop / Responsive Mobile overlay) */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-30 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 md:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:h-screen
      `}>
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
                  AgentMail <span className="text-[10px] font-semibold bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">AI</span>
                </h2>
                <span className="text-[10px] text-emerald-400 font-mono mt-1 block flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Autonomous active
                </span>
              </div>
            </div>
            {mobileOpen && (
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white md:hidden">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Notification Tray Activator */}
          <div className="px-4 py-3 flex items-center gap-2">
            <button
              onClick={() => {
                setShowNotifications(true);
                onMarkNotificationsRead();
              }}
              className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-lg py-2 px-3 text-xs text-slate-300 flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-blue-400" />
                Alerts
              </span>
              {unreadCount > 0 ? (
                <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {unreadCount} New
                </span>
              ) : (
                <span className="text-slate-600">0</span>
              )}
            </button>

            <button
              onClick={() => setShowAuditLogs(true)}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-lg p-2 text-slate-300 hover:text-white transition-all"
              title="View Audit Logs"
            >
              <ListOrdered className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-4 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 py-2 px-3.5 rounded-lg text-left text-xs font-medium tracking-wide transition-all cursor-pointer
                    ${isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 font-semibold" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"}
                  `}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer Account details */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/40">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8.5 h-8.5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">
                {currentUser?.name ? currentUser.name[0] : "S"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{currentUser?.name || "Sarah Jenkins"}</p>
                <span className="text-[9px] font-semibold tracking-wider text-blue-400 font-mono block mt-0.5">
                  {currentUser?.role || "MARKETING MANAGER"}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveTab("settings")}
              className={`p-1 rounded text-slate-500 hover:text-slate-200 transition-colors ${activeTab === 'settings' ? 'text-blue-400' : ''}`}
              title="Workspace Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-red-950/20 hover:text-red-400 border border-slate-800 hover:border-red-500/20 text-xs font-medium text-slate-400 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Workspace
          </button>
        </div>
      </aside>

      {/* Notifications Backdrop Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <h3 className="text-md font-bold text-white">System Alerts & Notifications</h3>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No notifications recorded in this session.
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id}
                    className={`p-3.5 rounded-lg border text-xs leading-normal relative ${
                      n.type === "success" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" :
                      n.type === "warning" ? "bg-amber-500/5 border-amber-500/20 text-amber-300" :
                      n.type === "error" ? "bg-red-500/5 border-red-500/20 text-red-300" :
                      "bg-slate-950 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-1.5 text-slate-400">{n.message}</p>
                    {!n.read && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Backdrop Drawer */}
      {showAuditLogs && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-500" />
                <h3 className="text-md font-bold text-white">Security & Action Audit Logs</h3>
              </div>
              <button 
                onClick={() => setShowAuditLogs(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 font-mono text-[11px] space-y-3">
              {auditLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  Fetching audit events...
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-slate-400">
                    <div className="flex justify-between items-center text-slate-500 mb-1">
                      <span>USER: {log.userName} ({log.userId})</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-blue-400 font-bold">ACTION: {log.action}</div>
                    <div className="mt-1 text-slate-300">DETAILS: {log.details}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
