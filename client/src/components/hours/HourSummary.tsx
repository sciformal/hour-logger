import { IUserProps } from '../../types/props/UserProps';
import { formatHourTransaction } from '../../util/hours';
import { Progress } from '../global/Progress';
import { HourLoggerTable } from '../global/Table';

const hoursHeaders = ['Date', 'Check In', 'Check Out', 'Hours'];

export const HoursSummary = ({ user }: IUserProps) => {
  const totalHours = user.regularHoursNeeded + user.finalHoursNeeded;
  const totalHoursFormatted = user.hours.toFixed(1); // round to 2 decimals

  return (
    // Container
    <div style={{ display: 'flex' }}>
      {/* Left Side */}
      <div
        style={{
          width: '50%',
          textAlign: 'center',
          borderRight: '1px solid #EEEEEE',
        }}
      >
        <h4>
          <b>Hours Summary</b>: {totalHoursFormatted}/{totalHours} hours
        </h4>
        <br />
        <br />
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'space-evenly',
          }}
        >
          <div>
            <h5>
              Normal Hours ({user.hours}/{user.regularHoursNeeded} hours)
            </h5>
            <Progress max={user.regularHoursNeeded} completed={user.hours} />
          </div>
          <div>
            <h5>
              Final Hours ({user.finalHours}/{user.finalHoursNeeded} hours)
            </h5>
            <Progress max={user.finalHoursNeeded} completed={user.finalHours} />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div style={{ width: '50%', textAlign: 'center' }}>
        <HoursTable user={user} />
      </div>
    </div>
  );
};

const HoursTable = ({ user }) => {
  const hoursEntries = user.transactions.map(transaction =>
    formatHourTransaction(transaction),
  );

  return (
    <div>
      <h4>
        <b>My Hours</b>
      </h4>
      <br />
      <br />

      {hoursEntries.length > 0 ? (
        <div style={{ width: '80%', margin: 'auto' }}>
          <HourLoggerTable rows={hoursEntries} headers={hoursHeaders} />
        </div>
      ) : (
        <div style={{ width: '80%', margin: 'auto' }}>
          No hours have been logged yet!
        </div>
      )}
    </div>
  );
};
