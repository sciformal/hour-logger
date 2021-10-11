import { HourTransaction } from './../../src/types/HourTransaction';

export const sampleTransaction : HourTransaction = {
    date : "2021-10-11",
    checkIn : "Mon Oct 11 2021 12:00:00 GMT+0530 (IST)",
    checkOut : "Mon Oct 11 2021 15:30:02 GMT+0530 (IST)",
    checkInTime : "12:00",
    checkOutTime : "15:30", //should be time in milliseconds since Janurary 1 1970
    hours : "3.5",
}

