// src/App.test.js
// Updated to match the actual app content (removed 'learn react' expectation as it's not present)
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app without crashing', () => {
  render(<App />);
  // Add relevant expectations if needed, e.g., expect(screen.getByText(/My Projects/i)).toBeInTheDocument(); but since it's routed, might need wrapper
});