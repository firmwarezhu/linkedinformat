import { useState, useEffect } from 'react';

const VersionInfo: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const version = '1.0.0';  // We can update this when making releases
  const buildDate = new Date().toISOString().split('T')[0];  // Current build date

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-2 right-2 text-xs text-gray-500">
      <div>Version: {version}</div>
      <div>Build Date: {buildDate}</div>
      <div>Current Time: {currentTime.toLocaleString()}</div>
    </div>
  );
};

export default VersionInfo;
