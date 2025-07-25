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
 * @interface HandlersUpdateAffiliateRequest
 */
export interface HandlersUpdateAffiliateRequest {
    /**
     * Contact email address
     * @type {string}
     * @memberof HandlersUpdateAffiliateRequest
     */
    contactEmail?: string;
    /**
     * Affiliate name
     * @type {string}
     * @memberof HandlersUpdateAffiliateRequest
     */
    name: string;
    /**
     * Payment details in JSON format
     * swagger:strfmt json
     * @type {object}
     * @memberof HandlersUpdateAffiliateRequest
     */
    paymentDetails?: object;
    /**
     * Status of the affiliate (active, pending, inactive, rejected)
     * @type {string}
     * @memberof HandlersUpdateAffiliateRequest
     */
    status: string;
}

/**
 * Check if a given object implements the HandlersUpdateAffiliateRequest interface.
 */
export function instanceOfHandlersUpdateAffiliateRequest(value: object): value is HandlersUpdateAffiliateRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    return true;
}

export function HandlersUpdateAffiliateRequestFromJSON(json: any): HandlersUpdateAffiliateRequest {
    return HandlersUpdateAffiliateRequestFromJSONTyped(json, false);
}

export function HandlersUpdateAffiliateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): HandlersUpdateAffiliateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'contactEmail': json['contact_email'] == null ? undefined : json['contact_email'],
        'name': json['name'],
        'paymentDetails': json['payment_details'] == null ? undefined : json['payment_details'],
        'status': json['status'],
    };
}

export function HandlersUpdateAffiliateRequestToJSON(json: any): HandlersUpdateAffiliateRequest {
    return HandlersUpdateAffiliateRequestToJSONTyped(json, false);
}

export function HandlersUpdateAffiliateRequestToJSONTyped(value?: HandlersUpdateAffiliateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'contact_email': value['contactEmail'],
        'name': value['name'],
        'payment_details': value['paymentDetails'],
        'status': value['status'],
    };
}

