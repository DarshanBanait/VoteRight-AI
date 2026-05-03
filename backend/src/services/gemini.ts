import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are VoteRight AI, an intelligent, non-partisan, and accessible civic guidance assistant for Indian voters.
Your goal is to simplify the Indian election process (registration, Form 6, EPIC, polling, EVM/VVPAT).
Keep responses simple, friendly, structured, and easy to read. 
Never behave like a generic chatbot. Be specific to the election scenario discussed.
Do not show any political bias or favor any party. Focus strictly on voter rights and procedures.`;

export const generateResponse = async (prompt: string, context: any[] = [], language: string = 'en') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `Language preference: ${language}.\n\nContext:\n${JSON.stringify(context)}\n\nPrompt:\n${prompt}` }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      }
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate AI response.');
  }
};

export const generateSimplifiedResponse = async (text: string, language: string = 'en') => {
  try {
    const prompt = `Please rewrite the following text using extremely simple language suitable for a first-time voter or someone with limited civic knowledge. Language: ${language}.\n\nText:\n${text}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      }
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate simplified response.');
  }
};

export const generateRoadmap = async (context: any) => {
  try {
    const prompt = `Based on the following user context, generate a personalized step-by-step election roadmap for an Indian voter.
    Return ONLY a valid JSON array of objects. Each object should have:
    - id (number)
    - title (string)
    - description (string)
    - status (string, either "completed", "current", or "pending")
    
    Context:
    ${JSON.stringify(context)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        responseMimeType: 'application/json',
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error('Gemini API Error (Roadmap):', error);
    throw new Error('Failed to generate roadmap.');
  }
};
