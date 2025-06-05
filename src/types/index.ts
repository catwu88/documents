export interface Business {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  description?: string;
  specialOffer?: string;
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'approved' | 'published' | 'rejected';
  category: string;
  tags: string[];
  photos: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  analytics?: BusinessAnalytics;
}

export interface BusinessAnalytics {
  views: number;
  clicks: number;
  conversions: number;
  avgTimeOnPage: number;
  clickThroughRate: number;
  conversionRate: number;
}

export interface Event {
  id: string;
  name: string;
  title?: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  status: 'draft' | 'published' | 'archived';
  category?: string;
  location?: string;
  address?: string;
  maxAttendees?: number;
  attendees?: number;
  price?: number;
  registrationRequired?: boolean;
  organizer?: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  photos?: string[];
  tags?: string[];
  geofence?: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  businessIds: string[];
  createdAt: string;
  updatedAt: string;
  analytics?: EventAnalytics;
}

export interface EventAnalytics {
  participatingBusinesses: number;
  totalViews: number;
  totalClicks: number;
  avgEngagement: number;
  views?: number;
  clicks?: number;
  shares?: number;
  conversionRate?: number;
}

export interface Tag {
  id: string;
  name: string;
  category: string;
  isSystem: boolean;
  usageCount: number;
}

export interface DashboardMetrics {
  totalBusinesses: number;
  publishedBusinesses: number;
  pendingBusinesses: number;
  activeEvents: number;
  todayViews: number;
  todayClicks: number;
  conversionRate: number;
  topBusinesses: Business[];
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'analyst';
  lastLogin: string;
} 