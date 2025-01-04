// API keys are handled by the backend now

const API_URL = 'https://linkedinformat-api.vercel.app';

type AIProvider = 'gemini' | 'xai';

async function enhanceContent(content: string, provider: AIProvider = 'gemini'): Promise<string> {
  try {
    if (!content?.trim()) {
      throw new Error('Content cannot be empty');
    }

    const response = await fetch(`${API_URL}/api/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        provider
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to enhance content');
    }

    const data = await response.json();
    return data.enhancedContent;
  } catch (error) {
    console.error('Error enhancing content:', error);
    throw error;
  }
}

export { enhanceContent, type AIProvider };
