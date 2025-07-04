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
import type { DomainBillingDetails } from './DomainBillingDetails';
import {
    DomainBillingDetailsFromJSON,
    DomainBillingDetailsFromJSONTyped,
    DomainBillingDetailsToJSON,
    DomainBillingDetailsToJSONTyped,
} from './DomainBillingDetails';

/**
 * 
 * @export
 * @interface ModelsCreateAdvertiserRequest
 */
export interface ModelsCreateAdvertiserRequest {
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    accountingContactEmail?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    affiliateIdMacro?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    attributionMethod?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    attributionPriority?: string;
    /**
     * 
     * @type {DomainBillingDetails}
     * @memberof ModelsCreateAdvertiserRequest
     */
    billingDetails?: DomainBillingDetails;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    contactEmail?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    defaultCurrencyId?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    emailAttributionMethod?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    internalNotes?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    offerIdMacro?: string;
    /**
     * 
     * @type {number}
     * @memberof ModelsCreateAdvertiserRequest
     */
    organizationId: number;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    platformName?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    platformUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    platformUsername?: string;
    /**
     * 
     * @type {number}
     * @memberof ModelsCreateAdvertiserRequest
     */
    reportingTimezoneId?: number;
    /**
     * 
     * @type {string}
     * @memberof ModelsCreateAdvertiserRequest
     */
    status?: string;
}

/**
 * Check if a given object implements the ModelsCreateAdvertiserRequest interface.
 */
export function instanceOfModelsCreateAdvertiserRequest(value: object): value is ModelsCreateAdvertiserRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('organizationId' in value) || value['organizationId'] === undefined) return false;
    return true;
}

export function ModelsCreateAdvertiserRequestFromJSON(json: any): ModelsCreateAdvertiserRequest {
    return ModelsCreateAdvertiserRequestFromJSONTyped(json, false);
}

export function ModelsCreateAdvertiserRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelsCreateAdvertiserRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'accountingContactEmail': json['accounting_contact_email'] == null ? undefined : json['accounting_contact_email'],
        'affiliateIdMacro': json['affiliate_id_macro'] == null ? undefined : json['affiliate_id_macro'],
        'attributionMethod': json['attribution_method'] == null ? undefined : json['attribution_method'],
        'attributionPriority': json['attribution_priority'] == null ? undefined : json['attribution_priority'],
        'billingDetails': json['billing_details'] == null ? undefined : DomainBillingDetailsFromJSON(json['billing_details']),
        'contactEmail': json['contact_email'] == null ? undefined : json['contact_email'],
        'defaultCurrencyId': json['default_currency_id'] == null ? undefined : json['default_currency_id'],
        'emailAttributionMethod': json['email_attribution_method'] == null ? undefined : json['email_attribution_method'],
        'internalNotes': json['internal_notes'] == null ? undefined : json['internal_notes'],
        'name': json['name'],
        'offerIdMacro': json['offer_id_macro'] == null ? undefined : json['offer_id_macro'],
        'organizationId': json['organization_id'],
        'platformName': json['platform_name'] == null ? undefined : json['platform_name'],
        'platformUrl': json['platform_url'] == null ? undefined : json['platform_url'],
        'platformUsername': json['platform_username'] == null ? undefined : json['platform_username'],
        'reportingTimezoneId': json['reporting_timezone_id'] == null ? undefined : json['reporting_timezone_id'],
        'status': json['status'] == null ? undefined : json['status'],
    };
}

export function ModelsCreateAdvertiserRequestToJSON(json: any): ModelsCreateAdvertiserRequest {
    return ModelsCreateAdvertiserRequestToJSONTyped(json, false);
}

export function ModelsCreateAdvertiserRequestToJSONTyped(value?: ModelsCreateAdvertiserRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'accounting_contact_email': value['accountingContactEmail'],
        'affiliate_id_macro': value['affiliateIdMacro'],
        'attribution_method': value['attributionMethod'],
        'attribution_priority': value['attributionPriority'],
        'billing_details': DomainBillingDetailsToJSON(value['billingDetails']),
        'contact_email': value['contactEmail'],
        'default_currency_id': value['defaultCurrencyId'],
        'email_attribution_method': value['emailAttributionMethod'],
        'internal_notes': value['internalNotes'],
        'name': value['name'],
        'offer_id_macro': value['offerIdMacro'],
        'organization_id': value['organizationId'],
        'platform_name': value['platformName'],
        'platform_url': value['platformUrl'],
        'platform_username': value['platformUsername'],
        'reporting_timezone_id': value['reportingTimezoneId'],
        'status': value['status'],
    };
}

