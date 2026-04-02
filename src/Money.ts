export default class Money {

    whole: bigint;
    decimal_places: number;
    iso_code: string | undefined;

    constructor(whole: bigint, decimal_places: number = 0, iso_code?: string) {
        this.whole = whole;
        this.decimal_places = decimal_places;
        this.iso_code = iso_code;
    }

    static fromSmallestDenomination(value: number | bigint, decimal_places: number, iso_code: string) {

        if (value === undefined || value === null) throw new Error('Value must not be undefined or null');

        return new Money(typeof value === 'bigint' ? value : BigInt(value), decimal_places, iso_code);
    }

    //No unsafe ints here
    static fromNominalValue(value: number, decimal_places: number, iso_code: string) {

        if (value === undefined || value === null) throw new Error('Value must not be undefined or null');
        if (typeof value !== 'number') throw new Error('Value must be a number');
        const convertedValue = value * (10 ** decimal_places);
        if (Number.MAX_SAFE_INTEGER < convertedValue || Number.MIN_SAFE_INTEGER > convertedValue) throw new Error('Provided value is not within safe range. It must be created using the constructor');

        const stringRep = value.toString().split('.');

        const wholePart = BigInt(stringRep[0].padEnd(stringRep[0].length + decimal_places, '0'));
        const decimalPart = stringRep.length > 1 ? BigInt(stringRep[1].slice(0, decimal_places).padEnd(decimal_places, '0')) : 0n;

        return new Money(wholePart + decimalPart, decimal_places, iso_code);
    }

    getNominalValue(): string {

        const wholeString = this.whole.toString();

        if (this.decimal_places === 0) {

            return wholeString;
        }

        return `${this.whole.toString().slice(0, wholeString.length - this.decimal_places)}.${this.whole.toString().slice(wholeString.length - this.decimal_places)}`;
    }

    getValueInSmallestDenomination(): bigint {

        return this.whole;
    }

    add(toAdd: Money): Money {

        if (this.iso_code !== toAdd.iso_code) throw new Error('Cannot perform operation on different ISO codes');

        const highestDPMoney = Money._normalisePrecision(this, toAdd)[0];

        return new Money(this.whole + toAdd.whole, highestDPMoney.decimal_places, this.iso_code);
    }

    subtract(toSubtract: Money): Money {

        if (this.iso_code !== toSubtract.iso_code) throw new Error('Cannot perform operation on different ISO codes');

        const highestDPMoney = Money._normalisePrecision(this, toSubtract)[0];

        return new Money(this.whole - toSubtract.whole, highestDPMoney.decimal_places, this.iso_code);
    }

    static _orderByPrecision(a: Money, b: Money): Money[] {

        const aIsHigherPrecision = a.decimal_places >= b.decimal_places;

        return aIsHigherPrecision ? [a, b] : [b, a];
    }

    static _normalisePrecision(a: Money, b: Money): Money[] {

        const orderedMoneyByPrecision = Money._orderByPrecision(a, b);

        const [highestDPMoney, lowestDPMoney] = orderedMoneyByPrecision;

        const dpDifference = Math.abs(highestDPMoney.decimal_places - lowestDPMoney.decimal_places);

        lowestDPMoney.decimal_places = highestDPMoney.decimal_places;
        lowestDPMoney.whole *= 10n ** BigInt(dpDifference);

        return [highestDPMoney, lowestDPMoney];
    }
}