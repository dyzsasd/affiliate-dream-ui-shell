# Dashboard Backend API Documentation

## Overview

This document outlines the backend API requirements for the Dashboard page, which displays different dashboard views based on the user's organization type (Advertiser, Agency, Platform Owner).

## API Endpoints

### 1. Get Dashboard Data

#### Endpoint
```
GET /api/dashboard
```

#### Authentication
- Requires valid JWT token
- User must be authenticated and have an associated organization

#### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Query Parameters
```typescript
interface DashboardQuery {
  period?: 'today' | '7d' | '30d' | '90d' | 'custom';
  startDate?: string; // ISO 8601 format (YYYY-MM-DD)
  endDate?: string;   // ISO 8601 format (YYYY-MM-DD)
  timezone?: string;  // Timezone identifier (e.g., 'America/New_York')
}
```

#### Response Schema

##### Advertiser Dashboard Response
```typescript
interface AdvertiserDashboardResponse {
  organizationType: 'advertiser';
  summary: {
    totalClicks: number;
    conversions: number;
    revenue: number;
    conversionRate: number; // Percentage (0-100)
  };
  campaignPerformance: {
    campaigns: Array<{
      id: string;
      name: string;
      clicks: number;
      conversions: number;
      revenue: number;
      conversionRate: number;
      status: 'active' | 'paused' | 'completed';
    }>;
    totalCampaigns: number;
    activeCampaigns: number;
  };
  revenueChart: {
    data: Array<{
      date: string; // ISO 8601 date
      revenue: number;
      clicks: number;
      conversions: number;
    }>;
    period: string;
  };
  recentActivity: Array<{
    id: string;
    type: 'campaign_created' | 'campaign_updated' | 'conversion' | 'click';
    campaignId?: string;
    campaignName?: string;
    description: string;
    timestamp: string; // ISO 8601 datetime
    metadata?: Record<string, any>;
  }>;
  billing?: {
    currentBalance: number;
    monthlySpend: number;
    currency: string;
  };
}
```

##### Agency Dashboard Response
```typescript
interface AgencyDashboardResponse {
  organizationType: 'agency';
  summary: {
    totalClients: number;
    totalRevenue: number;
    totalConversions: number;
    averageConversionRate: number;
  };
  clientPerformance: {
    clients: Array<{
      id: string;
      name: string;
      revenue: number;
      conversions: number;
      conversionRate: number;
      activeCampaigns: number;
    }>;
    topPerformers: Array<{
      clientId: string;
      clientName: string;
      revenue: number;
      growth: number; // Percentage change
    }>;
  };
  revenueChart: {
    data: Array<{
      date: string;
      totalRevenue: number;
      clientBreakdown: Array<{
        clientId: string;
        clientName: string;
        revenue: number;
      }>;
    }>;
    period: string;
  };
  recentActivity: Array<{
    id: string;
    type: 'client_added' | 'campaign_launched' | 'conversion' | 'payment';
    clientId?: string;
    clientName?: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
}
```

##### Platform Owner Dashboard Response
```typescript
interface PlatformOwnerDashboardResponse {
  organizationType: 'platform_owner';
  summary: {
    totalUsers: number;
    totalRevenue: number;
    totalTransactions: number;
    platformGrowth: number; // Percentage
  };
  userMetrics: {
    activeUsers: number;
    newUsers: number;
    userGrowthRate: number;
    usersByType: {
      advertisers: number;
      agencies: number;
      publishers: number;
    };
  };
  revenueMetrics: {
    totalRevenue: number;
    revenueGrowth: number;
    averageRevenuePerUser: number;
    revenueBySource: Array<{
      source: string;
      revenue: number;
      percentage: number;
    }>;
  };
  systemHealth: {
    uptime: number; // Percentage
    responseTime: number; // Average in milliseconds
    errorRate: number; // Percentage
    activeConnections: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'user_registered' | 'system_alert' | 'revenue_milestone' | 'error';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
}
```

### 2. Get Campaign Performance Details

#### Endpoint
```
GET /api/dashboard/campaigns/{campaignId}
```

#### Response Schema
```typescript
interface CampaignDetailResponse {
  campaign: {
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate?: string;
    budget: number;
    spent: number;
  };
  performance: {
    clicks: number;
    impressions: number;
    conversions: number;
    revenue: number;
    ctr: number; // Click-through rate
    cpc: number; // Cost per click
    cpa: number; // Cost per acquisition
  };
  dailyStats: Array<{
    date: string;
    clicks: number;
    impressions: number;
    conversions: number;
    revenue: number;
  }>;
}
```

### 3. Get Recent Activity

#### Endpoint
```
GET /api/dashboard/activity
```

#### Query Parameters
```typescript
interface ActivityQuery {
  limit?: number; // Default: 10, Max: 50
  offset?: number;
  type?: string[]; // Filter by activity types
  since?: string; // ISO 8601 datetime
}
```

#### Response Schema
```typescript
interface ActivityResponse {
  activities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
  total: number;
  hasMore: boolean;
}
```

## Error Responses

### Standard Error Format
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
  requestId: string;
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): User lacks permission for requested resource
- `NOT_FOUND` (404): Organization or resource not found
- `VALIDATION_ERROR` (400): Invalid query parameters
- `RATE_LIMITED` (429): Too many requests
- `SERVER_ERROR` (500): Internal server error

## Implementation Notes

### Performance Considerations
1. **Caching**: Implement Redis caching for dashboard data with TTL of 5-15 minutes
2. **Aggregations**: Pre-calculate daily/hourly aggregations for faster queries
3. **Pagination**: Limit response sizes and implement cursor-based pagination for large datasets
4. **Database Indexing**: Create indexes on frequently queried fields (date ranges, organization_id, user_id)

### Security Requirements
1. **Row Level Security (RLS)**: Ensure users can only access their organization's data
2. **Rate Limiting**: Implement per-user rate limiting to prevent abuse
3. **Input Validation**: Validate all query parameters and sanitize inputs
4. **Audit Logging**: Log all dashboard data access for compliance

### Data Consistency
1. **Real-time Updates**: Consider WebSocket connections for real-time dashboard updates
2. **Data Freshness**: Implement data freshness indicators to show when data was last updated
3. **Timezone Handling**: All timestamps should be in UTC, with timezone conversion handled on frontend

### Monitoring and Analytics
1. **API Metrics**: Track response times, error rates, and usage patterns
2. **Dashboard Usage**: Monitor which dashboard sections are most accessed
3. **Performance Alerts**: Set up alerts for slow queries or high error rates

### Database Schema Recommendations

#### Core Tables
```sql
-- Dashboard metrics table for pre-calculated aggregations
CREATE TABLE dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  metric_type VARCHAR(50) NOT NULL, -- 'daily_summary', 'campaign_performance', etc.
  metric_date DATE NOT NULL,
  metric_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id UUID,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_dashboard_metrics_org_date ON dashboard_metrics(organization_id, metric_date);
CREATE INDEX idx_activity_log_org_created ON activity_log(organization_id, created_at DESC);
```

## API Versioning
- Current version: `v1`
- Include version in URL path: `/api/v1/dashboard`
- Maintain backward compatibility for at least 2 major versions

## Testing Requirements
1. **Unit Tests**: Test all business logic and data transformations
2. **Integration Tests**: Test API endpoints with real database
3. **Performance Tests**: Load testing for dashboard endpoints
4. **Security Tests**: Verify RLS policies and authorization checks