export default class Money {
    whole;
    fractional;
    decimal_places;
    iso_code;
    constructor(whole, fractional, decimal_places = 0, iso_code) {
        this.whole = whole;
        this.fractional = fractional;
        this.decimal_places = decimal_places;
        this.iso_code = iso_code;
    }
    static fromSmallestDenomination(value, decimal_places, iso_code) {
        if (value === undefined || value === null)
            throw new Error('Value must not be undefined or null');
        let whole;
        let fractional;
        if (typeof value === 'bigint') {
            whole = value / (10n ** BigInt(decimal_places));
            fractional = Number(value % (10n ** BigInt(decimal_places)));
        }
        else {
            whole = Math.trunc(value * (10 ** -decimal_places));
            fractional = value % (10 ** decimal_places);
        }
        return new Money(whole, fractional, decimal_places, iso_code);
    }
    //No unsafe ints here
    static fromNominalValue(value, decimal_places, iso_code) {
        if (value === undefined || value === null)
            throw new Error('Value must not be undefined or null');
        if (Number.MAX_SAFE_INTEGER < value || Number.MIN_SAFE_INTEGER > value)
            throw new Error('Provided value is not within safe range. It must be created using the constructor');
        let whole;
        let fractional;
        const fractionalArray = value.toString().split('.');
        if (fractionalArray.length > 2)
            throw new Error(`Invalid value provided: ${value}`);
        if (fractionalArray.length === 2)
            fractional = Number(fractionalArray[1]);
        else
            fractional = 0;
        whole = Math.trunc(value);
        return new Money(whole, fractional, decimal_places, iso_code);
    }
    getNominalValue() {
        const fractionalString = this.fractional.toString().padStart(this.decimal_places, "0");
        return Number(`${this.whole}.${fractionalString}`);
    }
    getValueInSmallestDenomination() {
        if (typeof this.whole === 'number') {
            const value = this.whole * (10 ** this.decimal_places) + this.fractional;
            if (Number.isSafeInteger(value)) {
                return value;
            }
            else {
                return BigInt(this.whole) * (10n ** BigInt(this.decimal_places)) + BigInt(this.fractional);
            }
        }
        else {
            const bigIntValue = BigInt(this.whole) * (10n ** BigInt(this.decimal_places)) + BigInt(this.fractional);
            if (bigIntValue >= BigInt(Number.MAX_SAFE_INTEGER)) {
                return bigIntValue;
            }
            else {
                return Number(bigIntValue);
            }
        }
    }
}
