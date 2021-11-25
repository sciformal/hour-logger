import { CircularProgressbar } from 'react-circular-progressbar';

export const Progress = props => {
  const { completed, max } = props;
  // @ts-ignore
  const percentage = parseInt((completed / max) * 100);

  
  return (
    <CircularProgressbar
      value={percentage}
      text={`${percentage}%`}
      styles={{
        // Customize the root svg element
        root: {
          width: 150,
        },
        // Customize the path, i.e. the "completed progress"
        path: {
          // Path color
          // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
          strokeLinecap: 'butt',
          // Customize transition animation
          transition: 'stroke-dashoffset 0.5s ease 0s',
          // Rotate the path
          transformOrigin: 'center center',
        },
        // Customize the circle behind the path, i.e. the "total progress"
        trail: {
          // Trail color
          stroke: '#d6d6d6',
          // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
          strokeLinecap: 'butt',
          // Rotate the trail
          transform: 'rotate(0.25turn)',
          transformOrigin: 'center center',
        },
        // Customize the text
        text: {
          // Text color
          fill: '#000000',
          // Text size
          fontSize: '16px',
        },
        // Customize background - only used when the `background` prop is true
        background: {
          fill: '#3e98c7',
        },
      }}
    >
      <div>Test</div>
    </CircularProgressbar>
  );
};
