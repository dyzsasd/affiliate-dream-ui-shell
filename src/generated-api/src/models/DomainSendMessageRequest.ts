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
 * @interface DomainSendMessageRequest
 */
export interface DomainSendMessageRequest {
    /**
     * 
     * @type {string}
     * @memberof DomainSendMessageRequest
     */
    content: string;
    /**
     * 
     * @type {string}
     * @memberof DomainSendMessageRequest
     */
    messageType?: DomainSendMessageRequestMessageTypeEnum;
    /**
     * 
     * @type {{ [key: string]: any | undefined; }}
     * @memberof DomainSendMessageRequest
     */
    metadata?: { [key: string]: any | undefined; };
}


/**
 * @export
 */
export const DomainSendMessageRequestMessageTypeEnum = {
    Text: 'text',
    System: 'system',
    Notification: 'notification'
} as const;
export type DomainSendMessageRequestMessageTypeEnum = typeof DomainSendMessageRequestMessageTypeEnum[keyof typeof DomainSendMessageRequestMessageTypeEnum];


/**
 * Check if a given object implements the DomainSendMessageRequest interface.
 */
export function instanceOfDomainSendMessageRequest(value: object): value is DomainSendMessageRequest {
    if (!('content' in value) || value['content'] === undefined) return false;
    return true;
}

export function DomainSendMessageRequestFromJSON(json: any): DomainSendMessageRequest {
    return DomainSendMessageRequestFromJSONTyped(json, false);
}

export function DomainSendMessageRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): DomainSendMessageRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'content': json['content'],
        'messageType': json['message_type'] == null ? undefined : json['message_type'],
        'metadata': json['metadata'] == null ? undefined : json['metadata'],
    };
}

export function DomainSendMessageRequestToJSON(json: any): DomainSendMessageRequest {
    return DomainSendMessageRequestToJSONTyped(json, false);
}

export function DomainSendMessageRequestToJSONTyped(value?: DomainSendMessageRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'content': value['content'],
        'message_type': value['messageType'],
        'metadata': value['metadata'],
    };
}

