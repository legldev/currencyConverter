import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App';

afterEach(() => {
  vi.restoreAllMocks();
});

test('renders the updated converter form', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Currency converter' })).toBeInTheDocument();
  expect(screen.getByLabelText('Amount')).toHaveValue('100');
  expect(screen.getByLabelText('From')).toHaveValue('USD');
  expect(screen.getByLabelText('To')).toHaveValue('EUR');
  expect(screen.getByRole('button', { name: 'Convert' })).toBeInTheDocument();
});

test('converts currencies with the live-rate endpoint response', async () => {
  const user = userEvent.setup();
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    json: async () => ({
      amount: 100,
      base: 'USD',
      date: '2026-05-13',
      rates: { EUR: 85.36 },
    }),
    ok: true,
  } as Response);

  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Convert' }));

  await waitFor(() => {
    expect(screen.getByText('$100.00 = €85.36')).toBeInTheDocument();
  });

  expect(fetchMock).toHaveBeenCalledWith(
    'https://api.frankfurter.dev/v1/latest?amount=100&from=USD&to=EUR',
  );
});
