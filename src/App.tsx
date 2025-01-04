import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { Tips } from './components/Tips';
import VersionInfo from './components/VersionInfo';
import { optimizeContent } from './utils/contentOptimizer';

function App() {
  const [inputContent, setInputContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [aiEnhancedContent, setAiEnhancedContent] = useState('');
  const [showAiVersion, setShowAiVersion] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      console.log('Copy state:', {
        showAiVersion,
        hasAiContent: Boolean(aiEnhancedContent),
        aiContentLength: aiEnhancedContent?.length,
        inputContentLength: inputContent?.length,
      });

      const contentToCopy = showAiVersion && aiEnhancedContent 
        ? aiEnhancedContent 
        : optimizeContent(inputContent);

      console.log('Content to copy:', {
        length: contentToCopy?.length,
        preview: contentToCopy?.substring(0, 50),
        isAiVersion: showAiVersion && aiEnhancedContent,
      });

      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [inputContent, aiEnhancedContent, showAiVersion]);

  return (
    <div className="relative min-h-screen bg-gray-100 pt-8">
      <Header />
      <div className="z-50 fixed bottom-0 right-0">
        <VersionInfo />
      </div>
      <main className="container mx-auto px-4 py-2 max-w-5xl">
        <Editor
          content={inputContent}
          onContentChange={setInputContent}
          onCopy={handleCopy}
          copied={copied}
          aiEnhancedContent={aiEnhancedContent}
          onAiContentChange={setAiEnhancedContent}
          showAiVersion={showAiVersion}
          onShowAiVersionChange={setShowAiVersion}
        />
        <Tips />
      </main>
    </div>
  );
}

export default App;