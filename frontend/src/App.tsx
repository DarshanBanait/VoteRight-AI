import { useEffect } from 'react';
import { FloatingBubbles } from './components/Home/FloatingBubbles';
import { GuidancePanel } from './components/Guidance/GuidancePanel';
import { ReadinessChecker } from './components/Readiness/ReadinessChecker';
import { RoadmapTracker } from './components/Roadmap/RoadmapTracker';
import { signInAnonymouslyUser, subscribeToAuthChanges, loadUserState } from './services/firebase';
import { useStore } from './store/useStore';

function App() {
  const { setUser, setRoadmap, setLanguage, setReadinessAnswers } = useStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setUser(user);
      if (user) {
        const data = await loadUserState(user.uid);
        if (data) {
          if (data.roadmap) setRoadmap(data.roadmap);
          if (data.language) setLanguage(data.language);
          if (data.readinessAnswers) setReadinessAnswers(data.readinessAnswers);
        }
      }
    });

    signInAnonymouslyUser().catch(console.error);

    return () => unsubscribe();
  }, [setUser, setRoadmap, setLanguage, setReadinessAnswers]);
  return (
    <div className="min-h-screen bg-background font-sans text-text pb-20">
      <header className="w-full p-6 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight">VoteRight AI</h1>
        <p className="text-text-light mt-2 max-w-lg mx-auto text-lg">
          Your personal, intelligent guide to Indian elections. Select a topic below to start your journey.
        </p>
      </header>

      <main className="container mx-auto px-4 py-8 relative flex flex-col gap-12">
        <FloatingBubbles />
        <ReadinessChecker />
        <RoadmapTracker />
      </main>

      <GuidancePanel />
    </div>
  );
}

export default App;
