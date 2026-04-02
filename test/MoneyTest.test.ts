import {describe, it, expect} from 'vitest';
import Money from "src/Money.js";

describe.concurrent('Money Tests', () => {

    describe('Constructor', () => {

        it('Should be instantiatable by constructor, 2dp', () => {

            const money = new Money(1000n, 2, 'HKD');

            expect(money.getNominalValue()).toEqual('10.00');
        });
    });

    describe('From Smallest Denomination', () => {

        it('Should be instantiatable by fromSmallestDenomination, 2dp', () => {

            const money = Money.fromSmallestDenomination(1001, 2, 'HKD');

            expect(money.getNominalValue()).toEqual('10.01');
        });

        it('Should be instantiatable by fromSmallestDenomination, 4dp', () => {

            const money = Money.fromSmallestDenomination(100001, 4, 'HKD');

            expect(money.getNominalValue()).toEqual('10.0001');
        });

        it('Should be instantiatable by fromSmallestDenomination, 2dp, bigint', () => {

            const money = Money.fromSmallestDenomination(1001n, 2, 'HKD');

            expect(money.getNominalValue()).toEqual('10.01');
        });
    });

    describe('From Nominal Value', () => {

        it('Should be instantiatable by fromNominalValue, 2dp', () => {

            const money = Money.fromNominalValue(10.01, 2, 'HKD');

            expect(money.getNominalValue()).toEqual('10.01');
        });

        it('Should be instantiatable by fromNominalValue, 3dp but not smallest unit', () => {

            const money = Money.fromNominalValue(10.01, 3, 'HKD');

            expect(money.getNominalValue()).toEqual('10.010');
        });

        it('Should be instantiatable by fromNominalValue, 4dp', () => {

            const money = Money.fromNominalValue(10.0001, 4, 'HKD');

            expect(money.getNominalValue()).toEqual('10.0001');
        });

        it('Should be instantiatable by fromNominalValue, 0dp', () => {

            const money = Money.fromNominalValue(10, 0, 'HKD');

            expect(money.getNominalValue()).toEqual('10');
        });

        it('Should throw error if invalid value is provided in fromNominalValue', () => {

            expect(() => Money.fromNominalValue('10.01.01' as any, 2, 'HKD')).toThrow('Value must be a number');
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

            expect(money.getValueInSmallestDenomination()).toEqual(1001n);
        });

        it('Should be able to convert from Nominal value to Smallest Denomination, 4dp', () => {

            const money = Money.fromNominalValue(10.0001, 4, 'HKD');

            expect(money.getValueInSmallestDenomination()).toEqual(100001n);
        });

        it('Should be able to convert from constructor to Smallest Denomination, 2dp', () => {

            const money = new Money(10n, 0, 'HKD');

            expect(money.getValueInSmallestDenomination()).toEqual(10n);
        });

        it('Should be able to convert from Nominal to Smallest Denomination, 2dp', () => {

            const money = Money.fromNominalValue(10.01, 3, 'HKD');

            expect(money.getValueInSmallestDenomination()).toEqual(10010n);
        });

        it('Should be able to convert from Nominal to Smallest Denomination, large but safe', () => {

            const money = Money.fromNominalValue(10000000000000.01, 2, 'HKD');

            expect(money.getValueInSmallestDenomination()).toEqual(1000000000000001n);
        });

        it('Should be able to convert from Nominal to Smallest Denomination, large and unsafe', () => {

            expect(() => Money.fromNominalValue(1000000000000000.01, 2, 'HKD')).toThrow('Provided value is not within safe range')
        });
    });

    describe('Add tests', () => {

        it('Should be able to add two money types of the same precision', () => {

            const a = Money.fromNominalValue(10.01, 2, 'HKD');
            const b = Money.fromNominalValue(10.01, 2, 'HKD');

            expect('20.02', a.add(b).getNominalValue());
        });

        it('Should be able to add two money types of different precision', () => {

            const a = Money.fromNominalValue(10.01, 2, 'HKD');
            const b = Money.fromNominalValue(10.0001, 5, 'HKD');

            expect('20.01010', a.add(b).getNominalValue());
        });


        it('Should be able to add two money types from different instance', () => {

            const a = Money.fromNominalValue(10.01, 2, 'HKD');
            const b = Money.fromSmallestDenomination(100001n, 5, 'HKD');

            expect('20.01010', a.add(b).getNominalValue());
        });

        it('Should throw error when ISO codes are different', () => {

            const a = Money.fromNominalValue(10.01, 2, 'HKD');
            const b = Money.fromSmallestDenomination(100001n, 5, 'USD');

            expect(() => a.add(b)).toThrow('Cannot perform operation on different ISO codes');
        });
    });

    describe('Subtract tests', () => {

        it('Should be able to subtract two money types of the same precision', () => {

            const a = Money.fromNominalValue(10.01, 2, 'HKD');
            const b = Money.fromNominalValue(10.01, 2, 'HKD');

            expect('0.00', a.subtract(b).getNominalValue());
        });

        it('Should be able to subtract two money types of different precision', () => {

            const a = Money.fromNominalValue(10.01, 2, 'HKD');
            const b = Money.fromNominalValue(10.0001, 5, 'HKD');

            expect('0.00990', a.subtract(b).getNominalValue());
        });

        it('Should be able to subtract two money types from different instance', () => {

            const a = Money.fromNominalValue(10.01, 2, 'HKD');
            const b = Money.fromSmallestDenomination(100001n, 5, 'HKD');

            expect('0.00990', a.subtract(b).getNominalValue());
        });

        it('Should throw error when ISO codes are different', () => {

            const a = Money.fromNominalValue(10.01, 2, 'HKD');
            const b = Money.fromSmallestDenomination(100001n, 5, 'USD');

            expect(() => a.subtract(b)).toThrow('Cannot perform operation on different ISO codes');
        });
    });
});