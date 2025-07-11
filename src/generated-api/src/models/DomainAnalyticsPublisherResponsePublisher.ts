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
import type { DomainAnalyticsPublisherResponsePublisherKnown } from './DomainAnalyticsPublisherResponsePublisherKnown';
import {
    DomainAnalyticsPublisherResponsePublisherKnownFromJSON,
    DomainAnalyticsPublisherResponsePublisherKnownFromJSONTyped,
    DomainAnalyticsPublisherResponsePublisherKnownToJSON,
    DomainAnalyticsPublisherResponsePublisherKnownToJSONTyped,
} from './DomainAnalyticsPublisherResponsePublisherKnown';
import type { DomainVerticalData } from './DomainVerticalData';
import {
    DomainVerticalDataFromJSON,
    DomainVerticalDataFromJSONTyped,
    DomainVerticalDataToJSON,
    DomainVerticalDataToJSONTyped,
} from './DomainVerticalData';
import type { DomainCountryRankingData } from './DomainCountryRankingData';
import {
    DomainCountryRankingDataFromJSON,
    DomainCountryRankingDataFromJSONTyped,
    DomainCountryRankingDataToJSON,
    DomainCountryRankingDataToJSONTyped,
} from './DomainCountryRankingData';
import type { DomainAnalyticsPublisherResponsePublisherPromotype } from './DomainAnalyticsPublisherResponsePublisherPromotype';
import {
    DomainAnalyticsPublisherResponsePublisherPromotypeFromJSON,
    DomainAnalyticsPublisherResponsePublisherPromotypeFromJSONTyped,
    DomainAnalyticsPublisherResponsePublisherPromotypeToJSON,
    DomainAnalyticsPublisherResponsePublisherPromotypeToJSONTyped,
} from './DomainAnalyticsPublisherResponsePublisherPromotype';
import type { DomainMetaData } from './DomainMetaData';
import {
    DomainMetaDataFromJSON,
    DomainMetaDataFromJSONTyped,
    DomainMetaDataToJSON,
    DomainMetaDataToJSONTyped,
} from './DomainMetaData';
import type { DomainAffiliateNetworkData } from './DomainAffiliateNetworkData';
import {
    DomainAffiliateNetworkDataFromJSON,
    DomainAffiliateNetworkDataFromJSONTyped,
    DomainAffiliateNetworkDataToJSON,
    DomainAffiliateNetworkDataToJSONTyped,
} from './DomainAffiliateNetworkData';
import type { DomainSocialMediaData } from './DomainSocialMediaData';
import {
    DomainSocialMediaDataFromJSON,
    DomainSocialMediaDataFromJSONTyped,
    DomainSocialMediaDataToJSON,
    DomainSocialMediaDataToJSONTyped,
} from './DomainSocialMediaData';
import type { DomainKeywordData } from './DomainKeywordData';
import {
    DomainKeywordDataFromJSON,
    DomainKeywordDataFromJSONTyped,
    DomainKeywordDataToJSON,
    DomainKeywordDataToJSONTyped,
} from './DomainKeywordData';

/**
 * 
 * @export
 * @interface DomainAnalyticsPublisherResponsePublisher
 */
export interface DomainAnalyticsPublisherResponsePublisher {
    /**
     * 
     * @type {DomainAffiliateNetworkData}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    affiliateNetworks?: DomainAffiliateNetworkData;
    /**
     * 
     * @type {DomainCountryRankingData}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    countryRankings?: DomainCountryRankingData;
    /**
     * 
     * @type {string}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    domain?: string;
    /**
     * 
     * @type {DomainKeywordData}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    keywords?: DomainKeywordData;
    /**
     * 
     * @type {DomainAnalyticsPublisherResponsePublisherKnown}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    known?: DomainAnalyticsPublisherResponsePublisherKnown;
    /**
     * 
     * @type {object}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    liveUrls?: object;
    /**
     * 
     * @type {DomainMetaData}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    metaData?: DomainMetaData;
    /**
     * 
     * @type {object}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    partnerInformation?: object;
    /**
     * 
     * @type {object}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    partners?: object;
    /**
     * 
     * @type {DomainAnalyticsPublisherResponsePublisherPromotype}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    promotype?: DomainAnalyticsPublisherResponsePublisherPromotype;
    /**
     * 
     * @type {object}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    relatedPublishers?: object;
    /**
     * 
     * @type {number}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    relevance?: number;
    /**
     * 
     * @type {DomainSocialMediaData}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    socialMedia?: DomainSocialMediaData;
    /**
     * 
     * @type {number}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    trafficScore?: number;
    /**
     * 
     * @type {object}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    verticals?: object;
    /**
     * 
     * @type {DomainVerticalData}
     * @memberof DomainAnalyticsPublisherResponsePublisher
     */
    verticalsV2?: DomainVerticalData;
}

