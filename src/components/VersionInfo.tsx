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
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
      <div className="text-sm font-medium text-gray-700">Version: {version}</div>
      <div className="text-sm text-gray-600">Build Date: {buildDate}</div>
      <div className="text-sm text-gray-600">Current Time: {currentTime.toLocaleString()}</div>
    </div>
  );
};

export default VersionInfo;
