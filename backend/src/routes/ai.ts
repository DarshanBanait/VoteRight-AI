import express from 'express';
import { generateResponse, generateSimplifiedResponse, generateRoadmap } from '../services/gemini';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { prompt, context, language } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const responseText = await generateResponse(prompt, context, language);
    res.json({ response: responseText });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while communicating with the AI.' });
  }
});

router.post('/explain-simply', async (req, res) => {
  try {
    const { text, language } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const simplifiedText = await generateSimplifiedResponse(text, language);
    res.json({ response: simplifiedText });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while simplifying the text.' });
  }
});

router.post('/roadmap', async (req, res) => {
  try {
    const { context } = req.body;
    
    if (!context) {
      return res.status(400).json({ error: 'Context is required' });
    }

    const roadmap = await generateRoadmap(context);
    res.json({ roadmap });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while generating the roadmap.' });
  }
});

export default router;
