import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from '@/components/booking/BookingForm';
import type { BookingFormData } from '@/types';

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 3);
const checkIn = futureDate.toISOString().split('T')[0];
const checkOutDate = new Date(futureDate);
checkOutDate.setDate(checkOutDate.getDate() + 2);
const checkOut = checkOutDate.toISOString().split('T')[0];

const defaultForm: BookingFormData = {
  roomId: 'standard-01',
  checkIn,
  checkOut,
  guests: 2,
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@example.com',
  phone: '+1 555 000 0000',
  specialRequests: '',
};

describe('BookingForm', () => {
  const mockUpdateField = jest.fn();
  const mockTouchField = jest.fn();
  const mockOnSubmit = jest.fn().mockResolvedValue(true);

  beforeEach(() => jest.clearAllMocks());

  const renderForm = (overrides: Partial<BookingFormData> = {}, errors = {}) =>
    render(
      <BookingForm
        form={{ ...defaultForm, ...overrides }}
        errors={errors}
        onUpdateField={mockUpdateField}
        onTouchField={mockTouchField}
        onSubmit={mockOnSubmit}
      />
    );

  it('renders all required fields', () => {
    renderForm();
    expect(screen.getByLabelText(/check-in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-out/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('calls onUpdateField when a field changes', async () => {
    const user = userEvent.setup();
    renderForm();
    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');
    expect(mockUpdateField).toHaveBeenCalledWith('firstName', expect.any(String));
  });

  it('calls onTouchField on blur', () => {
    renderForm();
    fireEvent.blur(screen.getByLabelText(/first name/i));
    expect(mockTouchField).toHaveBeenCalledWith('firstName');
  });

  it('displays validation errors when passed', () => {
    renderForm({}, {
      firstName: 'First name is required',
      email: 'Enter a valid email address',
    });
    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('shows price summary for valid room and dates', () => {
    renderForm();
    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });
});
