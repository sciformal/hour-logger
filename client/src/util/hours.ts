export const formatHourTransaction = transaction => {
    const checkIn = new Date(transaction.checkIn);
    const checkOut = new Date(transaction.checkOut);
    const date = checkIn.toDateString();
    const checkInTime = checkIn.toLocaleTimeString();
    const checkOutTime = checkOut.toLocaleTimeString();
    const hours = (
      (Date.parse(transaction.checkOut) - Date.parse(transaction.checkIn)) /
      (60 * 60 * 1000)
    ).toFixed(2);

    return [date, checkInTime, checkOutTime, hours];
  };