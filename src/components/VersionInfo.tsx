import { useState, useEffect } from 'react';

const VersionInfo: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const version = '1.2.0';  // We can update this when making releases
  const buildTime = import.meta.env.VITE_BUILD_TIME || new Date().toISOString();
  const buildDate = new Date(buildTime).toLocaleDateString();
  const commitSha = import.meta.env.VITE_COMMIT_SHA?.substring(0, 7) || 'dev';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="text-sm font-medium text-gray-700">Version: {version}</div>
      <div className="text-sm text-gray-600">Build Date: {buildDate}</div>
      <div className="text-sm text-gray-600">Commit: {commitSha}</div>
      <div className="text-sm text-gray-600">Current Time: {currentTime.toLocaleString()}</div>
    </div>
  );
};

export default VersionInfo;
