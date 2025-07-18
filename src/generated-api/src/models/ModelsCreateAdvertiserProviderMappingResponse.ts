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
import type { DomainAdvertiserProviderMapping } from './DomainAdvertiserProviderMapping';
import {
    DomainAdvertiserProviderMappingFromJSON,
    DomainAdvertiserProviderMappingFromJSONTyped,
    DomainAdvertiserProviderMappingToJSON,
    DomainAdvertiserProviderMappingToJSONTyped,
} from './DomainAdvertiserProviderMapping';

/**
 * 
 * @export
 * @interface ModelsCreateAdvertiserProviderMappingResponse
 */
export interface ModelsCreateAdvertiserProviderMappingResponse {
    /**
     * 
     * @type {DomainAdvertiserProviderMapping}
     * @memberof ModelsCreateAdvertiserProviderMappingResponse
     */
    providerMapping?: DomainAdvertiserProviderMapping;
}

/**
 * Check if a given object implements the ModelsCreateAdvertiserProviderMappingResponse interface.
 */
export function instanceOfModelsCreateAdvertiserProviderMappingResponse(value: object): value is ModelsCreateAdvertiserProviderMappingResponse {
    return true;
}

export function ModelsCreateAdvertiserProviderMappingResponseFromJSON(json: any): ModelsCreateAdvertiserProviderMappingResponse {
    return ModelsCreateAdvertiserProviderMappingResponseFromJSONTyped(json, false);
}

export function ModelsCreateAdvertiserProviderMappingResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelsCreateAdvertiserProviderMappingResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'providerMapping': json['provider_mapping'] == null ? undefined : DomainAdvertiserProviderMappingFromJSON(json['provider_mapping']),
    };
}

export function ModelsCreateAdvertiserProviderMappingResponseToJSON(json: any): ModelsCreateAdvertiserProviderMappingResponse {
    return ModelsCreateAdvertiserProviderMappingResponseToJSONTyped(json, false);
}

export function ModelsCreateAdvertiserProviderMappingResponseToJSONTyped(value?: ModelsCreateAdvertiserProviderMappingResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'provider_mapping': DomainAdvertiserProviderMappingToJSON(value['providerMapping']),
    };
}

