import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';

describe('useStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.setState({
      user: null,
      language: 'en',
      selectedTopic: null,
      roadmap: [],
      readinessAnswers: new Array(7).fill(false),
      isGuidancePanelOpen: false,
    });
  });

  it('should have correct initial state', () => {
    const state = useStore.getState();
    expect(state.user).toBeNull();
    expect(state.language).toBe('en');
    expect(state.selectedTopic).toBeNull();
    expect(state.roadmap).toEqual([]);
    expect(state.readinessAnswers).toEqual([false, false, false, false, false, false, false]);
    expect(state.isGuidancePanelOpen).toBe(false);
  });

  it('should update language', () => {
    useStore.getState().setLanguage('hi');
    expect(useStore.getState().language).toBe('hi');
  });

  it('should set selected topic and open guidance panel', () => {
    useStore.getState().setSelectedTopic('EVM');
    expect(useStore.getState().selectedTopic).toBe('EVM');
    expect(useStore.getState().isGuidancePanelOpen).toBe(true);
  });

  it('should update roadmap', () => {
    const mockRoadmap = [{ id: '1', title: 'Step 1', description: 'Desc 1', status: 'pending' }];
    useStore.getState().setRoadmap(mockRoadmap);
    expect(useStore.getState().roadmap).toEqual(mockRoadmap);
  });
});
