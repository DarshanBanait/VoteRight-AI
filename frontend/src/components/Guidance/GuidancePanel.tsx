import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { X, Send, Bot, HelpCircle } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export const GuidancePanel = () => {
  const { selectedTopic, setSelectedTopic, language } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTopic) {
      setMessages([]);
      setIsLoading(true);

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      axios.post(`${backendUrl}/api/ai/chat`, {
        prompt: `Please provide a brief, 2-3 sentence explanation of '${selectedTopic}' in the context of Indian elections.`,
        context: [],
        language
      })
        .then(response => {
          setMessages([{
            id: 'initial',
            sender: 'bot',
            text: response.data.response
          }]);
        })
        .catch(() => {
          setMessages([{
            id: 'initial',
            sender: 'bot',
            text: `You selected ${selectedTopic}. How can I help you understand this better?`
          }]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedTopic, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/ai/chat`, {
        prompt: userMessage,
        context: [{ topic: selectedTopic }, ...messages.map(m => ({ role: m.sender, content: m.text }))],
        language
      });

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: "I'm having trouble connecting right now. Please check your internet or try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainSimply = async (messageText: string) => {
    setIsLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/ai/explain-simply`, {
        text: messageText,
        language
      });
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: `Here is a simpler explanation:\n\n${response.data.response}` }]);
    } catch (error) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {selectedTopic && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-2xl flex flex-col z-50 border-l border-border"
        >
          <div className="p-4 border-b border-border flex items-center justify-between bg-primary/5">
            <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Bot className="w-5 h-5" />
              VoteRight Guidance
            </h2>
            <button
              onClick={() => setSelectedTopic(null)}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`
                  max-w-[85%] p-3 rounded-2xl
                  ${msg.sender === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-background text-text rounded-bl-none border border-border'}
                `}>
                  <div className="text-sm space-y-2 markdown-body">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
                {msg.sender === 'bot' && msg.id !== 'initial' && (
                  <button
                    onClick={() => handleExplainSimply(msg.text)}
                    className="mt-1 text-xs text-primary flex items-center gap-1 hover:underline"
                  >
                    <HelpCircle className="w-3 h-3" /> Explain Simply
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-background text-text p-3 rounded-2xl rounded-bl-none border border-border animate-pulse">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 p-3 border border-border rounded-xl focus:outline-none focus:border-primary transition-colors bg-background"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-primary text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
