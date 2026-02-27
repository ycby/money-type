export default class Money {

    whole: number | bigint;
    fractional: number;
    decimal_places: number;
    iso_code: string | undefined;

    constructor(whole: number | bigint, fractional: number, decimal_places: number = 0, iso_code?: string) {
        this.whole = whole;
        this.fractional = fractional;
        this.decimal_places = decimal_places;
        this.iso_code = iso_code;
    }

    static fromSmallestDenomination(value: number | bigint, decimal_places: number, iso_code: string) {

        if (value === undefined || value === null) throw new Error('Value must not be undefined or null');

        let whole: number | bigint;
        let fractional: number;

        if (typeof value === 'bigint') {

            whole = value / (10n ** BigInt(decimal_places));
            fractional = Number(value % (10n ** BigInt(decimal_places)));
        } else {

            whole = Math.trunc(value * (10 ** -decimal_places));
            fractional = value % (10 ** decimal_places);
        }

        return new Money(whole, fractional, decimal_places, iso_code);
    }

    static fromNominalValue(value: number | bigint, decimal_places: number, iso_code: string) {

        if (value === undefined || value === null) throw new Error('Value must not be undefined or null');

        let whole: number | bigint;
        let fractional: number;

        if (typeof value === 'bigint') {

            //fractional is 0 because a bigint cannot have fractional
            whole = value;
            fractional = 0;
        } else {

            whole = Math.trunc(value);
            fractional = value % 1;
        }

        return new Money(whole, fractional, decimal_places, iso_code);
    }

    getNominalValue(): number {

        return Number(`${this.whole}.${this.fractional}`);
    }

    getValueInSmallestDenomination(): number | bigint {

        if (typeof this.whole === 'number') {

            const value = this.whole * (10 ** this.decimal_places) + this.fractional;

            if (Number.isSafeInteger(value)) {

                return value;
            } else {

                return BigInt(this.whole) * (10n ** BigInt(this.decimal_places)) + BigInt(this.fractional);
            }
        } else {

            const bigIntValue = BigInt(this.whole) * (10n ** BigInt(this.decimal_places)) + BigInt(this.fractional);

            if (bigIntValue >= BigInt(Number.MAX_SAFE_INTEGER)) {

                return bigIntValue;
            } else {

                return Number(bigIntValue);
            }
        }
    }
}