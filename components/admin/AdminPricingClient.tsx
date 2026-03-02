'use client';

import { useState } from 'react';
import { Plus, Tag, Percent, DollarSign, Calendar, Trash2 } from 'lucide-react';
import type { PromotionRecord } from '@/lib/services/promotions.service';
import type { Room } from '@/types';
import { useTranslations, useLocale } from '@/i18n/context';

const TYPE_ICONS = {
  PERCENTAGE: Percent,
  FIXED: DollarSign,
  DATE_RANGE: Calendar,
};

function formatDate(d: Date | string | null, locale: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(locale === 'ua' ? 'uk-UA' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function AdminPricingClient({
  promotions,
  rooms,
}: {
  promotions: PromotionRecord[];
  rooms: Room[];
}) {
  const t = useTranslations().admin.pricing;
  const locale = useLocale();
  const [list, setList] = useState(promotions);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    type: 'PERCENTAGE',
    value: '',
    startDate: '',
    endDate: '',
    minNights: '',
    roomSlugs: [] as string[],
  });

  const typeLabels: Record<string, string> = {
    PERCENTAGE: t.labelPercentage,
    FIXED: t.labelFixed,
    DATE_RANGE: t.labelDateRange,
  };

  function toggleRoom(slug: string) {
    setForm((p) => ({
      ...p,
      roomSlugs: p.roomSlugs.includes(slug)
        ? p.roomSlugs.filter((s) => s !== slug)
        : [...p.roomSlugs, slug],
    }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        value: Number(form.value),
        minNights: form.minNights ? Number(form.minNights) : undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        roomSlugs: form.roomSlugs.length > 0 ? form.roomSlugs : undefined,
      }),
    });
    if (res.ok) {
      const created = await res.json() as PromotionRecord;
      setList((prev) => [created, ...prev]);
      setShowForm(false);
      setForm({ name: '', type: 'PERCENTAGE', value: '', startDate: '', endDate: '', minNights: '', roomSlugs: [] });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t.confirmDelete)) return;
    setDeletingId(id);
    const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
    if (res.ok || res.status === 204) {
      setList((prev) => prev.filter((p) => p.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="text-stone-400 text-sm mt-1">
            {list.length} {list.length === 1 ? t.promotionSingular : t.promotionPlural}
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-stone-950 font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={15} />
          {t.newPromotion}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-6 space-y-4"
        >
          <h2 className="text-sm font-semibold text-white">{t.createTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">{t.fieldName}</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Summer Sale"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">{t.fieldType}</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="PERCENTAGE">{t.typePercentage}</option>
                <option value="FIXED">{t.typeFixed}</option>
                <option value="DATE_RANGE">{t.typeDateRange}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">
                {t.fieldValue} {form.type === 'PERCENTAGE' ? '(%)' : '($)'}
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">{t.fieldMinNights}</label>
              <input
                type="number"
                min="1"
                value={form.minNights}
                onChange={(e) => setForm((p) => ({ ...p, minNights: e.target.value }))}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="3"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">{t.fieldStartDate}</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">{t.fieldEndDate}</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          {/* Room selector */}
          {rooms.length > 0 && (
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">{t.fieldRooms}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 border border-stone-700 rounded-xl p-3 max-h-44 overflow-y-auto">
                {rooms.map((room) => (
                  <label key={room.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.roomSlugs.includes(room.id)}
                      onChange={() => toggleRoom(room.id)}
                      className="accent-gold-500 shrink-0"
                    />
                    <span className="text-sm text-stone-300 group-hover:text-white transition-colors truncate">
                      {room.name}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-stone-600 mt-1">{t.roomsHint}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-400 text-stone-950 font-semibold text-sm px-5 py-2 rounded-xl transition-colors"
            >
              {t.create}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-stone-400 hover:text-stone-200 text-sm px-4 py-2 transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </form>
      )}

      {/* Promotions list */}
      {list.length === 0 ? (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl py-16 text-center">
          <Tag size={24} className="text-stone-600 mx-auto mb-3" />
          <p className="text-stone-500 text-sm">{t.noPromotions}</p>
          <p className="text-stone-600 text-xs mt-1">{t.createFirst}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((p) => {
            const Icon = TYPE_ICONS[p.type] ?? Tag;
            return (
              <div key={p.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-stone-800">
                    <Icon size={15} className="text-gold-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border ${p.isActive ? 'text-emerald-400 bg-emerald-950/50 border-emerald-800' : 'text-stone-500 bg-stone-800 border-stone-700'}`}>
                      {p.isActive ? t.statusActive : t.statusInactive}
                    </span>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="text-stone-600 hover:text-red-400 transition-colors disabled:opacity-40"
                      title={t.delete}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-white text-sm mb-1">{p.name}</h3>
                <p className="text-stone-400 text-xs mb-3">{typeLabels[p.type]}</p>

                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span>
                    {p.type === 'PERCENTAGE' ? `${p.value}% off` : `$${p.value} off`}
                    {p.minNights ? ` · min ${p.minNights} nights` : ''}
                  </span>
                  {p.startDate && (
                    <span>{formatDate(p.startDate, locale)} → {formatDate(p.endDate, locale)}</span>
                  )}
                </div>

                {/* Room scope */}
                {p.roomNames.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.roomNames.map((name) => (
                      <span key={name} className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-800 text-stone-400">
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-stone-600 mt-2 block">{t.allRooms}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
