'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Room, RoomFilter, RoomType } from '@/types';
import { rooms as allRooms } from '@/data/rooms';

const MAX_PRICE = 1000;

const defaultFilter: RoomFilter = {
  types: [],
  priceRange: [0, MAX_PRICE],
  minGuests: 1,
  features: [],
  sortBy: 'price-asc',
};

export function useRoomFilter() {
  const [filter, setFilter] = useState<RoomFilter>(defaultFilter);

  const filteredRooms = useMemo<Room[]>(() => {
    let result = allRooms.filter((room) => {
      if (filter.types.length > 0 && !filter.types.includes(room.type)) return false;
      if (room.pricePerNight < filter.priceRange[0] || room.pricePerNight > filter.priceRange[1])
        return false;
      if (room.maxGuests < filter.minGuests) return false;
      if (filter.features.length > 0) {
        const hasAllFeatures = filter.features.every(
          (f) => room.features.includes(f) || room.amenities.includes(f)
        );
        if (!hasAllFeatures) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (filter.sortBy) {
        case 'price-asc':
          return a.pricePerNight - b.pricePerNight;
        case 'price-desc':
          return b.pricePerNight - a.pricePerNight;
        case 'rating':
          return b.rating - a.rating;
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });

    return result;
  }, [filter]);

  const toggleType = useCallback((type: RoomType) => {
    setFilter((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  }, []);

  const setPriceRange = useCallback((range: [number, number]) => {
    setFilter((prev) => ({ ...prev, priceRange: range }));
  }, []);

  const setMinGuests = useCallback((guests: number) => {
    setFilter((prev) => ({ ...prev, minGuests: guests }));
  }, []);

  const toggleFeature = useCallback((feature: string) => {
    setFilter((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  }, []);

  const setSortBy = useCallback((sortBy: RoomFilter['sortBy']) => {
    setFilter((prev) => ({ ...prev, sortBy }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilter(defaultFilter);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filter.types.length > 0) count++;
    if (filter.priceRange[0] > 0 || filter.priceRange[1] < MAX_PRICE) count++;
    if (filter.minGuests > 1) count++;
    if (filter.features.length > 0) count++;
    return count;
  }, [filter]);

  return {
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
  };
}
