"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const API_KEY = 'AIzaSyBaU5zbnwbbvRfGnxK5ccSIOKCMLKD-XQ8';
async function testGeminiAPI() {
    try {
        console.log('Testing Gemini API connection...');
        const genAI = new generative_ai_1.GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = 'Write a short test message to verify the API is working.';
        console.log('Sending test prompt to Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Success! API Response:', text);
        return true;
    }
    catch (error) {
        console.error('Error testing Gemini API:', error);
        return false;
    }
}
// Run the test
testGeminiAPI();
