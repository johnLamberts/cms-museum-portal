export interface VisitorData {
  date: string;
  physical: number;
  virtual: number;
}

export interface ContentEngagementData {
  type: string;
  views: number;
  likes: number;
  shares: number;
}

export interface TopContentData {
  title: string;
  type: string;
  views: number;
  trend: number;
}

export interface StatCardProps {
  title?: string;
  value?: string;
  icon?: React.ReactNode;
  description?: string;
  trend?: number;
}
