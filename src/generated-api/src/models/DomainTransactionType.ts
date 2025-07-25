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


/**
 * 
 * @export
 */
export const DomainTransactionType = {
    TransactionTypeRecharge: 'recharge',
    TransactionTypeDebit: 'debit',
    TransactionTypeCredit: 'credit',
    TransactionTypeRefund: 'refund',
    TransactionTypeChargeback: 'chargeback',
    TransactionTypeInvoicePayment: 'invoice_payment',
    TransactionTypeUsageCharge: 'usage_charge',
    TransactionTypeAffiliatePayout: 'affiliate_payout',
    TransactionTypePlatformFee: 'platform_fee',
    TransactionTypeAdjustment: 'adjustment',
    TransactionTypeTransfer: 'transfer'
} as const;
export type DomainTransactionType = typeof DomainTransactionType[keyof typeof DomainTransactionType];


export function instanceOfDomainTransactionType(value: any): boolean {
    for (const key in DomainTransactionType) {
        if (Object.prototype.hasOwnProperty.call(DomainTransactionType, key)) {
            if (DomainTransactionType[key as keyof typeof DomainTransactionType] === value) {
                return true;
            }
        }
    }
    return false;
}

export function DomainTransactionTypeFromJSON(json: any): DomainTransactionType {
    return DomainTransactionTypeFromJSONTyped(json, false);
}

export function DomainTransactionTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): DomainTransactionType {
    return json as DomainTransactionType;
}

export function DomainTransactionTypeToJSON(value?: DomainTransactionType | null): any {
    return value as any;
}

export function DomainTransactionTypeToJSONTyped(value: any, ignoreDiscriminator: boolean): DomainTransactionType {
    return value as DomainTransactionType;
}

