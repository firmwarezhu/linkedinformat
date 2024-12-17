import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBaU5zbnwbbvRfGnxK5ccSIOKCMLKD-XQ8';

async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API connection...');
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = 'Write a short test message to verify the API is working.';
    
    console.log('Sending test prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Success! API Response:', text);
    return true;
  } catch (error) {
    console.error('Error testing Gemini API:', error);
    return false;
  }
}

// Run the test
testGeminiAPI();

// Add this to make it a module
export {};
