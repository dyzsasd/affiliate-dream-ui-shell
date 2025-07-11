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
import type { DomainAnalyticsAdvertiserResponseAdvertiser } from './DomainAnalyticsAdvertiserResponseAdvertiser';
import {
    DomainAnalyticsAdvertiserResponseAdvertiserFromJSON,
    DomainAnalyticsAdvertiserResponseAdvertiserFromJSONTyped,
    DomainAnalyticsAdvertiserResponseAdvertiserToJSON,
    DomainAnalyticsAdvertiserResponseAdvertiserToJSONTyped,
} from './DomainAnalyticsAdvertiserResponseAdvertiser';

/**
 * 
 * @export
 * @interface DomainAnalyticsAdvertiserResponse
 */
export interface DomainAnalyticsAdvertiserResponse {
    /**
     * 
     * @type {DomainAnalyticsAdvertiserResponseAdvertiser}
     * @memberof DomainAnalyticsAdvertiserResponse
     */
    advertiser?: DomainAnalyticsAdvertiserResponseAdvertiser;
}

/**
 * Check if a given object implements the DomainAnalyticsAdvertiserResponse interface.
 */
export function instanceOfDomainAnalyticsAdvertiserResponse(value: object): value is DomainAnalyticsAdvertiserResponse {
    return true;
}

export function DomainAnalyticsAdvertiserResponseFromJSON(json: any): DomainAnalyticsAdvertiserResponse {
    return DomainAnalyticsAdvertiserResponseFromJSONTyped(json, false);
}

export function DomainAnalyticsAdvertiserResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): DomainAnalyticsAdvertiserResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'advertiser': json['advertiser'] == null ? undefined : DomainAnalyticsAdvertiserResponseAdvertiserFromJSON(json['advertiser']),
    };
}

export function DomainAnalyticsAdvertiserResponseToJSON(json: any): DomainAnalyticsAdvertiserResponse {
    return DomainAnalyticsAdvertiserResponseToJSONTyped(json, false);
}

export function DomainAnalyticsAdvertiserResponseToJSONTyped(value?: DomainAnalyticsAdvertiserResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'advertiser': DomainAnalyticsAdvertiserResponseAdvertiserToJSON(value['advertiser']),
    };
}

