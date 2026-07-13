import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { AccessibilityProvider } from '../../context/AccessibilityContext';

export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <AccessibilityProvider>
          {ui}
        </AccessibilityProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}
