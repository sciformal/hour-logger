import { HourTransaction } from '../../src/types/HourTransaction';

export const sampleCheckInTime = 'Mon Oct 11 2021 12:00:00 GMT+0530 (IST)';
export const sampleCheckOutTime = 'Mon Oct 11 2021 15:30:02 GMT+0530 (IST)';

export const sampleTransaction: HourTransaction = {
  checkIn: sampleCheckInTime,
  checkOut: sampleCheckOutTime,
};
