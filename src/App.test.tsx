import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders assignment title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Belong - Assignment/i);
  expect(linkElement).toBeInTheDocument();
});

