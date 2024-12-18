import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { Tips } from './components/Tips';
import { optimizeContent } from './utils/contentOptimizer';

function App() {
  const [inputContent, setInputContent] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      const optimizedContent = optimizeContent(inputContent);
      await navigator.clipboard.writeText(optimizedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [inputContent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header />
        <Editor
          inputContent={inputContent}
          setInputContent={setInputContent}
          copied={copied}
          onCopy={handleCopy}
        />
        <Tips />
      </div>
    </div>
  );
}

export default App;