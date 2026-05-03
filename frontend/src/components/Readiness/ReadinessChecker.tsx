import { useState } from 'react';
import { CheckSquare, Square, RefreshCcw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { saveUserState } from '../../services/firebase';
import axios from 'axios';

const QUESTIONS = [
  "Are you a citizen of India?",
  "Are you 18 years of age or older?",
  "Do you have a valid proof of address?",
  "Do you have a valid proof of age (like Aadhaar)?",
  "Have you filled out Form 6 for voter registration?",
  "Do you have your EPIC (Voter ID) card?",
  "Have you verified your polling booth?"
];

export const ReadinessChecker = () => {
  const { setRoadmap, user, readinessAnswers, setReadinessAnswers } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleAnswer = (index: number) => {
    const newAnswers = [...readinessAnswers];
    newAnswers[index] = !newAnswers[index];
    setReadinessAnswers(newAnswers);
    
    // Save to firestore immediately
    if (user) {
      saveUserState(user.uid, { readinessAnswers: newAnswers });
    }
  };

  const calculateReadiness = () => {
    const score = readinessAnswers.filter(a => a).length;
    return Math.round((score / QUESTIONS.length) * 100);
  };

  const generateRoadmapFromReadiness = async () => {
    setIsGenerating(true);
    try {
      const context = QUESTIONS.map((q, i) => ({ question: q, answeredYes: readinessAnswers[i] }));
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/ai/roadmap`, { context });
      const newRoadmap = response.data.roadmap;
      setRoadmap(newRoadmap);
      
      if (user) {
        saveUserState(user.uid, { roadmap: newRoadmap });
      }
    } catch (error) {
      console.error('Failed to generate roadmap', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 mt-8 bg-white rounded-2xl shadow-lg border border-border">
      <h2 className="text-xl font-bold text-primary mb-4 text-center">Am I Ready to Vote?</h2>
      
      <div className="flex flex-col gap-3 mb-6">
        {QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => toggleAnswer(i)}
            className="flex items-center gap-3 p-3 text-left rounded-lg hover:bg-black/5 transition-colors"
          >
            {readinessAnswers[i] ? <CheckSquare className="w-5 h-5 text-secondary" /> : <Square className="w-5 h-5 text-text-light" />}
            <span className={readinessAnswers[i] ? 'text-text' : 'text-text-light'}>{q}</span>
          </button>
        ))}
      </div>

      <div className="p-4 bg-primary/5 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Readiness Score</p>
          <p className="text-3xl font-bold text-text">{calculateReadiness()}%</p>
        </div>
        <button 
          onClick={generateRoadmapFromReadiness}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isGenerating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : 'Generate My Roadmap'}
        </button>
      </div>
    </div>
  );
};
