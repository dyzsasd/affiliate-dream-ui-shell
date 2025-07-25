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
 * @interface DomainCreatePaymentMethodRequest
 */
export interface DomainCreatePaymentMethodRequest {
    /**
     * 
     * @type {string}
     * @memberof DomainCreatePaymentMethodRequest
     */
    nickname?: string;
    /**
     * Stripe Payment Method ID
     * @type {string}
     * @memberof DomainCreatePaymentMethodRequest
     */
    paymentMethodId: string;
    /**
     * 
     * @type {boolean}
     * @memberof DomainCreatePaymentMethodRequest
     */
    setAsDefault?: boolean;
}

/**
 * Check if a given object implements the DomainCreatePaymentMethodRequest interface.
 */
export function instanceOfDomainCreatePaymentMethodRequest(value: object): value is DomainCreatePaymentMethodRequest {
    if (!('paymentMethodId' in value) || value['paymentMethodId'] === undefined) return false;
    return true;
}

export function DomainCreatePaymentMethodRequestFromJSON(json: any): DomainCreatePaymentMethodRequest {
    return DomainCreatePaymentMethodRequestFromJSONTyped(json, false);
}

export function DomainCreatePaymentMethodRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): DomainCreatePaymentMethodRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'nickname': json['nickname'] == null ? undefined : json['nickname'],
        'paymentMethodId': json['payment_method_id'],
        'setAsDefault': json['set_as_default'] == null ? undefined : json['set_as_default'],
    };
}

export function DomainCreatePaymentMethodRequestToJSON(json: any): DomainCreatePaymentMethodRequest {
    return DomainCreatePaymentMethodRequestToJSONTyped(json, false);
}

export function DomainCreatePaymentMethodRequestToJSONTyped(value?: DomainCreatePaymentMethodRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'nickname': value['nickname'],
        'payment_method_id': value['paymentMethodId'],
        'set_as_default': value['setAsDefault'],
    };
}

