# Data Analytics API Specification

## Overview

This document outlines the proposed data analytics API endpoints that should be implemented in the backend to support the dashboard and reporting features of the affiliate marketing platform.

## Base URL

```
https://api.affiliate-platform.com/api/v1/analytics
```

## Authentication

All endpoints require Bearer token authentication:
```
Authorization: Bearer <jwt_token>
```

## Core Analytics Endpoints

### 1. Dashboard Analytics

#### GET `/analytics/dashboard/overview`

Get high-level metrics for the advertiser dashboard.

**Query Parameters:**
- `date_range` (string, optional): `7d`, `30d`, `90d`, `1y` (default: `7d`)
- `organization_id` (int, required): Organization ID
- `advertiser_id` (int, optional): Specific advertiser ID filter

**Response Schema:**
```json
{
  "data": {
    "summary": {
      "total_clicks": 15247,
      "total_conversions": 342,
      "total_revenue": 85430.50,
      "conversion_rate": 2.24,
      "click_through_rate": 1.85,
      "average_order_value": 249.78
    },
    "trends": {
      "clicks_change": "+12.5%",
      "conversions_change": "-3.2%",
      "revenue_change": "+8.7%",
      "conversion_rate_change": "+0.3%"
    },
    "daily_data": [
      {
        "date": "2025-01-01",
        "clicks": 1245,
        "conversions": 28,
        "revenue": 6985.50,
        "impressions": 67320
      }
    ]
  },
  "meta": {
    "date_range": "7d",
    "generated_at": "2025-08-05T10:30:00Z"
  }
}
```

### 2. Performance Analytics

#### GET `/analytics/performance`

Get detailed performance metrics for reports.

**Query Parameters:**
- `date_range` (string, required): `7d`, `30d`, `90d`, `1y`
- `organization_id` (int, required): Organization ID
- `campaign_ids` (array of int, optional): Filter by specific campaigns
- `advertiser_ids` (array of int, optional): Filter by specific advertisers
- `group_by` (string, optional): `day`, `week`, `month` (default: `day`)
- `metrics` (array of string, optional): Specific metrics to include

**Response Schema:**
```json
{
  "data": {
    "summary": {
      "total_impressions": 2450000,
      "total_clicks": 42350,
      "total_conversions": 1245,
      "total_revenue": 312750.25,
      "click_through_rate": 1.73,
      "conversion_rate": 2.94,
      "cost_per_click": 1.25,
      "cost_per_acquisition": 42.50,
      "return_on_ad_spend": 4.2
    },
    "time_series": [
      {
        "date": "2025-01-01",
        "impressions": 35000,
        "clicks": 605,
        "conversions": 18,
        "revenue": 4485.75,
        "ctr": 1.73,
        "conversion_rate": 2.97,
        "cpc": 1.22,
        "cpa": 41.25
      }
    ],
    "breakdown": {
      "by_campaign": [
        {
          "campaign_id": 123,
          "campaign_name": "Summer Promotion",
          "clicks": 15240,
          "conversions": 425,
          "revenue": 106250.50,
          "conversion_rate": 2.79
        }
      ],
      "by_device": [
        {
          "device_type": "mobile",
          "clicks": 25410,
          "conversions": 745,
          "revenue": 187625.25
        }
      ],
      "by_geo": [
        {
          "country": "US",
          "region": "California", 
          "clicks": 8945,
          "conversions": 267,
          "revenue": 66825.75
        }
      ]
    }
  }
}
```

### 3. Conversion Analytics

#### GET `/analytics/conversions`

Get detailed conversion tracking and analysis.

**Query Parameters:**
- `date_range` (string, required): `7d`, `30d`, `90d`, `1y`
- `organization_id` (int, required): Organization ID
- `status` (array of string, optional): `pending`, `approved`, `rejected`
- `campaign_ids` (array of int, optional): Filter by campaigns
- `page` (int, optional): Page number for pagination (default: 1)
- `page_size` (int, optional): Results per page (default: 50, max: 1000)

**Response Schema:**
```json
{
  "data": {
    "summary": {
      "total_conversions": 1245,
      "approved_conversions": 1089,
      "pending_conversions": 98,
      "rejected_conversions": 58,
      "approval_rate": 87.5,
      "total_approved_value": 271875.50,
      "total_pending_value": 24325.25,
      "average_conversion_value": 218.75
    },
    "conversions": [
      {
        "conversion_id": "conv_12345",
        "transaction_id": "txn_abc123",
        "timestamp": "2025-01-15T14:30:00Z",
        "campaign_id": 123,
        "campaign_name": "Summer Promotion",
        "advertiser_id": 45,
        "publisher_id": 67,
        "status": "approved",
        "value": 249.99,
        "currency": "USD",
        "commission": 24.99,
        "customer_info": {
          "country": "US",
          "device_type": "mobile",
          "source": "organic"
        },
        "approved_at": "2025-01-16T09:15:00Z",
        "approved_by": "user_789"
      }
    ],
    "trends": {
      "conversion_value_trend": [
        {
          "date": "2025-01-01",
          "total_value": 12475.50,
          "approved_value": 10825.25,
          "pending_value": 1650.25
        }
      ]
    }
  },
  "pagination": {
    "page": 1,
    "page_size": 50,
    "total_pages": 25,
    "total_count": 1245
  }
}
```

### 4. Publisher Analytics

#### GET `/analytics/publishers`

Get analytics data for publisher performance.

