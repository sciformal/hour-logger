import { User } from "../types/User";

export class HoursUtilities {
  public static handleCheckInProcess = (user: User): User => {
    const newUser = { ...user };

    if (user.isCheckedIn) {
      const updatedTransactions = [];

      let totalHours = 0;
      newUser.transactions.forEach((el) => {
        if (!el.checkOut == null) {
          el.checkOut = new Date().toString();
          let timeElapsed =
            (Date.parse(el.checkOut) - Date.parse(el.checkIn)) /
            (60 * 60 * 1000);
          newUser.hours = timeElapsed + totalHours; // add new hours
        } else {
          // loop over all hours and recalculate hours completed
          totalHours +=
            (Date.parse(el.checkOut) - Date.parse(el.checkIn)) /
            (60 * 60 * 1000);
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
      newUser.transactions.push({
        checkIn: date.toString(),
        checkOut: null,
      });
    }
    return newUser;
  };
}
