# Backend API Design Mismatches

## Overview

This document outlines the mismatches identified between the frontend requirements and the current backend API implementation after reviewing the generated API and the expected functionality.

## Dashboard API Mismatches

### 1. Response Schema Differences

**Expected (from dashboard-backend.md):**
```typescript
interface AdvertiserDashboardResponse {
  organizationType: 'advertiser';
  summary: {
    totalClicks: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  };
  // ... more detailed structure
}
```

**Current API (DomainDashboardData):**
```typescript
interface DomainDashboardData {
  lastUpdated?: string;
  organizationType?: DomainOrganizationType;
  recentActivity?: Array<DomainActivity>;
  summary?: object; // Generic object instead of typed structure
}
```

**Issues:**
- `summary` field is a generic `object` instead of a typed interface
- Missing specific fields like `campaignPerformance`, `revenueChart`, `billing`
- Organization type is an enum instead of a string literal
- Missing organization-specific response variations (Advertiser vs Agency vs Platform Owner)

### 2. Missing Organization-Specific Endpoints

**Expected:**
- Different response schemas based on organization type
- Dynamic content based on user's organization

**Current:**
- Single generic dashboard endpoint
- No differentiation between organization types in the response structure

### 3. Missing Chart Data Structure

**Expected:**
```typescript
revenueChart: {
  data: Array<{
    date: string;
    revenue: number;
    clicks: number;
    conversions: number;
  }>;
  period: string;
}
```

**Current:**
- No specific chart data structure in the API response
- Frontend would need to derive chart data from the generic summary object

## Reporting API Mismatches

### 1. Missing Reporting Endpoints

**Expected Endpoints:**
- `GET /api/v1/reports/performance/summary`
- `GET /api/v1/reports/performance/timeseries`
- `GET /api/v1/reports/performance/daily`
- `GET /api/v1/reports/conversions`
- `GET /api/v1/reports/clicks`

**Current:**
- Only dashboard-related endpoints exist
- No dedicated reporting endpoints in the generated API

### 2. Missing Pagination Support

**Expected:**
```typescript
pagination: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

**Current:**
- No pagination structures in the existing API models
- Activity endpoint has basic limit/offset but no pagination metadata

### 3. Missing Filter and Search Capabilities

**Expected:**
- Campaign filtering by IDs
- Search functionality for campaign names, transaction IDs
- Date range filtering with granularity options
- Status filtering for conversions

**Current:**
- Limited filtering options in existing endpoints
- No search capabilities in the current API structure

## Type Safety Issues

### 1. Generic Object Types

**Issue:** Many response fields use generic `object` or `any` types instead of specific interfaces.

**Impact:** 
- Loss of type safety in frontend code
- No IntelliSense support
- Runtime errors due to undefined properties

### 2. Missing Model Definitions

**Missing Models:**
- Performance metrics models
- Report data models
- Pagination models
- Error response models with specific error codes

## Authentication & Authorization

### 1. Missing Organization Context

**Expected:**
- Automatic filtering based on user's organization
- Row-level security considerations

**Current:**
- No clear indication of how organization context is handled
- API doesn't specify organization-based access control

## Recommendations

### Immediate Actions

1. **Update OpenAPI Specification:**
   - Add proper type definitions for `summary` objects
   - Create organization-specific response models
   - Add reporting endpoints with full specifications

2. **Add Missing Endpoints:**
   - Implement all reporting endpoints as specified in `report-backend.md`
   - Add proper pagination models
   - Include search and filter parameters

3. **Improve Type Safety:**
   - Replace generic `object` types with specific interfaces
   - Add comprehensive error response models
   - Define proper enum types for status fields

### Long-term Improvements

1. **API Versioning:**
   - Implement proper API versioning strategy
   - Maintain backward compatibility

2. **Documentation:**
   - Add comprehensive API documentation
   - Include examples for all endpoints
   - Document error codes and handling

3. **Testing:**
   - Add comprehensive API tests
   - Include integration tests with frontend
   - Performance testing for large datasets

## Impact on Frontend

### Current Workarounds

1. **Type Assertions:** Frontend code needs to use type assertions for the generic `summary` object
2. **Mock Data:** Using placeholder/mock data where API doesn't provide required structure
3. **Error Handling:** Generic error handling due to lack of specific error codes

### Development Workflow

1. **Service Layer:** Created abstraction layer (`dashboardService.ts`, `reportingService.ts`) to handle API inconsistencies
2. **Fallback Data:** Using default values and mock data where API responses are incomplete
3. **Gradual Migration:** Code is structured to easily adapt when proper API endpoints become available

## Conclusion

While the current API provides basic functionality, significant improvements are needed to fully support the dashboard and reporting features. The frontend has been implemented with abstraction layers to accommodate these limitations and can be easily updated once the backend APIs are enhanced according to the specifications.