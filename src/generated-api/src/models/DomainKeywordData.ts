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
import type { DomainKeywordDataSampleValueInner } from './DomainKeywordDataSampleValueInner';
import {
    DomainKeywordDataSampleValueInnerFromJSON,
    DomainKeywordDataSampleValueInnerFromJSONTyped,
    DomainKeywordDataSampleValueInnerToJSON,
    DomainKeywordDataSampleValueInnerToJSONTyped,
} from './DomainKeywordDataSampleValueInner';

/**
 * 
 * @export
 * @interface DomainKeywordData
 */
export interface DomainKeywordData {
    /**
     * 
     * @type {number}
     * @memberof DomainKeywordData
     */
    count?: number;
    /**
     * 
     * @type {Array<DomainKeywordDataSampleValueInner>}
     * @memberof DomainKeywordData
     */
    sampleValue?: Array<DomainKeywordDataSampleValueInner>;
    /**
     * 
     * @type {Array<DomainKeywordDataSampleValueInner>}
     * @memberof DomainKeywordData
     */
    value?: Array<DomainKeywordDataSampleValueInner>;
}

/**
 * Check if a given object implements the DomainKeywordData interface.
 */
export function instanceOfDomainKeywordData(value: object): value is DomainKeywordData {
    return true;
}

export function DomainKeywordDataFromJSON(json: any): DomainKeywordData {
    return DomainKeywordDataFromJSONTyped(json, false);
}

export function DomainKeywordDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): DomainKeywordData {
    if (json == null) {
        return json;
    }
    return {
        
        'count': json['count'] == null ? undefined : json['count'],
        'sampleValue': json['sampleValue'] == null ? undefined : ((json['sampleValue'] as Array<any>).map(DomainKeywordDataSampleValueInnerFromJSON)),
        'value': json['value'] == null ? undefined : ((json['value'] as Array<any>).map(DomainKeywordDataSampleValueInnerFromJSON)),
    };
}

export function DomainKeywordDataToJSON(json: any): DomainKeywordData {
    return DomainKeywordDataToJSONTyped(json, false);
}

export function DomainKeywordDataToJSONTyped(value?: DomainKeywordData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'count': value['count'],
        'sampleValue': value['sampleValue'] == null ? undefined : ((value['sampleValue'] as Array<any>).map(DomainKeywordDataSampleValueInnerToJSON)),
        'value': value['value'] == null ? undefined : ((value['value'] as Array<any>).map(DomainKeywordDataSampleValueInnerToJSON)),
    };
}

