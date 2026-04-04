'use client';

import { useState } from 'react';
import { formatCurrency } from '@/utils/pricing';
import type { BookingRecord } from '@/lib/services/bookings.service';
import { useTranslations, useLocale } from '@/i18n/context';

const STATUS_OPTIONS = ['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const;

const statusStyle: Record<string, string> = {
  CONFIRMED: 'text-emerald-400 bg-emerald-950/50 border-emerald-800',
  PENDING: 'text-amber-400 bg-amber-950/50 border-amber-800',
  CANCELLED: 'text-red-400 bg-red-950/50 border-red-800',
};

function formatDate(d: Date | string, locale: string) {
  return new Date(d).toLocaleDateString(locale === 'ua' ? 'uk-UA' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function AdminBookingsClient({
  bookings: initialBookings,
  total,
}: {
  bookings: BookingRecord[];
  total: number;
}) {
  const t = useTranslations().admin.bookings;
  const locale = useLocale();
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const statusLabels: Record<string, string> = {
    ALL: t.filterAll,
    CONFIRMED: t.statuses.CONFIRMED,
    PENDING: t.statuses.PENDING,
    CANCELLED: t.statuses.CANCELLED,
  };

  const visible = initialBookings.filter((b) => {
    const matchStatus = filter === 'ALL' || b.status === filter;
    const matchSearch =
      !search ||
      `${b.firstName} ${b.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.reference.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="text-stone-400 text-sm mt-1">{total} {t.total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex gap-1 bg-stone-900 border border-stone-800 rounded-xl p-1">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s
                  ? 'bg-stone-700 text-white'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder={t.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-base sm:text-sm px-4 py-2 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      {/* Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-800 text-stone-500 text-xs uppercase tracking-wide">
                <th className="text-left px-6 py-3 font-medium">{t.colReference}</th>
                <th className="text-left px-4 py-3 font-medium">{t.colGuest}</th>
                <th className="text-left px-4 py-3 font-medium">{t.colCheckIn}</th>
                <th className="text-left px-4 py-3 font-medium">{t.colCheckOut}</th>
                <th className="text-left px-4 py-3 font-medium">{t.colTotal}</th>
                <th className="text-left px-4 py-3 font-medium">{t.colStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {visible.map((b) => (
                <tr key={b.id} className="hover:bg-stone-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-stone-400">{b.reference}</td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{b.firstName} {b.lastName}</p>
                    <p className="text-xs text-stone-500">{b.email}</p>
                  </td>
                  <td className="px-4 py-4 text-stone-300">{formatDate(b.checkIn, locale)}</td>
                  <td className="px-4 py-4 text-stone-300">{formatDate(b.checkOut, locale)}</td>
                  <td className="px-4 py-4 font-semibold text-white">{formatCurrency(b.total)}</td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${statusStyle[b.status] ?? ''}`}>
                      {b.status.toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-stone-500 text-sm">{t.noBookings}</p>
              {total === 0 && (
                <p className="text-stone-600 text-xs mt-1">{t.noBookingsYet}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
