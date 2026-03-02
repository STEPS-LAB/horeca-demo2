import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import enDict from '@/i18n/dictionaries/en';

jest.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <a href={href} {...props}>{children}</a>,
}));

// Mock i18n context so Header can call useTranslations()
jest.mock('@/i18n/context', () => ({
  useTranslations: () => enDict,
  useLocale: () => 'en',
  I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { Header } from '@/components/layout/Header';

const renderHeader = () => render(<Header locale="en" />);

describe('Header', () => {
  it('renders the hotel logo', () => {
    renderHeader();
    expect(screen.getByText('LUMINA')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderHeader();
    const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/en');
    expect(hrefs).toContain('/en/rooms');
  });

  it('has a Reserve link', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /reserve/i })).toBeInTheDocument();
  });

  it('mobile menu button starts collapsed', () => {
    renderHeader();
    const btn = screen.getByRole('button', { name: /open menu/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles mobile menu on click', () => {
    renderHeader();
    const btn = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});
