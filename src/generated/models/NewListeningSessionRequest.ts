/* tslint:disable */
/* eslint-disable */
/**
 * Spotifete Api
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    AuthenticatedRequest,
    AuthenticatedRequestFromJSON,
    AuthenticatedRequestFromJSONTyped,
    AuthenticatedRequestToJSON,
} from './';

/**
 * 
 * @export
 * @interface NewListeningSessionRequest
 */
export interface NewListeningSessionRequest {
    /**
     * 
     * @type {string}
     * @memberof NewListeningSessionRequest
     */
    listeningSessionTitle?: string;
    /**
     * 
     * @type {string}
     * @memberof NewListeningSessionRequest
     */
    loginSessionId?: string;
}

export function NewListeningSessionRequestFromJSON(json: any): NewListeningSessionRequest {
    return NewListeningSessionRequestFromJSONTyped(json, false);
}

export function NewListeningSessionRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): NewListeningSessionRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'listeningSessionTitle': !exists(json, 'listening_session_title') ? undefined : json['listening_session_title'],
        'loginSessionId': !exists(json, 'login_session_id') ? undefined : json['login_session_id'],
    };
}

export function NewListeningSessionRequestToJSON(value?: NewListeningSessionRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'listening_session_title': value.listeningSessionTitle,
        'login_session_id': value.loginSessionId,
    };
}

