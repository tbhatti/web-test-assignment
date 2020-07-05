import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Web Test Assignment link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Web Test Assignment/i);
  expect(linkElement).toBeInTheDocument();
});
