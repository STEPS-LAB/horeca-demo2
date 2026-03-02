'use client';

import { BedDouble, CalendarCheck, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/pricing';
import type { BookingRecord } from '@/lib/services/bookings.service';
import { useTranslations } from '@/i18n/context';

interface Stats {
  totalRooms: number;
  activeRooms: number;
  totalBookings: number;
  revenue: number;
}

const statusColors: Record<string, string> = {
  CONFIRMED: 'text-emerald-400 bg-emerald-950/50 border-emerald-800',
  PENDING: 'text-amber-400 bg-amber-950/50 border-amber-800',
  CANCELLED: 'text-red-400 bg-red-950/50 border-red-800',
};

export function AdminDashboard({
  stats,
  recentBookings,
}: {
  stats: Stats;
  recentBookings: BookingRecord[];
}) {
  const t = useTranslations().admin.dashboard;

  const statCards = [
    { label: t.totalRooms, value: stats.totalRooms, icon: BedDouble, suffix: '' },
    { label: t.activeBookings, value: stats.totalBookings, icon: CalendarCheck, suffix: '' },
    { label: t.totalRevenue, value: formatCurrency(stats.revenue), icon: DollarSign, suffix: '', raw: true },
    { label: t.occupancyRate, value: '72', icon: TrendingUp, suffix: '%' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{t.title}</h1>
        <p className="text-stone-400 text-sm mt-1">{t.welcome}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, suffix, raw }) => (
          <div
            key={label}
            className="bg-stone-900 border border-stone-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-stone-500 uppercase tracking-wide font-medium">{label}</p>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-stone-800">
                <Icon size={14} className="text-gold-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {raw ? value : `${value}${suffix}`}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl">
        <div className="px-6 py-4 border-b border-stone-800">
          <h2 className="text-sm font-semibold text-white">{t.recentBookings}</h2>
        </div>
        {recentBookings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-stone-500 text-sm">{t.noBookings}</p>
            <p className="text-stone-600 text-xs mt-1">{t.demoMode}</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-800">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {b.firstName} {b.lastName}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">{b.email}</p>
                </div>
                <div className="text-xs text-stone-400 font-mono">{b.reference}</div>
                <div className="text-sm font-semibold text-white">{formatCurrency(b.total)}</div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${statusColors[b.status] ?? ''}`}
                >
                  {b.status.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