**Query Parameters:**
- `date_range` (string, required): `7d`, `30d`, `90d`, `1y`
- `organization_id` (int, required): Organization ID
- `publisher_ids` (array of int, optional): Specific publishers
- `sort_by` (string, optional): `clicks`, `conversions`, `revenue` (default: `revenue`)
- `sort_order` (string, optional): `asc`, `desc` (default: `desc`)

**Response Schema:**
```json
{
  "data": {
    "publishers": [
      {
        "publisher_id": 67,
        "publisher_name": "TechBlog Pro",
        "domain": "techblogpro.com",
        "clicks": 8945,
        "conversions": 234,
        "revenue": 58675.50,
        "conversion_rate": 2.61,
        "average_order_value": 250.75,
        "first_conversion": "2024-12-01T10:00:00Z",
        "last_conversion": "2025-01-14T16:45:00Z",
        "status": "active",
        "performance_tier": "premium"
      }
    ],
    "summary": {
      "total_active_publishers": 45,
      "new_publishers": 8,
      "top_performing_publishers": 12
    }
  }
}
```

### 5. Campaign Analytics

#### GET `/analytics/campaigns/{campaign_id}`

Get detailed analytics for a specific campaign.

**Path Parameters:**
- `campaign_id` (int, required): Campaign ID

**Query Parameters:**
- `date_range` (string, required): `7d`, `30d`, `90d`, `1y`
- `breakdown` (string, optional): `publisher`, `geo`, `device` (default: `publisher`)

**Response Schema:**
```json
{
  "data": {
    "campaign_info": {
      "campaign_id": 123,
      "name": "Summer Promotion",
      "status": "active",
      "start_date": "2024-12-01T00:00:00Z",
      "end_date": "2025-03-31T23:59:59Z"
    },
    "performance": {
      "total_clicks": 15240,
      "total_conversions": 425,
      "total_revenue": 106250.50,
      "conversion_rate": 2.79,
      "cost_per_acquisition": 38.75,
      "return_on_investment": 3.8
    },
    "breakdown": [
      {
        "dimension": "publisher",
        "publisher_id": 67,
        "publisher_name": "TechBlog Pro",
        "clicks": 2450,
        "conversions": 68,
        "revenue": 17025.50
      }
    ],
    "time_series": [
      {
        "date": "2025-01-01",
        "clicks": 245,
        "conversions": 7,
        "revenue": 1750.25
      }
    ]
  }
}
```

### 6. Real-time Analytics

#### GET `/analytics/realtime`

Get real-time analytics data for live monitoring.

**Query Parameters:**
- `organization_id` (int, required): Organization ID
- `window` (string, optional): `1h`, `6h`, `24h` (default: `1h`)

**Response Schema:**
```json
{
  "data": {
    "current_metrics": {
      "active_sessions": 1247,
      "clicks_last_hour": 342,
      "conversions_last_hour": 8,
      "revenue_last_hour": 2015.75
    },
    "minute_by_minute": [
      {
        "timestamp": "2025-08-05T10:29:00Z",
        "clicks": 12,
        "conversions": 0,
        "revenue": 0.00
      }
    ],
    "top_performers": {
      "campaigns": [
        {
          "campaign_id": 123,
          "name": "Summer Promotion",
          "clicks_last_hour": 95
        }
      ],
      "publishers": [
        {
          "publisher_id": 67,
          "domain": "techblogpro.com",
          "clicks_last_hour": 23
        }
      ]
    }
  },
  "updated_at": "2025-08-05T10:30:00Z"
}
```

## Data Aggregation Endpoints

### 7. Custom Reports

#### POST `/analytics/reports/custom`

Generate custom analytics reports with flexible parameters.

**Request Schema:**
```json
{
  "name": "Q1 Performance Report",
  "date_range": {
    "start_date": "2025-01-01",
    "end_date": "2025-03-31"
  },
  "filters": {
    "organization_id": 123,
    "campaign_ids": [123, 456],
    "publisher_ids": [67, 89],
    "geos": ["US", "CA"],
    "device_types": ["mobile", "desktop"]
  },
  "metrics": ["clicks", "conversions", "revenue", "ctr", "conversion_rate"],
  "dimensions": ["date", "campaign", "publisher"],
  "group_by": "day",
  "format": "json"
}
```

**Response Schema:**
```json
{
  "report_id": "rpt_abc123",
  "status": "completed",
  "data": {
    "summary": {},
    "breakdown": [],
    "time_series": []
  },
  "generated_at": "2025-08-05T10:30:00Z",
  "expires_at": "2025-08-12T10:30:00Z"
}
```

## Error Responses

All endpoints use standard HTTP status codes and return errors in this format:

```json
{
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "Date range cannot exceed 1 year",
    "details": {
      "max_range": "365 days",
      "provided_range": "400 days"
    }
  }
}
```

## Rate Limiting

- **Dashboard endpoints**: 100 requests per minute
- **Report endpoints**: 60 requests per minute  
- **Real-time endpoints**: 200 requests per minute
- **Custom reports**: 10 requests per minute

## Data Retention

- **Raw analytics data**: 2 years
- **Aggregated daily data**: 5 years
- **Real-time data**: 7 days
- **Custom reports**: 30 days

## Implementation Notes

1. **Caching**: Implement Redis caching for frequently accessed data with TTL based on data freshness requirements
2. **Database indexing**: Ensure proper indexing on date ranges, organization_id, and campaign_id fields
3. **Data aggregation**: Pre-compute daily, weekly, and monthly aggregations for better performance
4. **Asynchronous processing**: Use job queues for complex custom reports
5. **Data validation**: Validate date ranges, ensure organization access permissions
6. **Monitoring**: Implement comprehensive logging and monitoring for all analytics endpoints