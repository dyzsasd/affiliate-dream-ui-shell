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
  DomainAddPublisherToListRequest,
  DomainCreateFavoritePublisherListRequest,
  DomainUpdateFavoritePublisherListRequest,
  DomainUpdatePublisherInListRequest,
  DomainUpdatePublisherStatusRequest,
  HandlersErrorResponse,
} from '../models/index';
import {
    DomainAddPublisherToListRequestFromJSON,
    DomainAddPublisherToListRequestToJSON,
    DomainCreateFavoritePublisherListRequestFromJSON,
    DomainCreateFavoritePublisherListRequestToJSON,
    DomainUpdateFavoritePublisherListRequestFromJSON,
    DomainUpdateFavoritePublisherListRequestToJSON,
    DomainUpdatePublisherInListRequestFromJSON,
    DomainUpdatePublisherInListRequestToJSON,
    DomainUpdatePublisherStatusRequestFromJSON,
    DomainUpdatePublisherStatusRequestToJSON,
    HandlersErrorResponseFromJSON,
    HandlersErrorResponseToJSON,
} from '../models/index';

export interface ApiV1FavoritePublisherListsListIdPublishersDomainStatusPatchRequest {
    listId: number;
    domain: string;
    request: DomainUpdatePublisherStatusRequest;
}

export interface FavoritePublisherListsListIdDeleteRequest {
    listId: number;
}

export interface FavoritePublisherListsListIdGetRequest {
    listId: number;
}

export interface FavoritePublisherListsListIdPublishersDomainDeleteRequest {
    listId: number;
    domain: string;
}

export interface FavoritePublisherListsListIdPublishersDomainPutRequest {
    listId: number;
    domain: string;
    request: DomainUpdatePublisherInListRequest;
}

export interface FavoritePublisherListsListIdPublishersGetRequest {
    listId: number;
    includeDetails?: boolean;
}

export interface FavoritePublisherListsListIdPublishersPostRequest {
    listId: number;
    request: DomainAddPublisherToListRequest;
}

export interface FavoritePublisherListsListIdPutRequest {
    listId: number;
    request: DomainUpdateFavoritePublisherListRequest;
}

export interface FavoritePublisherListsPostRequest {
    request: DomainCreateFavoritePublisherListRequest;
}

export interface FavoritePublisherListsSearchGetRequest {
    domain: string;
}

/**
 * 
 */
export class FavoritePublisherListsApi extends runtime.BaseAPI {

