# Report Backend API Implementation Guide

This document outlines the necessary backend API endpoints and schemas required to support the Performance Report page functionality.

## Overview

The reporting system requires several API endpoints to provide:
- Campaign performance summary statistics
- Time-series performance data for charts
- Detailed daily, conversion, and click event data
- Campaign filtering and search capabilities

## API Endpoints

### 1. Get Performance Summary

**Endpoint:** `GET /api/v1/reports/performance/summary`

**Description:** Returns aggregated performance metrics for the specified date range and filters.

**Query Parameters:**
```typescript
interface PerformanceSummaryRequest {
  startDate: string;        // ISO date format (YYYY-MM-DD)
  endDate: string;          // ISO date format (YYYY-MM-DD)
  campaignIds?: string[];   // Optional array of campaign IDs to filter
  affiliateId?: string;     // Optional affiliate ID filter
}
```

**Response Schema:**
```typescript
interface PerformanceSummaryResponse {
  data: {
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    conversionRate: number;     // Percentage (0-100)
    averageRevenue: number;
    clickThroughRate: number;   // Percentage (0-100)
    totalImpressions: number;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
  status: "success" | "error";
  message?: string;
}
```

### 2. Get Performance Time Series

**Endpoint:** `GET /api/v1/reports/performance/timeseries`

**Description:** Returns daily performance data for chart visualization.

**Query Parameters:**
```typescript
interface PerformanceTimeSeriesRequest {
  startDate: string;        // ISO date format (YYYY-MM-DD)
  endDate: string;          // ISO date format (YYYY-MM-DD)
  campaignIds?: string[];   // Optional array of campaign IDs to filter
  affiliateId?: string;     // Optional affiliate ID filter
  granularity?: "daily" | "hourly" | "weekly" | "monthly"; // Default: "daily"
}
```

**Response Schema:**
```typescript
interface PerformanceTimeSeriesResponse {
  data: {
    date: string;           // ISO date format (YYYY-MM-DD)
    clicks: number;
    impressions: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    clickThroughRate: number;
  }[];
  status: "success" | "error";
  message?: string;
}
```

### 3. Get Daily Performance Report

**Endpoint:** `GET /api/v1/reports/performance/daily`

**Description:** Returns detailed daily performance breakdown with pagination and search.

**Query Parameters:**
```typescript
interface DailyReportRequest {
  startDate: string;        // ISO date format (YYYY-MM-DD)
  endDate: string;          // ISO date format (YYYY-MM-DD)
  campaignIds?: string[];   // Optional array of campaign IDs to filter
  affiliateId?: string;     // Optional affiliate ID filter
  search?: string;          // Search term for campaign names
  page?: number;            // Page number (default: 1)
  limit?: number;           // Items per page (default: 10, max: 100)
  sortBy?: "date" | "clicks" | "conversions" | "revenue";
  sortOrder?: "asc" | "desc"; // Default: "desc"
}
```

**Response Schema:**
```typescript
interface DailyReportResponse {
  data: {
    date: string;           // ISO date format (YYYY-MM-DD)
    campaignId: string;
    campaignName: string;
    clicks: number;
    impressions: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    clickThroughRate: number;
    payouts: number;
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  status: "success" | "error";
  message?: string;
}
```

### 4. Get Conversions Report

**Endpoint:** `GET /api/v1/reports/conversions`

**Description:** Returns detailed conversion events with pagination and search.

**Query Parameters:**
```typescript
interface ConversionsReportRequest {
  startDate: string;        // ISO date format (YYYY-MM-DD)
  endDate: string;          // ISO date format (YYYY-MM-DD)
  campaignIds?: string[];   // Optional array of campaign IDs to filter
  affiliateId?: string;     // Optional affiliate ID filter
  search?: string;          // Search term for campaign names or transaction IDs
  page?: number;            // Page number (default: 1)
  limit?: number;           // Items per page (default: 10, max: 100)
  status?: "pending" | "approved" | "rejected" | "all"; // Default: "all"
  sortBy?: "timestamp" | "payout" | "campaign" | "status";
  sortOrder?: "asc" | "desc"; // Default: "desc"
}
```

**Response Schema:**
```typescript
interface ConversionsReportResponse {
  data: {
    id: string;
    timestamp: string;      // ISO datetime format
    transactionId: string;
    campaignId: string;
    campaignName: string;
    offerId: string;
    offerName: string;
    status: "pending" | "approved" | "rejected";
    payout: number;
    currency: string;
    affiliateId: string;
    affiliateName: string;
    clickId?: string;
    conversionValue?: number;
    sub1?: string;
    sub2?: string;
    sub3?: string;
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  status: "success" | "error";
  message?: string;
}
```

