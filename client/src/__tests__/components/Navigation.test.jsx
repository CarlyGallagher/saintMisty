import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from '../../components/Navigation';
import { renderWithProviders } from '../utils/renderWithProviders';

jest.mock('../../api/presave', () => ({
  fetchPresave: jest.fn().mockResolvedValue(null),
}));

describe('Navigation', () => {
  it('renders all main nav links', () => {
    renderWithProviders(<Navigation />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /shows/i })).toBeInTheDocument();
  });

  it('Blog nav item opens the newsletter signup modal instead of navigating', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navigation />);
    const blogButton = screen.getByRole('button', { name: /blog/i });
    await user.click(blogButton);
    expect(screen.getByRole('heading', { name: /get saint misty updates/i })).toBeInTheDocument();
  });

  it('does not show an EPK link (private, unlisted page)', () => {
    renderWithProviders(<Navigation />);
    expect(screen.queryByRole('link', { name: /epk/i })).not.toBeInTheDocument();
  });

  it('does not show admin or logout links when logged out', () => {
    renderWithProviders(<Navigation />);
    expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  it('hamburger button toggles aria-expanded', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navigation />);
    const hamburger = screen.getByRole('button', { name: /open menu/i });
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');
  });

  it('high contrast toggle has accessible label and aria-pressed', () => {
    renderWithProviders(<Navigation />);
    const toggle = screen.getByRole('button', { name: /high contrast/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });
});
