import { User } from './../../src/types/User';
import { sampleStudentNumber, sampleUser } from './../mocks/user';
import { UsersUtilities } from './../../src/util/usersUtilities';
import { DynamoUtilities } from './../../src/util/dynamo';
describe("Users Utilities Tests", () => {
    describe("Unique Student Number Tests", () => {
        it("should return true when dynamodb returns no users", async () => {
            jest.spyOn(DynamoUtilities, "query").mockResolvedValue([]);

            const uniqueStudentNumber = await UsersUtilities.uniqueStudentNumber(sampleStudentNumber);
            
            expect(uniqueStudentNumber).toBeTruthy();
        });
        it("should return false when dynamodb returns at least one user", async () => {
            const testUser: User = {
                ...sampleUser
            }
            jest.spyOn(DynamoUtilities, "query").mockResolvedValue([testUser]);

            const uniqueStudentNumber = await UsersUtilities.uniqueStudentNumber(sampleStudentNumber);

            expect(uniqueStudentNumber).toBeFalsy;            
        });
    });
});