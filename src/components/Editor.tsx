import React, { useState, useEffect } from 'react';
import { Copy, Sparkles, RotateCcw, Save, Trash2 } from 'lucide-react';
import { optimizeContent } from '../utils/contentOptimizer';
import { enhanceContent, type AIProvider } from '../utils/aiService';

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  copied: boolean;
  onCopy: () => void;
}

export function Editor({ content, onContentChange, copied, onCopy }: EditorProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [autoSave, setAutoSave] = useState(true);
  const [optimizedOutput, setOptimizedOutput] = useState('');
  const [aiEnhancedOutput, setAiEnhancedOutput] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiProvider, setAiProvider] = useState<AIProvider>('gemini');
  const [showAiVersion, setShowAiVersion] = useState(false);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);

  // Update optimized output whenever input changes
  useEffect(() => {
    setOptimizedOutput(optimizeContent(content));
  }, [content]);

  // Auto-save to localStorage
  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('linkedinFormatter_content', content);
    }
  }, [content, autoSave]);

  // Load saved content on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('linkedinFormatter_content');
    if (savedContent && !content) {
      onContentChange(savedContent);
    }
  }, []);

  // Handle undo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousContent = history[historyIndex - 1];
      onContentChange(previousContent);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Add to history when content changes
  useEffect(() => {
    if (content !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(content);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [content]);

  const handleAIEnhance = async () => {
    setIsEnhancing(true);
    setEnhanceError(null);
    try {
      if (!content.trim()) {
        throw new Error('Please enter some content to enhance');
      }
      const enhancedContent = await enhanceContent(content, aiProvider);
      setAiEnhancedOutput(enhancedContent);
      setShowAiVersion(true);
    } catch (error) {
      console.error('Error enhancing content:', error);
      setEnhanceError(error instanceof Error ? error.message : 'Failed to enhance content');
      setShowAiVersion(false);
    } finally {
      setIsEnhancing(false);
    }
  };

  const characterCount = content.length;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const displayedOutput = showAiVersion ? aiEnhancedOutput : optimizedOutput;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Original Content</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className={`p-2 rounded-lg transition-all ${
                  historyIndex <= 0
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title="Undo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setAutoSave(!autoSave)}
                className={`p-2 rounded-lg transition-all ${
                  autoSave
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={autoSave ? 'Auto-save enabled' : 'Auto-save disabled'}
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-48 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your LinkedIn content here..."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm text-gray-500">
              {characterCount} characters · {wordCount} words
            </div>
            <div className="flex items-center gap-2">
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value as AIProvider)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-9"
                disabled={isEnhancing}
              >
                <option value="gemini">Gemini AI</option>
                <option value="xai">XAI</option>
              </select>
              <button
                onClick={handleAIEnhance}
                disabled={isEnhancing}
                className={`flex items-center gap-2 px-3 py-1 h-9 rounded-lg whitespace-nowrap transition-all ${
                  isEnhancing
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white`}
              >
                <Sparkles className="w-4 h-4" />
                {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
              </button>
              {enhanceError && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                  {enhanceError}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                LinkedIn-Ready Version
              </h2>
            </div>
          </div>
          <div className="w-full h-48 p-4 bg-gray-50 rounded-lg overflow-y-auto mb-4">
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {displayedOutput}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Format:</span>
              <button
                onClick={() => setShowAiVersion(false)}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  !showAiVersion
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setShowAiVersion(true)}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  showAiVersion
                    ? 'bg-purple-100 text-purple-600 font-medium'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
                disabled={!aiEnhancedOutput}
              >
                AI Enhanced
              </button>
            </div>
            <button
              onClick={onCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => {
            onContentChange('');
            setHistory([]);
            setHistoryIndex(-1);
            setOptimizedOutput('');
            setAiEnhancedOutput('');
            setShowAiVersion(false);
          }}
          className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Content
        </button>
      </div>
    </div>
  );
}