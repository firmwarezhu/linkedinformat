import React from 'react';
import { optimizeContent } from '../utils/contentOptimizer';

interface ContentFormatterProps {
  content: string;
  onFormat: (formattedContent: string) => void;
}

export const ContentFormatter: React.FC<ContentFormatterProps> = ({ content, onFormat }) => {
  const handleFormat = () => {
    const formattedContent = optimizeContent(content);
    onFormat(formattedContent);
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={handleFormat}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out"
      >
        Format Content
      </button>
    </div>
  );
};
