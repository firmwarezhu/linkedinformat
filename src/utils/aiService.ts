import { GoogleGenerativeAI } from '@google/generative-ai';

// Encoded API key (Base64 + simple shift)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;

if (!GEMINI_API_KEY || !XAI_API_KEY) {
  console.warn('Missing API keys. Please check your environment variables.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

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
