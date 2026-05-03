import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReadinessChecker } from './ReadinessChecker';
import { useStore } from '../../store/useStore';
import axios from 'axios';

describe('ReadinessChecker Component', () => {
  beforeEach(() => {
    useStore.setState({ 
      readinessAnswers: new Array(7).fill(false),
      roadmap: [],
      user: { uid: '123' } as any
    });
    vi.clearAllMocks();
  });

  it('renders all questions', () => {
    render(<ReadinessChecker />);
    expect(screen.getByText('Are you a citizen of India?')).toBeInTheDocument();
    expect(screen.getByText('Have you verified your polling booth?')).toBeInTheDocument();
  });

  it('toggles answers and calculates score correctly', () => {
    render(<ReadinessChecker />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
    
    const firstQuestion = screen.getByText('Are you a citizen of India?').closest('button');
    fireEvent.click(firstQuestion!);
    
    // 1 out of 7 is ~14%
    expect(screen.getByText('14%')).toBeInTheDocument();
    
    // Global store should be updated
    expect(useStore.getState().readinessAnswers[0]).toBe(true);
  });

  it('generates roadmap on button click', async () => {
    render(<ReadinessChecker />);
    
    // First enable the button by answering a question
    const firstQuestion = screen.getByText('Are you a citizen of India?').closest('button');
    fireEvent.click(firstQuestion!);
    
    const generateBtn = screen.getByText('Generate My Roadmap');
    fireEvent.click(generateBtn);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/ai/roadmap', expect.any(Object));
    });
    
    // After axios resolves, it updates the roadmap
    await waitFor(() => {
      expect(useStore.getState().roadmap).not.toBeNull();
    });
  });
});
