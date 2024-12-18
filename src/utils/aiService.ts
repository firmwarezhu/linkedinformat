import { GoogleGenerativeAI } from '@google/generative-ai';

// Encoded API key (Base64 + simple shift)
const ENCODED_GEMINI_KEY = 'QUlaYVN5RGFVNXpibmhpWW5aU1ptZHVlRXRqY1VsTVJFMVhRMDQ9'; // Replace with your encoded key
const XAI_KEY_ENCODED = 'eGFpLTc5UG1jMDluSXVRenBTNnBvd3RXN2J6V2VXMXpIazZhbXBscGY1VjB2bmZ4cEdUb2pMNEtOdk9RQVl2eHpYY0tPc25adG52NW9nZEFCWFBH';

function decodeKey(encodedKey: string): string {
  try {
    // First base64 decode
    const base64Decoded = atob(encodedKey);
    // Then decode our custom encoding (simple shift in this example)
    return base64Decoded
      .split('')
      .map(char => String.fromCharCode(char.charCodeAt(0) - 1))
      .join('');
  } catch (error) {
    console.error('Error decoding key:', error);
    return '';
  }
}

const GEMINI_API_KEY = decodeKey(ENCODED_GEMINI_KEY);
const XAI_API_KEY = decodeKey(XAI_KEY_ENCODED);

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

const API_URL = import.meta.env.VITE_API_URL || 'https://linkedinformat-api.vercel.app';

async function enhanceContent(content: string, provider: AIProvider = 'gemini'): Promise<string> {
  if (!content || content.trim() === '') {
    throw new Error('Please enter some content to enhance');
  }

  try {
    const response = await fetch(`${API_URL}/api/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, provider }),
    });

    if (!response.ok) {
      let errorMessage = `Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If error response is not JSON, use status text
        errorMessage = `${errorMessage} - ${response.statusText}`;
      }

      if (response.status === 404) {
        throw new Error('API endpoint not found. Please check your API configuration.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('API key error. Please check your API configuration.');
      } else {
        throw new Error(errorMessage);
      }
    }

    const data = await response.json();
    
    if (!data.enhancedContent) {
      throw new Error('No enhanced content received from the API');
    }
    
    return data.enhancedContent;
  } catch (error) {
    console.error('Error enhancing content:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to enhance content: ${error.message}`);
    } else {
      throw new Error('An unexpected error occurred while enhancing the content');
    }
  }
}

export { enhanceContent, type AIProvider };
