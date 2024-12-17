import { GoogleGenerativeAI } from '@google/generative-ai';

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
    Format this LinkedIn post for better readability while keeping ALL content intact:

    Formatting rules:
    1. Add "💡" only at the start of main titles
    2. Add "🔷" only at the start of subtitles/sections
    3. Use "**" for bold text (e.g., **title**)
    4. Break long paragraphs into bullet points with "-"
    5. Add line breaks between sections
    6. Keep technical terms and code references exactly as they are
    7. Remove any markers or symbols at the end of lines
    8. Keep bullet points clean without trailing punctuation

    Example format:
    💡 **Main Title**

    🔷 **Section 1**
    - First point
    - Second point

    🔷 **Section 2**
    - Technical detail
    - Implementation detail

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
    const response = await fetch('https://api.xai.com/v1/enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: `Enhance this LinkedIn post to be more engaging and professional: ${content}`,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`XAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error with XAI API:', error);
    throw error;
  }
}

export async function enhanceContentWithAI(content: string, provider: AIProvider = 'gemini'): Promise<string> {
  try {
    if (provider === 'gemini') {
      return await enhanceWithGemini(content);
    } else {
      return await enhanceWithXAI(content);
    }
  } catch (error) {
    console.error('Error enhancing content:', error);
    // Fallback to the other provider if one fails
    try {
      return await (provider === 'gemini' ? enhanceWithXAI(content) : enhanceWithGemini(content));
    } catch (fallbackError) {
      console.error('Both AI providers failed:', fallbackError);
      return content; // Return original content if both APIs fail
    }
  }
}
