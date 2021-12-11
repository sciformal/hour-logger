import { UserSituation } from '../../src/types/models/UserType';
import { User } from '../../src/types/models/User';
import { sampleStudentNumber, sampleUser } from '../mocks/user';
import { UsersUtilities } from '../../src/util/user-utilities';
import { DynamoUtilities } from '../../src/util/dynamo-utilities';

describe('Users Utilities Tests', () => {
  describe('Unique Student Number Tests', () => {
    it('should return true when dynamodb returns no users', async () => {
      jest.spyOn(DynamoUtilities, 'query').mockResolvedValue([]);

      const uniqueStudentNumber = await UsersUtilities.uniqueStudentNumber(
        sampleStudentNumber,
      );

      expect(uniqueStudentNumber).toBeTruthy();
    });
    it('should return false when dynamodb returns at least one user', async () => {
      const testUser: User = {
        ...sampleUser,
      };
      jest.spyOn(DynamoUtilities, 'query').mockResolvedValue([testUser]);

      const uniqueStudentNumber = await UsersUtilities.uniqueStudentNumber(
        sampleStudentNumber,
      );

      expect(uniqueStudentNumber).toBeFalsy;
    });
  });

  describe('User Situation Tests', () => {
    it('should set the proper number of hours for ENGINEER_ENROLLED', async () => {
      const requiredHours = UsersUtilities.totalHours(
        UserSituation.ENGINEER_ENROLLED,
      );
      expect(requiredHours.regularHoursNeeded).toBe(8);
      expect(requiredHours.finalHoursNeeded).toBe(10);
    });
    it('should set the proper number of hours for INTERNSHIP_KTOWN', async () => {
      const requiredHours = UsersUtilities.totalHours(
        UserSituation.INTERNSHIP_KTOWN,
      );
      expect(requiredHours.regularHoursNeeded).toBe(5);
      expect(requiredHours.finalHoursNeeded).toBe(0);
    });
    it('should set the proper number of hours for INTERNSHIP', async () => {
      const requiredHours = UsersUtilities.totalHours(UserSituation.INTERNSHIP);
      expect(requiredHours.regularHoursNeeded).toBe(0);
      expect(requiredHours.finalHoursNeeded).toBe(0);
    });
    it('should set the proper number of hours for GUEST_QUEENS', async () => {
      const requiredHours = UsersUtilities.totalHours(
        UserSituation.GUEST_QUEENS,
      );
      expect(requiredHours.regularHoursNeeded).toBe(5);
      expect(requiredHours.finalHoursNeeded).toBe(0);
    });
    it('should set the proper number of hours for GUEST', async () => {
      const requiredHours = UsersUtilities.totalHours(UserSituation.GUEST);
      expect(requiredHours.regularHoursNeeded).toBe(0);
      expect(requiredHours.finalHoursNeeded).toBe(0);
    });
    it('should set the proper number of hours for SCI FORMAL', async () => {
      const requiredHours = UsersUtilities.totalHours(UserSituation.SCIFORMAL);
      expect(requiredHours.regularHoursNeeded).toBe(0);
      expect(requiredHours.finalHoursNeeded).toBe(0);
    });
  });
});
