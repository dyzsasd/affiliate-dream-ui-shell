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

import { mapValues } from '../runtime';
import type { ModelsTrackingLinkResponse } from './ModelsTrackingLinkResponse';
import {
    ModelsTrackingLinkResponseFromJSON,
    ModelsTrackingLinkResponseFromJSONTyped,
    ModelsTrackingLinkResponseToJSON,
    ModelsTrackingLinkResponseToJSONTyped,
} from './ModelsTrackingLinkResponse';

/**
 * 
 * @export
 * @interface ModelsTrackingLinkListResponse
 */
export interface ModelsTrackingLinkListResponse {
    /**
     * 
     * @type {number}
     * @memberof ModelsTrackingLinkListResponse
     */
    page?: number;
    /**
     * 
     * @type {number}
     * @memberof ModelsTrackingLinkListResponse
     */
    pageSize?: number;
    /**
     * 
     * @type {number}
     * @memberof ModelsTrackingLinkListResponse
     */
    total?: number;
    /**
     * 
     * @type {number}
     * @memberof ModelsTrackingLinkListResponse
     */
    totalPages?: number;
    /**
     * 
     * @type {Array<ModelsTrackingLinkResponse>}
     * @memberof ModelsTrackingLinkListResponse
     */
    trackingLinks?: Array<ModelsTrackingLinkResponse>;
}

/**
 * Check if a given object implements the ModelsTrackingLinkListResponse interface.
 */
export function instanceOfModelsTrackingLinkListResponse(value: object): value is ModelsTrackingLinkListResponse {
    return true;
}

export function ModelsTrackingLinkListResponseFromJSON(json: any): ModelsTrackingLinkListResponse {
    return ModelsTrackingLinkListResponseFromJSONTyped(json, false);
}

export function ModelsTrackingLinkListResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelsTrackingLinkListResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'page': json['page'] == null ? undefined : json['page'],
        'pageSize': json['page_size'] == null ? undefined : json['page_size'],
        'total': json['total'] == null ? undefined : json['total'],
        'totalPages': json['total_pages'] == null ? undefined : json['total_pages'],
        'trackingLinks': json['tracking_links'] == null ? undefined : ((json['tracking_links'] as Array<any>).map(ModelsTrackingLinkResponseFromJSON)),
    };
}

export function ModelsTrackingLinkListResponseToJSON(json: any): ModelsTrackingLinkListResponse {
    return ModelsTrackingLinkListResponseToJSONTyped(json, false);
}

export function ModelsTrackingLinkListResponseToJSONTyped(value?: ModelsTrackingLinkListResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'page': value['page'],
        'page_size': value['pageSize'],
        'total': value['total'],
        'total_pages': value['totalPages'],
        'tracking_links': value['trackingLinks'] == null ? undefined : ((value['trackingLinks'] as Array<any>).map(ModelsTrackingLinkResponseToJSON)),
    };
}

