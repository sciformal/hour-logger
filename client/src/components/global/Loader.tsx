import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

export default function Loader() {
  return (
    <div style={{ textAlign: 'center' }}>
      <CircularProgress />
    </div>
  );
}