### 5. Get Clicks Report

**Endpoint:** `GET /api/v1/reports/clicks`

**Description:** Returns detailed click events with pagination and search.

**Query Parameters:**
```typescript
interface ClicksReportRequest {
  startDate: string;        // ISO date format (YYYY-MM-DD)
  endDate: string;          // ISO date format (YYYY-MM-DD)
  campaignIds?: string[];   // Optional array of campaign IDs to filter
  affiliateId?: string;     // Optional affiliate ID filter
  search?: string;          // Search term for campaign names or click IDs
  page?: number;            // Page number (default: 1)
  limit?: number;           // Items per page (default: 10, max: 100)
  sortBy?: "timestamp" | "campaign" | "affiliate";
  sortOrder?: "asc" | "desc"; // Default: "desc"
}
```

**Response Schema:**
```typescript
interface ClicksReportResponse {
  data: {
    id: string;
    timestamp: string;      // ISO datetime format
    campaignId: string;
    campaignName: string;
    offerId: string;
    offerName: string;
    affiliateId: string;
    affiliateName: string;
    ipAddress: string;
    userAgent: string;
    country: string;
    region?: string;
    city?: string;
    referrerUrl?: string;
    landingPageUrl: string;
    sub1?: string;
    sub2?: string;
    sub3?: string;
    converted: boolean;
    conversionId?: string;
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  status: "success" | "error";
  message?: string;
}
```

### 6. Get Campaigns List

**Endpoint:** `GET /api/v1/campaigns`

**Description:** Returns list of campaigns for filter dropdown.

**Query Parameters:**
```typescript
interface CampaignsListRequest {
  affiliateId?: string;     // Optional affiliate ID filter
  status?: "active" | "paused" | "draft" | "all"; // Default: "active"
  search?: string;          // Search term for campaign names
}
```

**Response Schema:**
```typescript
interface CampaignsListResponse {
  data: {
    id: string;
    name: string;
    status: "active" | "paused" | "draft";
  }[];
  status: "success" | "error";
  message?: string;
}
```

## Error Handling

All endpoints should return consistent error responses:

```typescript
interface ErrorResponse {
  status: "error";
  message: string;
  code: string;           // Error code for programmatic handling
  details?: any;          // Additional error details
}
```

Common error codes:
- `INVALID_DATE_RANGE`: Start date is after end date
- `DATE_RANGE_TOO_LARGE`: Date range exceeds maximum allowed period
- `INVALID_CAMPAIGN_ID`: One or more campaign IDs don't exist
- `UNAUTHORIZED`: User doesn't have permission to view requested data
- `RATE_LIMIT_EXCEEDED`: Too many requests in time window

## Implementation Notes

### Performance Considerations
1. **Caching**: Implement caching for summary and time series data, especially for longer date ranges
2. **Pagination**: Limit maximum page size to prevent performance issues
3. **Database Indexing**: Ensure proper indexes on date, campaign_id, and affiliate_id columns
4. **Query Optimization**: Use database-specific optimizations for large dataset queries

### Security
1. **Authentication**: All endpoints require valid authentication tokens
2. **Authorization**: Users should only access data they have permission to view
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Input Validation**: Validate all input parameters and sanitize search terms

### Data Consistency
1. **Time Zones**: All timestamps should be in UTC and clearly documented
2. **Currency**: Ensure consistent currency handling across all monetary values
3. **Precision**: Define precision for decimal values (revenue, rates, etc.)

### Monitoring
1. **Logging**: Log all API requests with relevant metadata
2. **Metrics**: Track response times and error rates
3. **Alerting**: Set up alerts for high error rates or slow response times

## Database Schema Considerations

The backend implementation will require tables for:
- `campaigns` - Campaign information
- `clicks` - Click tracking events
- `conversions` - Conversion tracking events
- `affiliates` - Affiliate information
- `offers` - Offer information

Key relationships:
- Clicks → Campaigns (many-to-one)
- Conversions → Campaigns (many-to-one)
- Conversions → Clicks (one-to-one, optional)
- Campaigns → Affiliates (many-to-one)
- Campaigns → Offers (many-to-many)

## Testing

Ensure comprehensive testing for:
1. **Unit Tests**: Test individual functions and calculations
2. **Integration Tests**: Test API endpoints with various parameters
3. **Performance Tests**: Test with large datasets and concurrent requests
4. **Security Tests**: Test authentication, authorization, and input validation