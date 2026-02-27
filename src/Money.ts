export default class Money {

    whole: number | bigint;
    fractional: number;
    decimal_places: number;
    iso_code: string;

    constructor(value: number | bigint, decimal_places: number, iso_code: string) {

        if (value === undefined || value === null) throw new Error('Value must not be undefined or null');

        if (typeof value === 'bigint') {

            this.whole = value / (10n ** BigInt(decimal_places));
            this.fractional = Number(value % (10n ** BigInt(decimal_places)));
        } else {

            this.whole = Math.trunc(value * (10 ** -decimal_places));
            this.fractional = value % (10 ** decimal_places);
        }

        this.decimal_places = decimal_places;
        this.iso_code = iso_code;
    }

    getValue(): number {

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