    /**
     * Updates the status of a publisher in a favorite list (added -> contacted -> accepted)
     * Update publisher status in favorite list
     */
    async apiV1FavoritePublisherListsListIdPublishersDomainStatusPatchRaw(requestParameters: ApiV1FavoritePublisherListsListIdPublishersDomainStatusPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any | undefined; }>> {
        if (requestParameters['listId'] == null) {
            throw new runtime.RequiredError(
                'listId',
                'Required parameter "listId" was null or undefined when calling apiV1FavoritePublisherListsListIdPublishersDomainStatusPatch().'
            );
        }

        if (requestParameters['domain'] == null) {
            throw new runtime.RequiredError(
                'domain',
                'Required parameter "domain" was null or undefined when calling apiV1FavoritePublisherListsListIdPublishersDomainStatusPatch().'
            );
        }

        if (requestParameters['request'] == null) {
            throw new runtime.RequiredError(
                'request',
                'Required parameter "request" was null or undefined when calling apiV1FavoritePublisherListsListIdPublishersDomainStatusPatch().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/favorite-publisher-lists/{list_id}/publishers/{domain}/status`.replace(`{${"list_id"}}`, encodeURIComponent(String(requestParameters['listId']))).replace(`{${"domain"}}`, encodeURIComponent(String(requestParameters['domain']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: DomainUpdatePublisherStatusRequestToJSON(requestParameters['request']),
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Updates the status of a publisher in a favorite list (added -> contacted -> accepted)
     * Update publisher status in favorite list
     */
    async apiV1FavoritePublisherListsListIdPublishersDomainStatusPatch(requestParameters: ApiV1FavoritePublisherListsListIdPublishersDomainStatusPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any | undefined; }> {
        const response = await this.apiV1FavoritePublisherListsListIdPublishersDomainStatusPatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieves all favorite publisher lists for the user\'s organization with statistics
     * Get all favorite publisher lists
     */
    async favoritePublisherListsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any | undefined; }>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/favorite-publisher-lists`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Retrieves all favorite publisher lists for the user\'s organization with statistics
     * Get all favorite publisher lists
     */
    async favoritePublisherListsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any | undefined; }> {
        const response = await this.favoritePublisherListsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Deletes a favorite publisher list and all its items
     * Delete favorite publisher list
     */
    async favoritePublisherListsListIdDeleteRaw(requestParameters: FavoritePublisherListsListIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any | undefined; }>> {
        if (requestParameters['listId'] == null) {
            throw new runtime.RequiredError(
                'listId',
                'Required parameter "listId" was null or undefined when calling favoritePublisherListsListIdDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/favorite-publisher-lists/{list_id}`.replace(`{${"list_id"}}`, encodeURIComponent(String(requestParameters['listId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Deletes a favorite publisher list and all its items
     * Delete favorite publisher list
     */
    async favoritePublisherListsListIdDelete(requestParameters: FavoritePublisherListsListIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any | undefined; }> {
        const response = await this.favoritePublisherListsListIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieves a specific favorite publisher list by ID
     * Get favorite publisher list by ID
     */
    async favoritePublisherListsListIdGetRaw(requestParameters: FavoritePublisherListsListIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any | undefined; }>> {
        if (requestParameters['listId'] == null) {
            throw new runtime.RequiredError(
                'listId',
                'Required parameter "listId" was null or undefined when calling favoritePublisherListsListIdGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/favorite-publisher-lists/{list_id}`.replace(`{${"list_id"}}`, encodeURIComponent(String(requestParameters['listId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Retrieves a specific favorite publisher list by ID
     * Get favorite publisher list by ID
     */
    async favoritePublisherListsListIdGet(requestParameters: FavoritePublisherListsListIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any | undefined; }> {
        const response = await this.favoritePublisherListsListIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Removes a publisher domain from a favorite publisher list
     * Remove publisher from favorite list
     */
    async favoritePublisherListsListIdPublishersDomainDeleteRaw(requestParameters: FavoritePublisherListsListIdPublishersDomainDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any | undefined; }>> {
        if (requestParameters['listId'] == null) {
            throw new runtime.RequiredError(
                'listId',
                'Required parameter "listId" was null or undefined when calling favoritePublisherListsListIdPublishersDomainDelete().'
            );
        }

        if (requestParameters['domain'] == null) {
            throw new runtime.RequiredError(
                'domain',
                'Required parameter "domain" was null or undefined when calling favoritePublisherListsListIdPublishersDomainDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/favorite-publisher-lists/{list_id}/publishers/{domain}`.replace(`{${"list_id"}}`, encodeURIComponent(String(requestParameters['listId']))).replace(`{${"domain"}}`, encodeURIComponent(String(requestParameters['domain']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Removes a publisher domain from a favorite publisher list
     * Remove publisher from favorite list
     */
    async favoritePublisherListsListIdPublishersDomainDelete(requestParameters: FavoritePublisherListsListIdPublishersDomainDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any | undefined; }> {
        const response = await this.favoritePublisherListsListIdPublishersDomainDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Updates the notes for a publisher in a favorite publisher list
     * Update publisher notes in favorite list
     */
    async favoritePublisherListsListIdPublishersDomainPutRaw(requestParameters: FavoritePublisherListsListIdPublishersDomainPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any | undefined; }>> {
        if (requestParameters['listId'] == null) {
            throw new runtime.RequiredError(
                'listId',
                'Required parameter "listId" was null or undefined when calling favoritePublisherListsListIdPublishersDomainPut().'
            );
        }

        if (requestParameters['domain'] == null) {
            throw new runtime.RequiredError(
                'domain',
                'Required parameter "domain" was null or undefined when calling favoritePublisherListsListIdPublishersDomainPut().'
            );
        }

        if (requestParameters['request'] == null) {
            throw new runtime.RequiredError(
                'request',
                'Required parameter "request" was null or undefined when calling favoritePublisherListsListIdPublishersDomainPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/favorite-publisher-lists/{list_id}/publishers/{domain}`.replace(`{${"list_id"}}`, encodeURIComponent(String(requestParameters['listId']))).replace(`{${"domain"}}`, encodeURIComponent(String(requestParameters['domain']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: DomainUpdatePublisherInListRequestToJSON(requestParameters['request']),
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Updates the notes for a publisher in a favorite publisher list
     * Update publisher notes in favorite list
     */
    async favoritePublisherListsListIdPublishersDomainPut(requestParameters: FavoritePublisherListsListIdPublishersDomainPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any | undefined; }> {
        const response = await this.favoritePublisherListsListIdPublishersDomainPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieves all publisher items in a favorite publisher list
     * Get favorite list items
     */
    async favoritePublisherListsListIdPublishersGetRaw(requestParameters: FavoritePublisherListsListIdPublishersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any | undefined; }>> {
        if (requestParameters['listId'] == null) {
            throw new runtime.RequiredError(
                'listId',
                'Required parameter "listId" was null or undefined when calling favoritePublisherListsListIdPublishersGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['includeDetails'] != null) {
            queryParameters['include_details'] = requestParameters['includeDetails'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/favorite-publisher-lists/{list_id}/publishers`.replace(`{${"list_id"}}`, encodeURIComponent(String(requestParameters['listId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Retrieves all publisher items in a favorite publisher list
     * Get favorite list items
     */
    async favoritePublisherListsListIdPublishersGet(requestParameters: FavoritePublisherListsListIdPublishersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any | undefined; }> {
        const response = await this.favoritePublisherListsListIdPublishersGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds a publisher domain to a favorite publisher list
     * Add publisher to favorite list
     */
    async favoritePublisherListsListIdPublishersPostRaw(requestParameters: FavoritePublisherListsListIdPublishersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any | undefined; }>> {
        if (requestParameters['listId'] == null) {
            throw new runtime.RequiredError(
                'listId',
                'Required parameter "listId" was null or undefined when calling favoritePublisherListsListIdPublishersPost().'
            );
        }

        if (requestParameters['request'] == null) {
            throw new runtime.RequiredError(
                'request',
                'Required parameter "request" was null or undefined when calling favoritePublisherListsListIdPublishersPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/favorite-publisher-lists/{list_id}/publishers`.replace(`{${"list_id"}}`, encodeURIComponent(String(requestParameters['listId']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DomainAddPublisherToListRequestToJSON(requestParameters['request']),
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Adds a publisher domain to a favorite publisher list
     * Add publisher to favorite list
     */
    async favoritePublisherListsListIdPublishersPost(requestParameters: FavoritePublisherListsListIdPublishersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any | undefined; }> {
        const response = await this.favoritePublisherListsListIdPublishersPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Updates a favorite publisher list\'s name and/or description
     * Update favorite publisher list
     */
    async favoritePublisherListsListIdPutRaw(requestParameters: FavoritePublisherListsListIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any | undefined; }>> {
        if (requestParameters['listId'] == null) {
            throw new runtime.RequiredError(
                'listId',
                'Required parameter "listId" was null or undefined when calling favoritePublisherListsListIdPut().'
            );
        }

        if (requestParameters['request'] == null) {
            throw new runtime.RequiredError(
                'request',
                'Required parameter "request" was null or undefined when calling favoritePublisherListsListIdPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/favorite-publisher-lists/{list_id}`.replace(`{${"list_id"}}`, encodeURIComponent(String(requestParameters['listId']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: DomainUpdateFavoritePublisherListRequestToJSON(requestParameters['request']),
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Updates a favorite publisher list\'s name and/or description
     * Update favorite publisher list
     */
    async favoritePublisherListsListIdPut(requestParameters: FavoritePublisherListsListIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any | undefined; }> {
        const response = await this.favoritePublisherListsListIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a new favorite publisher list for the user\'s organization
     * Create a new favorite publisher list
     */
    async favoritePublisherListsPostRaw(requestParameters: FavoritePublisherListsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any | undefined; }>> {
        if (requestParameters['request'] == null) {
            throw new runtime.RequiredError(
                'request',
                'Required parameter "request" was null or undefined when calling favoritePublisherListsPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/favorite-publisher-lists`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DomainCreateFavoritePublisherListRequestToJSON(requestParameters['request']),
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Creates a new favorite publisher list for the user\'s organization
     * Create a new favorite publisher list
     */
    async favoritePublisherListsPost(requestParameters: FavoritePublisherListsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any | undefined; }> {
        const response = await this.favoritePublisherListsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieves all favorite publisher lists that contain a specific publisher domain
     * Get lists containing publisher
     */
    async favoritePublisherListsSearchGetRaw(requestParameters: FavoritePublisherListsSearchGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any | undefined; }>> {
        if (requestParameters['domain'] == null) {
            throw new runtime.RequiredError(
                'domain',
                'Required parameter "domain" was null or undefined when calling favoritePublisherListsSearchGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['domain'] != null) {
            queryParameters['domain'] = requestParameters['domain'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // BearerAuth authentication
        }

        const response = await this.request({
            path: `/favorite-publisher-lists/search`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Retrieves all favorite publisher lists that contain a specific publisher domain
     * Get lists containing publisher
     */
    async favoritePublisherListsSearchGet(requestParameters: FavoritePublisherListsSearchGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any | undefined; }> {
        const response = await this.favoritePublisherListsSearchGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
