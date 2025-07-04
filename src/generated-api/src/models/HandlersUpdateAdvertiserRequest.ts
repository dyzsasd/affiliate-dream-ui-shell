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
 * @interface HandlersUpdateAdvertiserRequest
 */
export interface HandlersUpdateAdvertiserRequest {
    /**
     * Billing details in JSON format
     * swagger:strfmt json
     * @type {object}
     * @memberof HandlersUpdateAdvertiserRequest
     */
    billingDetails?: object;
    /**
     * Contact email address
     * @type {string}
     * @memberof HandlersUpdateAdvertiserRequest
     */
    contactEmail?: string;
    /**
     * Advertiser name
     * @type {string}
     * @memberof HandlersUpdateAdvertiserRequest
     */
    name: string;
    /**
     * Status of the advertiser (active, pending, inactive, rejected)
     * @type {string}
     * @memberof HandlersUpdateAdvertiserRequest
     */
    status: string;
}

/**
 * Check if a given object implements the HandlersUpdateAdvertiserRequest interface.
 */
export function instanceOfHandlersUpdateAdvertiserRequest(value: object): value is HandlersUpdateAdvertiserRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    return true;
}

export function HandlersUpdateAdvertiserRequestFromJSON(json: any): HandlersUpdateAdvertiserRequest {
    return HandlersUpdateAdvertiserRequestFromJSONTyped(json, false);
}

export function HandlersUpdateAdvertiserRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): HandlersUpdateAdvertiserRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'billingDetails': json['billing_details'] == null ? undefined : json['billing_details'],
        'contactEmail': json['contact_email'] == null ? undefined : json['contact_email'],
        'name': json['name'],
        'status': json['status'],
    };
}

export function HandlersUpdateAdvertiserRequestToJSON(json: any): HandlersUpdateAdvertiserRequest {
    return HandlersUpdateAdvertiserRequestToJSONTyped(json, false);
}

export function HandlersUpdateAdvertiserRequestToJSONTyped(value?: HandlersUpdateAdvertiserRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'billing_details': value['billingDetails'],
        'contact_email': value['contactEmail'],
        'name': value['name'],
        'status': value['status'],
    };
}

