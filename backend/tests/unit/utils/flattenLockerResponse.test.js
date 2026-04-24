const mongoose = require('mongoose');
const {
    flattenLocker,
    flattenLockers,
    mergeAssignmentIntoLocker,
    DEFAULTS,
    ASSIGNMENT_FIELDS,
    ASSIGNMENT_FIELD_SET,
} = require('../../../utils/flattenLockerResponse.js');
const Locker = require('../../../models/lockerModel.js');
const Assignment = require('../../../models/assignmentModel.js');
const {
    createTestLocker,
    createTestAssignment,
} = require('../../helpers/fixtures.js');

describe('flattenLockerResponse', () => {
    describe('DEFAULTS + ASSIGNMENT_FIELDS constants', () => {
        it('exposes exactly the 11 assignment fields that moved off Locker', () => {
            expect(ASSIGNMENT_FIELDS).toEqual([
                'employeeName',
                'employeeId',
                'employeeEmail',
                'employeePhone',
                'employeeGender',
                'CostToEmployee',
                'Duration',
                'StartDate',
                'EndDate',
                'expiresOn',
                'emailSent',
            ]);
        });

        it('uses "" for empty dates (shape parity with pre-A2.0.1 cancel reset)', () => {
            expect(DEFAULTS.StartDate).toBe('');
            expect(DEFAULTS.EndDate).toBe('');
            expect(DEFAULTS.expiresOn).toBe('');
        });

        it('uses defaults that match the old Locker schema / cancel reset', () => {
            expect(DEFAULTS.employeeName).toBe('N/A');
            expect(DEFAULTS.employeeId).toBe('');
            expect(DEFAULTS.employeeEmail).toBe('');
            expect(DEFAULTS.employeePhone).toBe('');
            expect(DEFAULTS.employeeGender).toBe('None');
            expect(DEFAULTS.CostToEmployee).toBe(0);
            expect(DEFAULTS.Duration).toBe('');
            expect(DEFAULTS.emailSent).toBe(false);
        });

        it('freezes the DEFAULTS so callers cannot mutate them', () => {
            expect(Object.isFrozen(DEFAULTS)).toBe(true);
            expect(Object.isFrozen(ASSIGNMENT_FIELDS)).toBe(true);
            expect(ASSIGNMENT_FIELD_SET.has('employeeName')).toBe(true);
            expect(ASSIGNMENT_FIELD_SET.has('LockerType')).toBe(false);
        });
    });

    describe('mergeAssignmentIntoLocker (pure function)', () => {
        it('applies all defaults when assignment is null', () => {
            const locker = { _id: 'l1', LockerNumber: 5, LockerType: 'half' };
            const merged = mergeAssignmentIntoLocker(locker, null);
            expect(merged.LockerNumber).toBe(5);
            expect(merged.LockerType).toBe('half');
            for (const f of ASSIGNMENT_FIELDS) {
                expect(merged[f]).toBe(DEFAULTS[f]);
            }
        });

        it('applies all defaults when assignment is undefined', () => {
            const locker = { _id: 'l1' };
            const merged = mergeAssignmentIntoLocker(locker, undefined);
            for (const f of ASSIGNMENT_FIELDS) {
                expect(merged[f]).toBe(DEFAULTS[f]);
            }
        });

        it('copies values from assignment when present', () => {
            const locker = { _id: 'l1', LockerNumber: 5 };
            const asgn = {
                employeeName: 'Alice',
                employeeEmail: 'alice@example.com',
                CostToEmployee: 150,
                Duration: '3',
                StartDate: new Date('2026-01-01'),
                emailSent: true,
            };
            const merged = mergeAssignmentIntoLocker(locker, asgn);
            expect(merged.employeeName).toBe('Alice');
            expect(merged.employeeEmail).toBe('alice@example.com');
            expect(merged.CostToEmployee).toBe(150);
            expect(merged.Duration).toBe('3');
            expect(merged.StartDate).toEqual(new Date('2026-01-01'));
            expect(merged.emailSent).toBe(true);
            // Fields not on the assignment still get defaults.
            expect(merged.employeeId).toBe('');
            expect(merged.employeeGender).toBe('None');
        });

        it('falls back to default when an assignment field is null or undefined', () => {
            const locker = { _id: 'l1' };
            const asgn = {
                employeeName: 'Bob',
                employeeId: null,
                employeeEmail: undefined,
            };
            const merged = mergeAssignmentIntoLocker(locker, asgn);
            expect(merged.employeeName).toBe('Bob');
            expect(merged.employeeId).toBe('');
            expect(merged.employeeEmail).toBe('');
        });

        it('does not mutate the input locker or assignment', () => {
            const locker = Object.freeze({ _id: 'l1', LockerNumber: 5 });
            const asgn = Object.freeze({ employeeName: 'Alice' });
            const merged = mergeAssignmentIntoLocker(locker, asgn);
            expect(merged).not.toBe(locker);
            expect(merged.employeeName).toBe('Alice');
        });

        it('preserves locker-config fields verbatim', () => {
            const locker = {
                _id: 'l1',
                LockerNumber: 7,
                LockerType: 'full',
                LockerStatus: 'occupied',
                LockerCode: 'ABC',
                LockerCodeCombinations: ['111', '222'],
                LockerPrice3Month: 100,
                availableForGender: 'Female',
                buildingId: 'b1',
                floorId: 'f1',
                zoneId: null,
            };
            const merged = mergeAssignmentIntoLocker(locker, null);
            for (const k of Object.keys(locker)) {
                expect(merged[k]).toEqual(locker[k]);
            }
        });
    });

    describe('flattenLocker (async, hits DB)', () => {
        it('returns locker with active-assignment fields spread onto it', async () => {
            const locker = await createTestLocker({ lockerNumber: 2001 });
            await createTestAssignment({
                lockerId: locker._id,
                employeeName: 'Carol',
                employeeEmail: 'carol@example.com',
                costToEmployee: 180,
            });

            const result = await flattenLocker(locker);
            expect(result.LockerNumber).toBe(2001);
            expect(result.employeeName).toBe('Carol');
            expect(result.employeeEmail).toBe('carol@example.com');
            expect(result.CostToEmployee).toBe(180);
        });

        it('returns defaults when the locker has no active assignment', async () => {
            const locker = await createTestLocker({ lockerNumber: 2002 });
            const result = await flattenLocker(locker);
            expect(result.employeeName).toBe('N/A');
            expect(result.employeeEmail).toBe('');
            expect(result.CostToEmployee).toBe(0);
            expect(result.StartDate).toBe('');
        });

        it('ignores ended assignments (only active + not soft-deleted)', async () => {
            const locker = await createTestLocker({ lockerNumber: 2003 });
            await createTestAssignment({
                lockerId: locker._id,
                employeeName: 'Dave',
                status: 'ended',
            });

            const result = await flattenLocker(locker);
            expect(result.employeeName).toBe('N/A');
        });

        it('ignores soft-deleted assignments even if status is active', async () => {
            const locker = await createTestLocker({ lockerNumber: 2004 });
            const asgn = await createTestAssignment({
                lockerId: locker._id,
                employeeName: 'Eve',
                status: 'active',
            });
            await Assignment.updateOne(
                { _id: asgn._id },
                { $set: { deletedAt: new Date() } },
            );

            const result = await flattenLocker(locker);
            expect(result.employeeName).toBe('N/A');
        });

        it('accepts a plain object (POJO), not only a Mongoose doc', async () => {
            const locker = await createTestLocker({ lockerNumber: 2005 });
            await createTestAssignment({
                lockerId: locker._id,
                employeeName: 'Frank',
            });

            const pojo = locker.toObject();
            const result = await flattenLocker(pojo);
            expect(result.employeeName).toBe('Frank');
        });
    });

    describe('flattenLockers (bulk, single batched Assignment query)', () => {
        it('flattens many lockers in one Assignment query', async () => {
            const l1 = await createTestLocker({ lockerNumber: 3001 });
            const l2 = await createTestLocker({ lockerNumber: 3002 });
            const l3 = await createTestLocker({ lockerNumber: 3003 });
            await createTestAssignment({
                lockerId: l1._id,
                employeeName: 'One',
            });
            await createTestAssignment({
                lockerId: l2._id,
                employeeName: 'Two',
            });
            // l3 has no assignment.

            const result = await flattenLockers([l1, l2, l3]);
            expect(result).toHaveLength(3);
            expect(result[0].employeeName).toBe('One');
            expect(result[1].employeeName).toBe('Two');
            expect(result[2].employeeName).toBe('N/A');
        });

        it('returns [] for an empty input array', async () => {
            const result = await flattenLockers([]);
            expect(result).toEqual([]);
        });

        it('preserves input order', async () => {
            const l1 = await createTestLocker({ lockerNumber: 3101 });
            const l2 = await createTestLocker({ lockerNumber: 3102 });
            await createTestAssignment({
                lockerId: l2._id,
                employeeName: 'OnlyL2',
            });

            const result = await flattenLockers([l2, l1]);
            expect(result[0].LockerNumber).toBe(3102);
            expect(result[0].employeeName).toBe('OnlyL2');
            expect(result[1].LockerNumber).toBe(3101);
            expect(result[1].employeeName).toBe('N/A');
        });
    });
});
