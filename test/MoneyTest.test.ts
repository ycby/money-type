import {describe, it, expect} from 'vitest';
import Money from "src/Money.ts";

describe.concurrent('Money Tests', () => {

    describe('Constructor', () => {

        it('Should be instantiatable by constructor, 2dp', () => {

            const money = new Money(10, 1, 2, 'HKD');

            expect(money.getNominalValue()).toEqual(10.01);
        });

        it('Should be instantiatable by constructor, 4dp', () => {

            const money = new Money(10, 1, 4, 'HKD');

            expect(money.getNominalValue()).toEqual(10.0001);
        });
    });

    describe('From Smallest Denomination', () => {

        it('Should be instantiatable by fromSmallestDenomination, 2dp', () => {

            const money = Money.fromSmallestDenomination(1001, 2, 'HKD');

            expect(money.getNominalValue()).toEqual(10.01);
        });

        it('Should be instantiatable by fromSmallestDenomination, 4dp', () => {

            const money = Money.fromSmallestDenomination(100001, 4, 'HKD');

            expect(money.getNominalValue()).toEqual(10.0001);
        });

        it('Should be instantiatable by fromSmallestDenomination, 2dp, bigint', () => {

            const money = Money.fromSmallestDenomination(1001n, 2, 'HKD');

            expect(money.getNominalValue()).toEqual(10.01);
        });
    });

    describe('From Nominal Value', () => {

        it('Should be instantiatable by fromNominalValue, 2dp', () => {

            const money = Money.fromNominalValue(10.01, 2, 'HKD');

            expect(money.getNominalValue()).toEqual(10.01);
        });

        it('Should be instantiatable by fromNominalValue, 4dp', () => {

            const money = Money.fromNominalValue(10.0001, 4, 'HKD');

            expect(money.getNominalValue()).toEqual(10.0001);
        });

        it('Should be instantiatable by fromNominalValue, 0dp', () => {

            const money = Money.fromNominalValue(10, 0, 'HKD');

            expect(money.getNominalValue()).toEqual(10);
        });

        it('Should throw error if invalid value is provided in fromNominalValue', () => {

            expect(() => Money.fromNominalValue('10.01.01' as any, 2, 'HKD')).toThrow('Invalid value provided');
        });

        it('Should throw error if null value is provided in fromNominalValue', () => {

            expect(() => Money.fromNominalValue(null as any, 2, 'HKD')).toThrow('Value must not be undefined or null');
        });

        it('Should throw error if undefined value is provided in fromNominalValue', () => {

            expect(() => Money.fromNominalValue(undefined as any, 2, 'HKD')).toThrow('Value must not be undefined or null');
        });

        it('Should throw error if value provided is outside max safe integer', () => {

            expect(() => Money.fromNominalValue(10000000000000000.01, 2, 'HKD')).toThrow('Provided value is not within safe range')
        });

        it('Should throw error if value provided is outside min safe integer', () => {

            expect(() => Money.fromNominalValue(-10000000000000000.01, 2, 'HKD')).toThrow('Provided value is not within safe range')
        });
    });

    describe('Get value in smallest denomination', () => {

        it('Should be able to convert from Nominal value to Smallest Denomination, 2dp', () => {

            const money = Money.fromNominalValue(10.01, 2, 'HKD');

            expect(money.getValueInSmallestDenomination()).toEqual(1001);
        });

        it('Should be able to convert from Nominal value to Smallest Denomination, 4dp', () => {

            const money = Money.fromNominalValue(10.0001, 4, 'HKD');

            expect(money.getValueInSmallestDenomination()).toEqual(100001);
        });

        it('Should be able to convert from constructor to Smallest Denomination, 2dp', () => {

            const money = new Money(10, 1, 2, 'HKD');

            expect(money.getValueInSmallestDenomination()).toEqual(1001);
        });

        it('Should be able to convert from constructor to Smallest Denomination, 4dp large', () => {

            const money = new Money(100000000000000, 1, 4, 'HKD');

            expect(money.getValueInSmallestDenomination()).toEqual(1000000000000000001n);
        });

        it('Should be able to convert from constructor to Smallest Denomination, large', () => {

            const money = new Money(100000000000000000n, 1, 2, 'HKD');

            expect(money.getValueInSmallestDenomination()).toEqual(10000000000000000001n);
        });

        it('Should be able to convert from constructor to Smallest Denomination, large but safe', () => {

            const money = new Money(100000000000n, 1, 2, 'HKD');

            expect(money.getValueInSmallestDenomination()).toEqual(10000000000001);
        });
    });
});