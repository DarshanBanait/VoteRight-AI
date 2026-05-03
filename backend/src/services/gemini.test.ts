import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateResponse, generateSimplifiedResponse, generateRoadmap } from './gemini';
import { GoogleGenAI } from '@google/genai';

vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn();
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent
      };
    },
    mockGenerateContent // export to use in tests
  };
});

describe('Gemini Service', () => {
  let mockGenerateContent: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    // @ts-ignore - vitest dynamic mock import workaround
    const genaiMock = await import('@google/genai');
    mockGenerateContent = (genaiMock as any).mockGenerateContent;
  });

  describe('generateResponse', () => {
    it('returns text response from Gemini', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: 'This is an AI response'
      });

      const response = await generateResponse('What is Form 6?', [], 'en');
      expect(response).toBe('This is an AI response');
      
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-2.5-flash'
        })
      );
    });

    it('returns default error message on failure', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));

      await expect(generateResponse('Hello', [], 'en')).rejects.toThrow('Failed to generate AI response.');
    });
  });

  describe('generateSimplifiedResponse', () => {
    it('asks gemini to simplify text', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: 'A simple explanation'
      });

      const response = await generateSimplifiedResponse('Complex jargon', 'en');
      expect(response).toBe('A simple explanation');
      
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-2.5-flash'
        })
      );
    });
  });
  describe('generateRoadmap', () => {
    it('returns parsed roadmap array', async () => {
      const mockRoadmap = [{ title: 'Test Step', description: 'Test', status: 'pending' }];
      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify(mockRoadmap)
      });

      const response = await generateRoadmap([{ question: 'Q1', answeredYes: true }]);
      expect(response).toEqual(mockRoadmap);
    });

    it('throws error if parsing fails', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: 'Invalid JSON'
      });

      await expect(generateRoadmap([])).rejects.toThrow('Failed to generate roadmap.');
    });
  });
});
