import { useState } from 'react';
import { optimizeContent } from '../utils/contentOptimizer';
import { enhanceContent, type AIProvider } from '../utils/aiService';

interface ContentFormatterProps {
  content: string;
  onUpdate: (content: string) => void;
}

export function ContentFormatter({ content, onUpdate }: ContentFormatterProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiProvider, setAiProvider] = useState<AIProvider>('gemini');
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = () => {
    const optimizedContent = optimizeContent(content);
    onUpdate(optimizedContent);
  };

  const handleEnhanceWithAI = async () => {
    setIsEnhancing(true);
    setError(null);
    try {
      const enhancedContent = await enhanceContent(content, aiProvider);
      onUpdate(enhancedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enhance content');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <button
          onClick={handleOptimize}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Format
        </button>
        <button
          onClick={handleEnhanceWithAI}
          disabled={isEnhancing}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
        </button>
        <select
          value={aiProvider}
          onChange={(e) => setAiProvider(e.target.value as AIProvider)}
          className="px-3 py-1 border border-gray-300 rounded"
          disabled={isEnhancing}
        >
          <option value="gemini">Gemini</option>
          <option value="xai">XAI</option>
        </select>
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
