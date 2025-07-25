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
/**
 * 
 * @export
 * @interface DomainAnalyticsPublisherResponsePublisherPromotype
 */
export interface DomainAnalyticsPublisherResponsePublisherPromotype {
    /**
     * 
     * @type {string}
     * @memberof DomainAnalyticsPublisherResponsePublisherPromotype
     */
    value?: string;
}

/**
 * Check if a given object implements the DomainAnalyticsPublisherResponsePublisherPromotype interface.
 */
export function instanceOfDomainAnalyticsPublisherResponsePublisherPromotype(value: object): value is DomainAnalyticsPublisherResponsePublisherPromotype {
    return true;
}

export function DomainAnalyticsPublisherResponsePublisherPromotypeFromJSON(json: any): DomainAnalyticsPublisherResponsePublisherPromotype {
    return DomainAnalyticsPublisherResponsePublisherPromotypeFromJSONTyped(json, false);
}

export function DomainAnalyticsPublisherResponsePublisherPromotypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): DomainAnalyticsPublisherResponsePublisherPromotype {
    if (json == null) {
        return json;
    }
    return {
        
        'value': json['value'] == null ? undefined : json['value'],
    };
}

export function DomainAnalyticsPublisherResponsePublisherPromotypeToJSON(json: any): DomainAnalyticsPublisherResponsePublisherPromotype {
    return DomainAnalyticsPublisherResponsePublisherPromotypeToJSONTyped(json, false);
}

export function DomainAnalyticsPublisherResponsePublisherPromotypeToJSONTyped(value?: DomainAnalyticsPublisherResponsePublisherPromotype | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'value': value['value'],
    };
}

