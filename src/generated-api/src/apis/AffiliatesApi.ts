/* tslint:disable */
/* eslint-disable */
/**
 * Affiliate Backend API
 * API Server for Affiliate Backend Application
 *
 * The version of the OpenAPI document: 1.0
 * Contact: support@example.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  DomainAffiliate,
  DomainAffiliateProviderMapping,
  HandlersAffiliatesSearchRequest,
  HandlersAffiliatesSearchResponse,
  HandlersCreateAffiliateProviderMappingRequest,
  HandlersCreateAffiliateRequest,
  HandlersErrorResponse,
  HandlersUpdateAffiliateProviderMappingRequest,
  HandlersUpdateAffiliateRequest,
} from '../models/index';
import {
    DomainAffiliateFromJSON,
    DomainAffiliateToJSON,
    DomainAffiliateProviderMappingFromJSON,
    DomainAffiliateProviderMappingToJSON,
    HandlersAffiliatesSearchRequestFromJSON,
    HandlersAffiliatesSearchRequestToJSON,
    HandlersAffiliatesSearchResponseFromJSON,
    HandlersAffiliatesSearchResponseToJSON,
    HandlersCreateAffiliateProviderMappingRequestFromJSON,
    HandlersCreateAffiliateProviderMappingRequestToJSON,
    HandlersCreateAffiliateRequestFromJSON,
    HandlersCreateAffiliateRequestToJSON,
    HandlersErrorResponseFromJSON,
    HandlersErrorResponseToJSON,
    HandlersUpdateAffiliateProviderMappingRequestFromJSON,
    HandlersUpdateAffiliateProviderMappingRequestToJSON,
    HandlersUpdateAffiliateRequestFromJSON,
    HandlersUpdateAffiliateRequestToJSON,
} from '../models/index';

export interface AffiliateProviderMappingsMappingIdDeleteRequest {
    mappingId: number;
}

export interface AffiliateProviderMappingsMappingIdPutRequest {
    mappingId: number;
    request: HandlersUpdateAffiliateProviderMappingRequest;
}

export interface AffiliateProviderMappingsPostRequest {
    request: HandlersCreateAffiliateProviderMappingRequest;
}

export interface AffiliatesIdDeleteRequest {
    id: number;
}

export interface AffiliatesIdGetRequest {
    id: number;
}

export interface AffiliatesIdProviderMappingsProviderTypeGetRequest {
    id: number;
    providerType: string;
}

export interface AffiliatesIdPutRequest {
    id: number;
    request: HandlersUpdateAffiliateRequest;
}

export interface AffiliatesPostRequest {
    request: HandlersCreateAffiliateRequest;
}

export interface AffiliatesSearchPostRequest {
    request: HandlersAffiliatesSearchRequest;
    page?: number;
    pageSize?: number;
}

export interface OrganizationsIdAffiliatesGetRequest {
    id: number;
    page?: number;
    pageSize?: number;
}

/**
 * 
 */
export class AffiliatesApi extends runtime.BaseAPI {

