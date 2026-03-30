export default class Money {
    whole: number | bigint;
    fractional: number;
    decimal_places: number;
    iso_code: string | undefined;
    constructor(whole: number | bigint, fractional: number, decimal_places?: number, iso_code?: string);
    static fromSmallestDenomination(value: number | bigint, decimal_places: number, iso_code: string): Money;
    static fromNominalValue(value: number, decimal_places: number, iso_code: string): Money;
    getNominalValue(): number;
    getValueInSmallestDenomination(): number | bigint;
}
