'use client';

import { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/pricing';
import type { RoomType, RoomFilter } from '@/types';
import type { useRoomFilter } from '@/hooks/useRoomFilter';

type RoomFilterState = ReturnType<typeof useRoomFilter>;

interface RoomFiltersProps {
  state: RoomFilterState;
  totalCount: number;
}

const roomTypes: { value: RoomType; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'junior-suite', label: 'Junior Suite' },
  { value: 'executive-suite', label: 'Executive Suite' },
  { value: 'presidential-suite', label: 'Presidential' },
  { value: 'garden-villa', label: 'Garden Villa' },
];

const sortOptions: { value: RoomFilter['sortBy']; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'size', label: 'Largest First' },
];

const featureOptions = [
  'Balcony',
  'Mountain View',
  'Forest View',
  'Fireplace',
  'Soaking Tub',
  'Private Terrace',
  'Living Room',
];

export function RoomFilters({ state, totalCount }: RoomFiltersProps) {
  const sliderId = useId();
  const {
    filter,
    filteredRooms,
    activeFilterCount,
    toggleType,
    setPriceRange,
    setMinGuests,
    toggleFeature,
    setSortBy,
    resetFilters,
    MAX_PRICE,
  } = state;

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-card p-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-stone-500" strokeWidth={1.5} />
          <span className="font-semibold text-stone-800 text-sm">Filters</span>
          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-white text-xs font-semibold"
              >
                {activeFilterCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-stone-400 mb-5 pb-5 border-b border-stone-100">
        Showing{' '}
        <span className="font-semibold text-stone-600">{filteredRooms.length}</span> of{' '}
        <span className="font-semibold text-stone-600">{totalCount}</span> rooms
      </p>

      {/* Room Type */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3">
          Room Type
        </h3>
        <div className="flex flex-col gap-2">
          {roomTypes.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleType(value)}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                filter.types.includes(value)
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              )}
            >
              <span>{label}</span>
              {filter.types.includes(value) && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Price / Night
          </h3>
          <span className="text-xs font-medium text-stone-700">
            {formatCurrency(filter.priceRange[0])} – {formatCurrency(filter.priceRange[1])}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${sliderId}-min`} className="sr-only">Minimum price</label>
          <input
            id={`${sliderId}-min`}
            type="range"
            min={0}
            max={MAX_PRICE}
            step={25}
            value={filter.priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, filter.priceRange[1]])}
            className="w-full accent-stone-900 h-1.5 rounded-full cursor-pointer"
          />
          <label htmlFor={`${sliderId}-max`} className="sr-only">Maximum price</label>
          <input
            id={`${sliderId}-max`}
            type="range"
            min={0}
            max={MAX_PRICE}
            step={25}
            value={filter.priceRange[1]}
            onChange={(e) => setPriceRange([filter.priceRange[0], +e.target.value])}
            className="w-full accent-stone-900 h-1.5 rounded-full cursor-pointer"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3">
          Min. Guests
        </h3>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => setMinGuests(n)}
              className={cn(
                'flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                filter.minGuests === n
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3">
          Features
        </h3>
        <div className="flex flex-wrap gap-2">
          {featureOptions.map((feat) => (
            <button
              key={feat}
              onClick={() => toggleFeature(feat)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                filter.features.includes(feat)
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              )}
            >
              {feat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3">
          Sort By
        </h3>
        <div className="flex flex-col gap-1.5">
          {sortOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSortBy(value)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                filter.sortBy === value
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-50'
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  filter.sortBy === value ? 'bg-gold-400' : 'bg-stone-200'
                )}
              />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
