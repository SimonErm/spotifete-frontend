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

/**
 * 
 * @export
 * @enum {string}
 */
export enum SongRequestStatus {
    StatusPlayed = 'PLAYED',
    StatusCurrentlyPlaying = 'CURRENTLY_PLAYING',
    StatusUpNext = 'UP_NEXT',
    StatusInQueue = 'IN_QUEUE'
}

export function SongRequestStatusFromJSON(json: any): SongRequestStatus {
    return SongRequestStatusFromJSONTyped(json, false);
}

export function SongRequestStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): SongRequestStatus {
    return json as SongRequestStatus;
}

export function SongRequestStatusToJSON(value?: SongRequestStatus | null): any {
    return value as any;
}
