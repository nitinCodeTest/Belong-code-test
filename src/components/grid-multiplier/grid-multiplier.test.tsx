import React from 'react';
import { render, screen } from '@testing-library/react';
import GridMultiplier from './grid-multiplier';

test('renders Reset Grid button', () => {
    render(<GridMultiplier />);
    const resetButton = screen.getByText('Reset Grid');
    expect(resetButton).toBeDefined();
});

test('renders Next Generation', () => {
    render(<GridMultiplier />);
    const nextGenButton = screen.getByText('Next Generation');
    expect(nextGenButton).toBeDefined();
});
