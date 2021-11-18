import { User } from '../types/models/User';

export class HoursUtilities {
  public static handleCheckInProcess = (user: User): User => {
    const newUser = { ...user };

    if (user.isCheckedIn) {
      const updatedTransactions = [];

      let totalHours = 0;
      newUser.transactions.forEach(el => {
        if (el.checkOut == null) {
          el.checkOut = new Date().toString();
          const timeElapsed = HoursUtilities.calculateHours(
            el.checkIn,
            el.checkOut,
          );
          newUser.hours = timeElapsed + totalHours; // add new hours
        } else {
          // loop over all hours and recalculate hours completed
          totalHours += HoursUtilities.calculateHours(el.checkIn, el.checkOut);
        }
        updatedTransactions.push(el);
      });

      newUser.isCheckedIn = false;
      newUser.transactions = updatedTransactions;
    } else {
      // Get date informatio
      const date = new Date();

      // Update user
      newUser.isCheckedIn = true;
      if (newUser.transactions) {
        newUser.transactions.push({
          checkIn: date.toString(),
          checkOut: null,
        });
      } else {
        const transactions = [];
        transactions.push({
          checkIn: date.toString(),
          checkOut: null,
        });
        newUser.transactions = transactions;
      }
    }
    return newUser;
  };

  public static handleUpdateHoursProcess = (
    user: User,
    checkIn: string,
    checkOut: string,
  ): User => {
    const newUser = { ...user };
    // create new transaction element. add it to user
    newUser.transactions.push({
      checkIn,
      checkOut,
    });

    let totalHours = 0;
    newUser.transactions.forEach(el => {
      totalHours += HoursUtilities.calculateHours(el.checkIn, el.checkOut);
    });
    newUser.hours = totalHours;

    return newUser;
  };

  public static calculateHours = (checkIn: string, checkOut: string): number =>
    (Date.parse(checkOut) - Date.parse(checkIn)) / (60 * 60 * 1000);
}