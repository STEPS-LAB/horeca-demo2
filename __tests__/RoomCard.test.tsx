import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomCard } from '@/components/rooms/RoomCard';
import { rooms } from '@/data/rooms';

// Mock i18n context
jest.mock('@/i18n/context', () => ({
  useTranslations: () => ({
    common: {
      perNight: '/ night',
      quickView: 'Quick view',
      viewImage: 'View image {index}',
      viewDetails: 'Details',
      bookNow: 'Book Now',
      upTo: 'Up to {count}',
      more: '{count} more',
    },
    rooms: {
      types: new Proxy(
        {},
        {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          get: (_target, _prop) => 'Room',
        }
      ),
    },
  }),
  useLocale: () => 'en',
  I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock framer-motion to prevent animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    article: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => <article {...props}>{children}</article>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockRoom = rooms[0];

describe('RoomCard', () => {
  const mockOnViewDetails = jest.fn();
  const mockOnBook = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the room name', () => {
    render(
      <RoomCard
        room={mockRoom}
        onViewDetails={mockOnViewDetails}
        onBook={mockOnBook}
      />
    );
    expect(screen.getByText(mockRoom.name)).toBeInTheDocument();
  });

  it('renders the room price per night', () => {
    render(
      <RoomCard
        room={mockRoom}
        onViewDetails={mockOnViewDetails}
        onBook={mockOnBook}
      />
    );
    expect(screen.getByText('6\u00a0705 грн')).toBeInTheDocument();
  });

  it('renders the room rating', () => {
    render(
      <RoomCard
        room={mockRoom}
        onViewDetails={mockOnViewDetails}
        onBook={mockOnBook}
      />
    );
    expect(screen.getByText(mockRoom.rating.toFixed(1))).toBeInTheDocument();
  });

  it('calls onViewDetails when Details button is clicked', () => {
    render(
      <RoomCard
        room={mockRoom}
        onViewDetails={mockOnViewDetails}
        onBook={mockOnBook}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /details/i }));
    expect(mockOnViewDetails).toHaveBeenCalledWith(mockRoom);
  });

  it('calls onBook when Book Now button is clicked', () => {
    render(
      <RoomCard
        room={mockRoom}
        onViewDetails={mockOnViewDetails}
        onBook={mockOnBook}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /book now/i }));
    expect(mockOnBook).toHaveBeenCalledWith(mockRoom);
  });

  it('displays amenities', () => {
    render(
      <RoomCard
        room={mockRoom}
        onViewDetails={mockOnViewDetails}
        onBook={mockOnBook}
      />
    );
    // First 3 amenities should be shown
    expect(screen.getByText(mockRoom.amenities[0])).toBeInTheDocument();
  });

  it('renders image with correct alt text', () => {
    render(
      <RoomCard
        room={mockRoom}
        onViewDetails={mockOnViewDetails}
        onBook={mockOnBook}
      />
    );
    const img = screen.getByAltText(`${mockRoom.name} — image 1`);
    expect(img).toBeInTheDocument();
  });
});
