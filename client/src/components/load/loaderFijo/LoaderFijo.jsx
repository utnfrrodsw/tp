import React from 'react';
import './leaderfijo.css';

function LoaderFijo() {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems:'center', height: '100%'}}>
      <div className="loader-container">
        <div className="loader-fijo"></div>
      </div>
    </div>
  );
}

export default LoaderFijo;
