import { GoogleGenerativeAI } from '@google/generative-ai';

// Encoded API key (Base64 + simple shift)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;

if (!GEMINI_API_KEY || !XAI_API_KEY) {
  console.warn('Missing API keys. Please check your environment variables.');
}

type AIProvider = 'gemini' | 'xai';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

async function enhanceWithGemini(content: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
    Format this LinkedIn post for better readability while keeping ALL content intact and add relevant hashtags:

    Formatting rules:
    1. Add "💡" only at the start of main titles
    2. Add "🔷" only at the start of subtitles/sections
    3. Use "**" for bold text (e.g., **title**)
    4. Break long paragraphs into bullet points with "-"
    5. Add line breaks between sections
    6. Keep technical terms and code references exactly as they are
    7. Remove any markers or symbols at the end of lines
    8. Keep bullet points clean without trailing punctuation
    9. Add 3-5 relevant hashtags at the end of the post, based on:
       - Main topics and themes
       - Industry-specific terms
       - Technical skills mentioned
       - Separate hashtags with spaces
       - Format as #camelCase or #TitleCase

    Example format:
    💡 **Main Title**

    🔷 **Section 1**
    - First point
    - Second point

    🔷 **Section 2**
    - Technical detail
    - Implementation detail

    #RelevantTopic #IndustryTerm #TechnicalSkill

    Original content:
    ${content}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error with Gemini API:', error);
    throw error;
  }
}

async function enhanceWithXAI(content: string): Promise<string> {
  if (!XAI_API_KEY) {
    throw new Error('XAI API key is not configured');
  }

  try {
    const response = await fetch(`${API_URL}/api/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XAI_API_KEY}`
      },
      body: JSON.stringify({
        content: content
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.enhancedContent || data.text;
  } catch (error) {
    console.error('Error enhancing content:', error);
    throw new Error('Failed to enhance content. Please try again later.');
  }
}

const API_URL = 'https://linkedinformat-api.vercel.app';

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
