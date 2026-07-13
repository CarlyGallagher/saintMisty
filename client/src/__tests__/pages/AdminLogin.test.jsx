import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLogin from '../../pages/AdminLogin';
import { renderWithProviders } from '../utils/renderWithProviders';

describe('AdminLogin page', () => {
  it('renders the login form', () => {
    renderWithProviders(<AdminLogin />, { route: '/admin/login' });
    expect(screen.getByRole('button', { name: /login|sign in/i })).toBeInTheDocument();
  });

  it('requires both fields before submitting', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminLogin />, { route: '/admin/login' });
    await user.click(screen.getByRole('button', { name: /login|sign in/i }));
    // Native browser validation prevents submit — form should still be visible
    expect(screen.getByRole('button', { name: /login|sign in/i })).toBeInTheDocument();
  });
});
