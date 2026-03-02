import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
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

import { Header } from '@/components/layout/Header';

describe('Header', () => {
  it('renders the hotel logo', () => {
    render(<Header />);
    expect(screen.getByText('LUMINA')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/rooms');
  });

  it('has a Reserve link', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /reserve/i })).toBeInTheDocument();
  });

  it('mobile menu button starts collapsed', () => {
    render(<Header />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles mobile menu on click', () => {
    render(<Header />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});
