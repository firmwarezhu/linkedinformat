import React, { useState, useEffect } from 'react';
import { Copy, Sparkles, RotateCcw, Save } from 'lucide-react';
import { optimizeContent } from '../utils/contentOptimizer';

interface EditorProps {
  inputContent: string;
  setInputContent: (content: string) => void;
  copied: boolean;
  onCopy: () => void;
}

export function Editor({ inputContent, setInputContent, copied, onCopy }: EditorProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [autoSave, setAutoSave] = useState(true);
  const [optimizedOutput, setOptimizedOutput] = useState('');

  // Update optimized output whenever input changes
  useEffect(() => {
    setOptimizedOutput(optimizeContent(inputContent));
  }, [inputContent]);

  // Auto-save to localStorage
  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('linkedinFormatter_content', inputContent);
    }
  }, [inputContent, autoSave]);

  // Load saved content on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('linkedinFormatter_content');
    if (savedContent && !inputContent) {
      setInputContent(savedContent);
    }
  }, []);

  // Handle undo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousContent = history[historyIndex - 1];
      setInputContent(previousContent);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Add to history when content changes
  useEffect(() => {
    if (inputContent !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(inputContent);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [inputContent]);

  const characterCount = inputContent.length;
  const wordCount = inputContent.trim().split(/\s+/).filter(Boolean).length;

  return (
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
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="Paste your content here..."
          className="w-full h-[400px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        />
        <div className="mt-2 text-sm text-gray-500">
          {characterCount} characters · {wordCount} words
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            LinkedIn-Ready Version
          </h2>
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
        <div className="w-full h-[400px] p-4 bg-gray-50 rounded-lg overflow-y-auto">
          <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {optimizedOutput}
          </div>
        </div>
      </div>
    </div>
  );
}