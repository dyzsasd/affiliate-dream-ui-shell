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
 * @interface DomainAffiliateProviderMapping
 */
export interface DomainAffiliateProviderMapping {
    /**
     * 
     * @type {number}
     * @memberof DomainAffiliateProviderMapping
     */
    affiliateId?: number;
    /**
     * JSONB stored as string for API keys/tokens
     * @type {string}
     * @memberof DomainAffiliateProviderMapping
     */
    apiCredentials?: string;
    /**
     * 
     * @type {string}
     * @memberof DomainAffiliateProviderMapping
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof DomainAffiliateProviderMapping
     */
    lastSyncAt?: string;
    /**
     * 
     * @type {number}
     * @memberof DomainAffiliateProviderMapping
     */
    mappingId?: number;
    /**
     * e.g., Everflow's network_affiliate_id
     * @type {string}
     * @memberof DomainAffiliateProviderMapping
     */
    providerAffiliateId?: string;
    /**
     * JSONB stored as string
     * @type {string}
     * @memberof DomainAffiliateProviderMapping
     */
    providerConfig?: string;
    /**
     * Provider-specific data (stored as JSONB) - contains all Everflow-specific fields
     * @type {string}
     * @memberof DomainAffiliateProviderMapping
     */
    providerData?: string;
    /**
     * 'everflow' for MVP
     * @type {string}
     * @memberof DomainAffiliateProviderMapping
     */
    providerType?: string;
    /**
     * 
     * @type {string}
     * @memberof DomainAffiliateProviderMapping
     */
    syncError?: string;
    /**
     * Synchronization metadata
     * @type {string}
     * @memberof DomainAffiliateProviderMapping
     */
    syncStatus?: string;
    /**
     * 
     * @type {string}
     * @memberof DomainAffiliateProviderMapping
     */
    updatedAt?: string;
}

/**
 * Check if a given object implements the DomainAffiliateProviderMapping interface.
 */
export function instanceOfDomainAffiliateProviderMapping(value: object): value is DomainAffiliateProviderMapping {
    return true;
}

export function DomainAffiliateProviderMappingFromJSON(json: any): DomainAffiliateProviderMapping {
    return DomainAffiliateProviderMappingFromJSONTyped(json, false);
}

export function DomainAffiliateProviderMappingFromJSONTyped(json: any, ignoreDiscriminator: boolean): DomainAffiliateProviderMapping {
    if (json == null) {
        return json;
    }
    return {
        
        'affiliateId': json['affiliate_id'] == null ? undefined : json['affiliate_id'],
        'apiCredentials': json['api_credentials'] == null ? undefined : json['api_credentials'],
        'createdAt': json['created_at'] == null ? undefined : json['created_at'],
        'lastSyncAt': json['last_sync_at'] == null ? undefined : json['last_sync_at'],
        'mappingId': json['mapping_id'] == null ? undefined : json['mapping_id'],
        'providerAffiliateId': json['provider_affiliate_id'] == null ? undefined : json['provider_affiliate_id'],
        'providerConfig': json['provider_config'] == null ? undefined : json['provider_config'],
        'providerData': json['provider_data'] == null ? undefined : json['provider_data'],
        'providerType': json['provider_type'] == null ? undefined : json['provider_type'],
        'syncError': json['sync_error'] == null ? undefined : json['sync_error'],
        'syncStatus': json['sync_status'] == null ? undefined : json['sync_status'],
        'updatedAt': json['updated_at'] == null ? undefined : json['updated_at'],
    };
}

export function DomainAffiliateProviderMappingToJSON(json: any): DomainAffiliateProviderMapping {
    return DomainAffiliateProviderMappingToJSONTyped(json, false);
}

export function DomainAffiliateProviderMappingToJSONTyped(value?: DomainAffiliateProviderMapping | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'affiliate_id': value['affiliateId'],
        'api_credentials': value['apiCredentials'],
        'created_at': value['createdAt'],
        'last_sync_at': value['lastSyncAt'],
        'mapping_id': value['mappingId'],
        'provider_affiliate_id': value['providerAffiliateId'],
        'provider_config': value['providerConfig'],
        'provider_data': value['providerData'],
        'provider_type': value['providerType'],
        'sync_error': value['syncError'],
        'sync_status': value['syncStatus'],
        'updated_at': value['updatedAt'],
    };
}

