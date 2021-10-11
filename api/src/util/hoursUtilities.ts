import { User } from "../types/User";

export class HoursUtilities {
  public static handleCheckInProcess = (user: User): User => {
    const newUser = { ...user };

    if (user.isCheckedIn) {
      const updatedTransactions = [];

      newUser.transactions.forEach((el) => {
        if (!el.checkOutTime) {
          const checkOut = new Date();
          el.checkOutTime = checkOut.getTime().toString();
          el.checkOut = checkOut.toString();
          let timeElapsed =
            (Date.parse(checkOut.toString()) - Date.parse(el.checkIn)) /
            (60 * 60 * 1000);
          el.hours = timeElapsed.toString();
          newUser.hours += timeElapsed;
        }
        updatedTransactions.push(el);
      });

      newUser.isCheckedIn = false;
      newUser.transactions = updatedTransactions;
    } else {
      // Get date informatio
      const date = new Date();
      const checkInDate = date.getDate().toString();
      const checkInTime = date.getTime().toString();

      // Update user
      newUser.isCheckedIn = true;
      newUser.transactions.push({
        date: checkInDate,
        checkIn: date.toString(),
        checkOut: null,
        checkInTime: checkInTime,
        checkOutTime: null,
        hours: null,
      });
    }
    return newUser;
  };
}
