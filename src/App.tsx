import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { Tips } from './components/Tips';
import VersionInfo from './components/VersionInfo';
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
    <div className="relative min-h-screen bg-gray-100">
      <Header />
      <div className="z-50">
        <VersionInfo />
      </div>
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Editor
          content={inputContent}
          onContentChange={setInputContent}
          onCopy={handleCopy}
          copied={copied}
        />
        <Tips />
      </main>
    </div>
  );
}

export default App;