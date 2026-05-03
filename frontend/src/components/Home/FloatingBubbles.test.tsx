import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { FloatingBubbles } from './FloatingBubbles';
import { useStore } from '../../store/useStore';

describe('FloatingBubbles Component', () => {
  beforeEach(() => {
    // Reset store
    useStore.setState({ selectedTopic: null });
  });

  it('renders all topics', () => {
    render(<FloatingBubbles />);
    const topics = ['Eligibility', 'Registration', 'EPIC', 'Form6', 'Booth', 'EVM', 'VVPAT', 'Rights', 'Aadhaar', 'Postal', 'Safety', 'Complaints', 'Results', 'Counting'];
    
    topics.forEach(topic => {
      expect(screen.getByText(topic)).toBeInTheDocument();
    });
  });

  it('updates selectedTopic in store when a bubble is clicked', () => {
    render(<FloatingBubbles />);
    
    const evmBubble = screen.getByText('EVM');
    fireEvent.click(evmBubble);
    
    expect(useStore.getState().selectedTopic).toBe('EVM');
  });

  it('applies selected styles to the clicked bubble', () => {
    render(<FloatingBubbles />);
    
    const form6Bubble = screen.getByTestId('bubble-Form6');
    expect(form6Bubble).not.toHaveClass('bg-primary');
    
    fireEvent.click(form6Bubble);
    
    expect(form6Bubble).toHaveClass('bg-primary');
  });
});
