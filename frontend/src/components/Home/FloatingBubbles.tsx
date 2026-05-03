
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

const TOPICS = [
  'Eligibility', 'Registration', 'EPIC', 'Form6',
  'Booth', 'EVM', 'VVPAT', 'Rights',
  'Aadhaar', 'Polling', 'Postal', 'Safety',
  'Complaints', 'Results', 'Counting'
];

export const FloatingBubbles = () => {
  const { selectedTopic, setSelectedTopic } = useStore();

  return (
    <div className="relative w-full h-full min-h-[60vh] flex flex-wrap items-center justify-center p-8 gap-4 overflow-hidden">
      {TOPICS.map((topic, index) => {
        const isSelected = selectedTopic === topic;
        const isDimmed = selectedTopic && !isSelected;

        return (
          <motion.button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            animate={{
              y: [0, -10, 0],
              scale: isSelected ? 1.5 : isDimmed ? 0.8 : 1,
              opacity: isDimmed ? 0.4 : 1,
              zIndex: isSelected ? 50 : 1
            }}
            transition={{
              y: {
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2
              },
              scale: { duration: 0.3 },
              opacity: { duration: 0.3 }
            }}
            whileHover={{ scale: isSelected ? 1.5 : 1.1 }}
            className={`
              relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center
              text-sm sm:text-base font-semibold shadow-lg cursor-pointer
              transition-colors duration-300 backdrop-blur border
              ${isSelected 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white/70 text-text border-white/50 hover:bg-primary/10'}
            `}
            aria-label={`Select topic: ${topic}`}
            aria-pressed={isSelected}
            data-testid={`bubble-${topic}`}
          >
            {topic}
          </motion.button>
        );
      })}
    </div>
  );
};