/**
 * Check if a given object implements the DomainAnalyticsPublisherResponsePublisher interface.
 */
export function instanceOfDomainAnalyticsPublisherResponsePublisher(value: object): value is DomainAnalyticsPublisherResponsePublisher {
    return true;
}

export function DomainAnalyticsPublisherResponsePublisherFromJSON(json: any): DomainAnalyticsPublisherResponsePublisher {
    return DomainAnalyticsPublisherResponsePublisherFromJSONTyped(json, false);
}

export function DomainAnalyticsPublisherResponsePublisherFromJSONTyped(json: any, ignoreDiscriminator: boolean): DomainAnalyticsPublisherResponsePublisher {
    if (json == null) {
        return json;
    }
    return {
        
        'affiliateNetworks': json['affiliateNetworks'] == null ? undefined : DomainAffiliateNetworkDataFromJSON(json['affiliateNetworks']),
        'countryRankings': json['countryRankings'] == null ? undefined : DomainCountryRankingDataFromJSON(json['countryRankings']),
        'domain': json['domain'] == null ? undefined : json['domain'],
        'keywords': json['keywords'] == null ? undefined : DomainKeywordDataFromJSON(json['keywords']),
        'known': json['known'] == null ? undefined : DomainAnalyticsPublisherResponsePublisherKnownFromJSON(json['known']),
        'liveUrls': json['liveUrls'] == null ? undefined : json['liveUrls'],
        'metaData': json['metaData'] == null ? undefined : DomainMetaDataFromJSON(json['metaData']),
        'partnerInformation': json['partnerInformation'] == null ? undefined : json['partnerInformation'],
        'partners': json['partners'] == null ? undefined : json['partners'],
        'promotype': json['promotype'] == null ? undefined : DomainAnalyticsPublisherResponsePublisherPromotypeFromJSON(json['promotype']),
        'relatedPublishers': json['relatedPublishers'] == null ? undefined : json['relatedPublishers'],
        'relevance': json['relevance'] == null ? undefined : json['relevance'],
        'socialMedia': json['socialMedia'] == null ? undefined : DomainSocialMediaDataFromJSON(json['socialMedia']),
        'trafficScore': json['trafficScore'] == null ? undefined : json['trafficScore'],
        'verticals': json['verticals'] == null ? undefined : json['verticals'],
        'verticalsV2': json['verticalsV2'] == null ? undefined : DomainVerticalDataFromJSON(json['verticalsV2']),
    };
}

export function DomainAnalyticsPublisherResponsePublisherToJSON(json: any): DomainAnalyticsPublisherResponsePublisher {
    return DomainAnalyticsPublisherResponsePublisherToJSONTyped(json, false);
}

export function DomainAnalyticsPublisherResponsePublisherToJSONTyped(value?: DomainAnalyticsPublisherResponsePublisher | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'affiliateNetworks': DomainAffiliateNetworkDataToJSON(value['affiliateNetworks']),
        'countryRankings': DomainCountryRankingDataToJSON(value['countryRankings']),
        'domain': value['domain'],
        'keywords': DomainKeywordDataToJSON(value['keywords']),
        'known': DomainAnalyticsPublisherResponsePublisherKnownToJSON(value['known']),
        'liveUrls': value['liveUrls'],
        'metaData': DomainMetaDataToJSON(value['metaData']),
        'partnerInformation': value['partnerInformation'],
        'partners': value['partners'],
        'promotype': DomainAnalyticsPublisherResponsePublisherPromotypeToJSON(value['promotype']),
        'relatedPublishers': value['relatedPublishers'],
        'relevance': value['relevance'],
        'socialMedia': DomainSocialMediaDataToJSON(value['socialMedia']),
        'trafficScore': value['trafficScore'],
        'verticals': value['verticals'],
        'verticalsV2': DomainVerticalDataToJSON(value['verticalsV2']),
    };
}