    /**
     * Deletes a mapping between an affiliate and a provider
     * Delete affiliate provider mapping
     */
    async affiliateProviderMappingsMappingIdDeleteRaw(requestParameters: AffiliateProviderMappingsMappingIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['mappingId'] == null) {
            throw new runtime.RequiredError(
                'mappingId',
                'Required parameter "mappingId" was null or undefined when calling affiliateProviderMappingsMappingIdDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/affiliate-provider-mappings/{mappingId}`.replace(`{${"mappingId"}}`, encodeURIComponent(String(requestParameters['mappingId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes a mapping between an affiliate and a provider
     * Delete affiliate provider mapping
     */
    async affiliateProviderMappingsMappingIdDelete(requestParameters: AffiliateProviderMappingsMappingIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.affiliateProviderMappingsMappingIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Updates a mapping between an affiliate and a provider
     * Update affiliate provider mapping
     */
    async affiliateProviderMappingsMappingIdPutRaw(requestParameters: AffiliateProviderMappingsMappingIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DomainAffiliateProviderMapping>> {
        if (requestParameters['mappingId'] == null) {
            throw new runtime.RequiredError(
                'mappingId',
                'Required parameter "mappingId" was null or undefined when calling affiliateProviderMappingsMappingIdPut().'
            );
        }

        if (requestParameters['request'] == null) {
            throw new runtime.RequiredError(
                'request',
                'Required parameter "request" was null or undefined when calling affiliateProviderMappingsMappingIdPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/affiliate-provider-mappings/{mappingId}`.replace(`{${"mappingId"}}`, encodeURIComponent(String(requestParameters['mappingId']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: HandlersUpdateAffiliateProviderMappingRequestToJSON(requestParameters['request']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DomainAffiliateProviderMappingFromJSON(jsonValue));
    }

    /**
     * Updates a mapping between an affiliate and a provider
     * Update affiliate provider mapping
     */
    async affiliateProviderMappingsMappingIdPut(requestParameters: AffiliateProviderMappingsMappingIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DomainAffiliateProviderMapping> {
        const response = await this.affiliateProviderMappingsMappingIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a new mapping between an affiliate and a provider
     * Create a new affiliate provider mapping
     */
    async affiliateProviderMappingsPostRaw(requestParameters: AffiliateProviderMappingsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DomainAffiliateProviderMapping>> {
        if (requestParameters['request'] == null) {
            throw new runtime.RequiredError(
                'request',
                'Required parameter "request" was null or undefined when calling affiliateProviderMappingsPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/affiliate-provider-mappings`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: HandlersCreateAffiliateProviderMappingRequestToJSON(requestParameters['request']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DomainAffiliateProviderMappingFromJSON(jsonValue));
    }

    /**
     * Creates a new mapping between an affiliate and a provider
     * Create a new affiliate provider mapping
     */
    async affiliateProviderMappingsPost(requestParameters: AffiliateProviderMappingsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DomainAffiliateProviderMapping> {
        const response = await this.affiliateProviderMappingsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Deletes an affiliate by its ID
     * Delete affiliate
     */
    async affiliatesIdDeleteRaw(requestParameters: AffiliatesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling affiliatesIdDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/affiliates/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes an affiliate by its ID
     * Delete affiliate
     */
    async affiliatesIdDelete(requestParameters: AffiliatesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.affiliatesIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieves an affiliate by its ID
     * Get affiliate by ID
     */
    async affiliatesIdGetRaw(requestParameters: AffiliatesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DomainAffiliate>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling affiliatesIdGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/affiliates/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DomainAffiliateFromJSON(jsonValue));
    }

    /**
     * Retrieves an affiliate by its ID
     * Get affiliate by ID
     */
    async affiliatesIdGet(requestParameters: AffiliatesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DomainAffiliate> {
        const response = await this.affiliatesIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieves a mapping between an affiliate and a provider
     * Get affiliate provider mapping
     */
    async affiliatesIdProviderMappingsProviderTypeGetRaw(requestParameters: AffiliatesIdProviderMappingsProviderTypeGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DomainAffiliateProviderMapping>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling affiliatesIdProviderMappingsProviderTypeGet().'
            );
        }

        if (requestParameters['providerType'] == null) {
            throw new runtime.RequiredError(
                'providerType',
                'Required parameter "providerType" was null or undefined when calling affiliatesIdProviderMappingsProviderTypeGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/affiliates/{id}/provider-mappings/{providerType}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))).replace(`{${"providerType"}}`, encodeURIComponent(String(requestParameters['providerType']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DomainAffiliateProviderMappingFromJSON(jsonValue));
    }

    /**
     * Retrieves a mapping between an affiliate and a provider
     * Get affiliate provider mapping
     */
    async affiliatesIdProviderMappingsProviderTypeGet(requestParameters: AffiliatesIdProviderMappingsProviderTypeGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DomainAffiliateProviderMapping> {
        const response = await this.affiliatesIdProviderMappingsProviderTypeGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Updates an affiliate with the given details
     * Update affiliate
     */
    async affiliatesIdPutRaw(requestParameters: AffiliatesIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DomainAffiliate>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling affiliatesIdPut().'
            );
        }

        if (requestParameters['request'] == null) {
            throw new runtime.RequiredError(
                'request',
                'Required parameter "request" was null or undefined when calling affiliatesIdPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/affiliates/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: HandlersUpdateAffiliateRequestToJSON(requestParameters['request']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DomainAffiliateFromJSON(jsonValue));
    }

    /**
     * Updates an affiliate with the given details
     * Update affiliate
     */
    async affiliatesIdPut(requestParameters: AffiliatesIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DomainAffiliate> {
        const response = await this.affiliatesIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a new affiliate with the given details
     * Create a new affiliate
     */
    async affiliatesPostRaw(requestParameters: AffiliatesPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DomainAffiliate>> {
        if (requestParameters['request'] == null) {
            throw new runtime.RequiredError(
                'request',
                'Required parameter "request" was null or undefined when calling affiliatesPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/affiliates`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: HandlersCreateAffiliateRequestToJSON(requestParameters['request']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DomainAffiliateFromJSON(jsonValue));
    }

    /**
     * Creates a new affiliate with the given details
     * Create a new affiliate
     */
    async affiliatesPost(requestParameters: AffiliatesPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DomainAffiliate> {
        const response = await this.affiliatesPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Search for affiliates/publishers with domain auto-completion and filtered by country, partner domains, and/or verticals with full publisher data, sorted by number of partners. Accessible by advertisers, affiliate managers, and admins.
     * Search affiliates by domain, country, partner domains, and verticals
     */
    async affiliatesSearchPostRaw(requestParameters: AffiliatesSearchPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlersAffiliatesSearchResponse>> {
        if (requestParameters['request'] == null) {
            throw new runtime.RequiredError(
                'request',
                'Required parameter "request" was null or undefined when calling affiliatesSearchPost().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/affiliates/search`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: HandlersAffiliatesSearchRequestToJSON(requestParameters['request']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HandlersAffiliatesSearchResponseFromJSON(jsonValue));
    }

    /**
     * Search for affiliates/publishers with domain auto-completion and filtered by country, partner domains, and/or verticals with full publisher data, sorted by number of partners. Accessible by advertisers, affiliate managers, and admins.
     * Search affiliates by domain, country, partner domains, and verticals
     */
    async affiliatesSearchPost(requestParameters: AffiliatesSearchPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlersAffiliatesSearchResponse> {
        const response = await this.affiliatesSearchPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieves a list of affiliates for an organization with pagination
     * List affiliates by organization
     */
    async organizationsIdAffiliatesGetRaw(requestParameters: OrganizationsIdAffiliatesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<DomainAffiliate>>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling organizationsIdAffiliatesGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/organizations/{id}/affiliates`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(DomainAffiliateFromJSON));
    }

    /**
     * Retrieves a list of affiliates for an organization with pagination
     * List affiliates by organization
     */
    async organizationsIdAffiliatesGet(requestParameters: OrganizationsIdAffiliatesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<DomainAffiliate>> {
        const response = await this.organizationsIdAffiliatesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
