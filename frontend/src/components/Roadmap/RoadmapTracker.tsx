
import { useStore } from '../../store/useStore';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export const RoadmapTracker = () => {
  const { roadmap } = useStore();

  if (!roadmap || roadmap.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 mt-8 bg-white rounded-2xl shadow-lg border border-border">
      <h2 className="text-xl font-bold text-primary mb-6">Your Personalized Election Roadmap</h2>
      
      <div className="flex flex-col gap-4">
        {roadmap.map((step: any, index: number) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          
          return (
            <motion.div 
              key={step.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-4 p-4 rounded-xl border ${isCurrent ? 'border-primary bg-primary/5' : 'border-border'}`}
            >
              <div className="mt-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                ) : isCurrent ? (
                  <Circle className="w-6 h-6 text-primary animate-pulse" />
                ) : (
                  <Circle className="w-6 h-6 text-text-light" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold ${isCompleted ? 'text-secondary' : isCurrent ? 'text-primary' : 'text-text'}`}>
                  Step {index + 1}: {step.title}
                </h3>
                <p className="text-sm text-text-light mt-1">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
