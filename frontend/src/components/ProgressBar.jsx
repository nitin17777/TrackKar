import React, { useEffect, useState } from 'react';

const ProgressBar = ({ progress, color = 'bg-blue-500' }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(progress);
  }, [progress]);

  return (
    <div className="w-full bg-gray-300 h-4 rounded-md overflow-hidden">
      <div
        className={`${color} h-4 rounded-md transition-all duration-500`}
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
