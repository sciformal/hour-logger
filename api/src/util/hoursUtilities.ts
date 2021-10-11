export class HoursUtilities {
  public static handleCheckInProcess = (user) => {
    const newUser = user;
    if (user.isCheckedIn) {
      // check them out
      newUser.isCheckedIn = false;
      let timeElapsed;

      const updatedTransactions = [];

      newUser.transactions.forEach((el) => {
        if (el.checkOutTime == null) {
          el.checkOutTime = new Date().toString();
          // result of date arithmetic is in milliseconds and then converted to hours
          timeElapsed =
            (Date.parse(el.checkOutTime) - Date.parse(el.checkInTime)) /
            (60 * 60 * 1000);
          // TODO: loop over transactions and recalculate hours
          newUser.hours += timeElapsed;
        }
        updatedTransactions.push(el);
      });

      newUser.transactions = updatedTransactions;
    } else {
      const checkInTime = new Date().toString();

      newUser.isCheckedIn = true;
      const newTransaction = {
        checkInTime,
        checkOutTime: null,
      };

      if (newUser.transactions) {
        newUser.transactions.push(newTransaction);
      } else {
        var transactions = [];
        transactions.push(newTransaction);
        newUser.transactions = transactions;
      }

      return newUser;
    }
  };
}
