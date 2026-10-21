import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { AccessibilityProvider } from '../../context/AccessibilityContext';
import { SubscribeModalProvider } from '../../context/SubscribeModalContext';

export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <AccessibilityProvider>
          <SubscribeModalProvider>
            {ui}
          </SubscribeModalProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}
