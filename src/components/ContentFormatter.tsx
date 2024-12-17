import React, { useState } from 'react';
import { optimizeContent } from '../utils/contentOptimizer';
import { enhanceContentWithAI } from '../utils/aiService';

interface ContentFormatterProps {
  content: string;
  onFormat: (formattedContent: string) => void;
}

export const ContentFormatter: React.FC<ContentFormatterProps> = ({ content, onFormat }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState<'gemini' | 'xai'>('gemini');

  const handleFormat = () => {
    const formattedContent = optimizeContent(content);
    onFormat(formattedContent);
  };

  const handleAIEnhance = async () => {
    setIsLoading(true);
    try {
      const enhancedContent = await enhanceContentWithAI(content, aiProvider);
      const formattedContent = optimizeContent(enhancedContent);
      onFormat(formattedContent);
    } catch (error) {
      console.error('Error enhancing content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <button
          onClick={handleFormat}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out"
        >
          Format Content
        </button>
        <div className="flex-1 flex gap-2">
          <select
            value={aiProvider}
            onChange={(e) => setAiProvider(e.target.value as 'gemini' | 'xai')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="gemini">Gemini AI</option>
            <option value="xai">XAI</option>
          </select>
          <button
            onClick={handleAIEnhance}
            disabled={isLoading}
            className={`flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Enhancing...' : 'AI Enhance'}
          </button>
        </div>
      </div>
    </div>
  );
};
