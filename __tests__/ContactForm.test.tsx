import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactClient } from '@/app/contact/ContactClient';

describe('ContactForm', () => {
  it('renders all form fields', () => {
    render(<ContactClient />);
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('shows validation error on empty submit', async () => {
    render(<ContactClient />);
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/your name is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format inline', async () => {
    const user = userEvent.setup();
    render(<ContactClient />);
    await user.type(screen.getByLabelText(/your name/i), 'Jane');
    await user.type(screen.getByLabelText(/email address/i), 'not-valid@');
    fireEvent.blur(screen.getByLabelText(/email address/i));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('shows success after valid submission', async () => {
    const user = userEvent.setup();
    render(<ContactClient />);
    await user.type(screen.getByLabelText(/your name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'reservation' } });
    await user.type(
      screen.getByLabelText(/message/i),
      'This is a long enough message to pass the twenty character minimum validation.'
    );
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    await waitFor(() => expect(screen.getByText(/message sent/i)).toBeInTheDocument(), {
      timeout: 3000,
    });
  });
});
