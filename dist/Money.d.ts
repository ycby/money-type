export default class Money {
    whole: bigint;
    decimal_places: number;
    iso_code: string | undefined;
    constructor(whole: bigint, decimal_places?: number, iso_code?: string);
    static fromSmallestDenomination(value: number | bigint, decimal_places: number, iso_code: string): Money;
    static fromNominalValue(value: number, decimal_places: number, iso_code: string): Money;
    getNominalValue(): string;
    getValueInSmallestDenomination(): bigint;
    add(toAdd: Money): Money;
    subtract(toSubtract: Money): Money;
    static _orderByPrecision(a: Money, b: Money): Money[];
    static _normalisePrecision(a: Money, b: Money): Money[];
}
