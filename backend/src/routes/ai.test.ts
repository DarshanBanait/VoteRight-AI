import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../server';
import { generateResponse, generateSimplifiedResponse, generateRoadmap } from '../services/gemini';

// Mock the gemini service module
vi.mock('../services/gemini', () => ({
  generateResponse: vi.fn(),
  generateSimplifiedResponse: vi.fn(),
  generateRoadmap: vi.fn(),
}));

describe('AI Routes', () => {
  describe('POST /api/ai/chat', () => {
    it('returns 400 if prompt is missing', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({ context: [] });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Prompt is required');
    });

    it('returns a valid response from gemini service', async () => {
      vi.mocked(generateResponse).mockResolvedValueOnce('Mocked AI response');
      
      const res = await request(app)
        .post('/api/ai/chat')
        .send({ prompt: 'Hello', context: [], language: 'en' });
      
      expect(res.status).toBe(200);
      expect(res.body.response).toBe('Mocked AI response');
      expect(generateResponse).toHaveBeenCalledWith('Hello', [], 'en');
    });
  });

  describe('POST /api/ai/explain-simply', () => {
    it('returns 400 if text is missing', async () => {
      const res = await request(app)
        .post('/api/ai/explain-simply')
        .send({ language: 'en' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Text is required');
    });

    it('returns a simplified explanation', async () => {
      vi.mocked(generateSimplifiedResponse).mockResolvedValueOnce('Simple explanation');
      
      const res = await request(app)
        .post('/api/ai/explain-simply')
        .send({ text: 'Complex jargon', language: 'hi' });
      
      expect(res.status).toBe(200);
      expect(res.body.response).toBe('Simple explanation');
      expect(generateSimplifiedResponse).toHaveBeenCalledWith('Complex jargon', 'hi');
    });
  });

  describe('POST /api/ai/roadmap', () => {
    it('returns 400 if context is missing', async () => {
      const res = await request(app)
        .post('/api/ai/roadmap')
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Context is required');
    });

    it('returns a generated roadmap array', async () => {
      const mockRoadmap = [{ title: 'Step 1', description: 'Do this', status: 'current' }];
      vi.mocked(generateRoadmap).mockResolvedValueOnce(mockRoadmap as any);
      
      const res = await request(app)
        .post('/api/ai/roadmap')
        .send({ context: [{ question: 'Age?', answeredYes: true }] });
      
      expect(res.status).toBe(200);
      expect(res.body.roadmap).toEqual(mockRoadmap);
      expect(generateRoadmap).toHaveBeenCalledWith(expect.any(Array));
    });
  });
});
