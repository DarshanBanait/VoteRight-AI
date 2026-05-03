import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Firebase services
vi.mock('../src/services/firebase', () => ({
  signInAnonymouslyUser: vi.fn(() => Promise.resolve()),
  subscribeToAuthChanges: vi.fn((cb) => {
    // immediately call with null user or mock user depending on test needs
    cb({ uid: 'mock-user-123' });
    return vi.fn(); // unsubscribe
  }),
  saveUserState: vi.fn(() => Promise.resolve()),
  loadUserState: vi.fn(() => Promise.resolve({
    roadmap: [],
    readinessAnswers: [false, false, false, false, false, false, false],
    language: 'en'
  }))
}));

// Mock Axios
vi.mock('axios', () => {
  return {
    default: {
      post: vi.fn(() => Promise.resolve({ data: { response: 'mocked response', roadmap: [] } })),
      get: vi.fn(() => Promise.resolve({ data: {} }))
    }
  };
});
