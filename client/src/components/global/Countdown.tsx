import React, { useEffect, useState } from 'react';

export default function Countdown() {
  const calculateTimeLeft = () => {
    const difference = +new Date(`2022-03-12`) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        months: Math.floor(difference / (1000 * 60 * 60 * 24) / 30),
        days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 30),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  // @ts-ignore
  const timerComponents = [];

  Object.keys(timeLeft).forEach(interval => {
    // @ts-ignore
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span>
        {
          // @ts-ignore
          timeLeft[interval]
        }{' '}
        {interval}{' '}
      </span>,
    );
  });
  return (
    <div>
      {
        // @ts-ignore
        timerComponents.length ? timerComponents : <span>Time's up!</span>
      }
    </div>
  );
}
