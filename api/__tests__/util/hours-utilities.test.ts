import {
  sampleCheckInTime,
  sampleCheckOutTime,
  sampleTransaction,
} from '../mocks/hours';
import { HoursUtilities } from '../../src/util/hours-utilities';
import { sampleUser } from '../mocks/user';
import { UserDTO } from '../../src/types/database/User';

describe('Hours Utilities Tests', () => {
  describe('Check In User Tests', () => {
    it("should check in a user that's not checked in, 1st transaction", () => {
      const checkedOutUser: UserDTO = {
        ...sampleUser,
      };

      expect(checkedOutUser.transactions.length).toBe(0);

      const updatedUser = HoursUtilities.handleCheckInProcess(checkedOutUser);

      expect(updatedUser.isCheckedIn).toBeTruthy();
      expect(updatedUser.transactions.length).toBe(1);
      expect(updatedUser.transactions[0].checkOut).toBeNull();
    });

    it("should check in a user that's not checked in, multiple transactions", () => {
      const checkedOutUser: UserDTO = {
        ...sampleUser,
        transactions: [sampleTransaction],
      };

      expect(checkedOutUser.transactions.length).toBe(1);

      const updatedUser = HoursUtilities.handleCheckInProcess(checkedOutUser);

      expect(updatedUser.isCheckedIn).toBeTruthy();
      expect(updatedUser.transactions.length).toBe(2);
      expect(
        updatedUser.transactions[updatedUser.transactions.length - 1].checkOut,
      ).toBeNull();
    });

    it('should check out a user that is checked in', () => {
      const checkedInUser: UserDTO = {
        ...sampleUser,
        isCheckedIn: true,
      };

      const updatedUser = HoursUtilities.handleCheckInProcess(checkedInUser);

      expect(updatedUser.isCheckedIn).toBeFalsy();
    });
  });

  describe('Update hours Tests', () => {
    it('should check that new transaction was added', () => {
      const testUser: UserDTO = {
        ...sampleUser,
        transactions: [],
      };

      const updatedUser = HoursUtilities.handleUpdateHoursProcess(
        testUser,
        sampleCheckInTime,
        sampleCheckOutTime,
      );
      const expectedHours = HoursUtilities.calculateHours(
        sampleCheckInTime,
        sampleCheckOutTime,
      );

      expect(updatedUser.hours).toEqual(expectedHours);
      expect(updatedUser.transactions.length).toBe(1);
    });
  });
});
