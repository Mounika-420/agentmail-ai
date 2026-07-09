export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Marketing Manager' | 'Viewer';
}

export interface Campaign {
  id: string;
  name: string;
  product: string;
  audience: string;
  goal: string;
  budget: number;
  plan?: string;
  strategy?: string;
  objective?: string;
  persona?: string;
  cta?: string;
  timeline?: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  title: string;
  type: 'Welcome' | 'Promotional' | 'Festival' | 'Follow-up' | 'Cart Abandonment' | 'Product Launch' | 'Newsletter';
  tone: 'Professional' | 'Friendly' | 'Luxury' | 'Formal';
  subject: string;
  body: string;
  spamScore?: number;
  readability?: string;
  grammarIssues?: string[];
  spamWordsFound?: string[];
  professionalScore?: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  segment: 'VIP' | 'Premium' | 'Regular' | 'Inactive' | 'New';
  revenue: number;
  openRate: number;
  clickRate: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface Recommendation {
  id: string;
  type: 'CTA' | 'Subject' | 'Timing' | 'Personalization';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export interface ABTest {
  id: string;
  campaignId: string;
  subjectA: string;
  subjectB: string;
  predictedWinner: 'A' | 'B';
  confidenceScore: number;
  reason: string;
}
