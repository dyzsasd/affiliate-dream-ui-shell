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
 * @interface HandlersSuccessResponse
 */
export interface HandlersSuccessResponse {
    /**
     * 
     * @type {object}
     * @memberof HandlersSuccessResponse
     */
    data?: object;
    /**
     * 
     * @type {string}
     * @memberof HandlersSuccessResponse
     */
    message?: string;
}

/**
 * Check if a given object implements the HandlersSuccessResponse interface.
 */
export function instanceOfHandlersSuccessResponse(value: object): value is HandlersSuccessResponse {
    return true;
}

export function HandlersSuccessResponseFromJSON(json: any): HandlersSuccessResponse {
    return HandlersSuccessResponseFromJSONTyped(json, false);
}

export function HandlersSuccessResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): HandlersSuccessResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'data': json['data'] == null ? undefined : json['data'],
        'message': json['message'] == null ? undefined : json['message'],
    };
}

export function HandlersSuccessResponseToJSON(json: any): HandlersSuccessResponse {
    return HandlersSuccessResponseToJSONTyped(json, false);
}

export function HandlersSuccessResponseToJSONTyped(value?: HandlersSuccessResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'data': value['data'],
        'message': value['message'],
    };
}

