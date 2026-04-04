'use client';

import { useState, useCallback } from 'react';
import { Plus, Pencil, ToggleRight, Star, X, Trash2 } from 'lucide-react';
import type { Room } from '@/types';
import { formatCurrency } from '@/utils/pricing';
import { cn } from '@/utils/cn';
import { useTranslations } from '@/i18n/context';

// ── Shared form state ──────────────────────────────────────────────────────
interface RoomFormState {
  slug: string;
  nameEn: string;
  nameUa: string;
  descriptionEn: string;
  descriptionUa: string;
  type: string;
  basePrice: string;
  capacity: string;
  size: string;
  imagesText: string;
  amenityInput: string;
  amenities: string[];
  isActive: boolean;
}

function emptyForm(): RoomFormState {
  return {
    slug: '',
    nameEn: '',
    nameUa: '',
    descriptionEn: '',
    descriptionUa: '',
    type: 'standard',
    basePrice: '',
    capacity: '2',
    size: '',
    imagesText: '',
    amenityInput: '',
    amenities: [],
    isActive: true,
  };
}

function roomToForm(room: Room): RoomFormState {
  return {
    slug: room.id,
    nameEn: room.name,
    nameUa: room.nameUa ?? '',
    descriptionEn: room.description,
    descriptionUa: room.descriptionUa ?? '',
    type: room.type,
    basePrice: String(room.pricePerNight),
    capacity: String(room.maxGuests),
    size: String(room.size),
    imagesText: room.images.join('\n'),
    amenityInput: '',
    amenities: [...room.amenities],
    isActive: room.available,
  };
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ── Tiny helpers ──────────────────────────────────────────────────────────
const inputCls =
  'w-full bg-stone-800 border border-stone-700 rounded-xl text-stone-100 text-base sm:text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors placeholder:text-stone-600';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

// ── Room Form Modal ────────────────────────────────────────────────────────
type TRooms = ReturnType<typeof useTranslations>['admin']['rooms'];

interface RoomModalProps {
  title: string;
  form: RoomFormState;
  onChange: (patch: Partial<RoomFormState>) => void;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  onDelete?: () => Promise<void>;
  busy: boolean;
  busyLabel: string;
  submitLabel: string;
  error: string | null;
  isEdit?: boolean;
  t: TRooms;
}

function RoomFormModal({
  title, form, onChange, onClose, onSubmit, onDelete,
  busy, busyLabel, submitLabel, error, isEdit = false, t,
}: RoomModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const publicRooms = useTranslations().rooms;

  const roomTypeOptions = [
    { value: 'standard', label: publicRooms.types.standard },
    { value: 'deluxe', label: publicRooms.types.deluxe },
    { value: 'junior-suite', label: publicRooms.types['junior-suite'] },
    { value: 'executive-suite', label: publicRooms.types['executive-suite'] },
    { value: 'presidential-suite', label: publicRooms.types['presidential-suite'] },
    { value: 'garden-villa', label: publicRooms.types['garden-villa'] },
  ];

  const addAmenity = useCallback(() => {
    const val = form.amenityInput.trim();
    if (val && !form.amenities.includes(val)) {
      onChange({ amenities: [...form.amenities, val], amenityInput: '' });
    } else {
      onChange({ amenityInput: '' });
    }
  }, [form.amenityInput, form.amenities, onChange]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 shrink-0">
          <h2 className="text-white font-semibold">{title}</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
          {/* Slug — only for new rooms */}
          {!isEdit && (
            <Field label={t.fieldSlug}>
              <input
                className={inputCls}
                value={form.slug}
                onChange={(e) => onChange({ slug: e.target.value })}
                placeholder="—"
              />
            </Field>
          )}

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.fieldNameEn}>
              <input
                className={inputCls}
                value={form.nameEn}
                onChange={(e) => {
                  const v = e.target.value;
                  onChange({ nameEn: v, ...(!isEdit ? { slug: slugify(v) } : {}) });
                }}
                placeholder="—"
              />
            </Field>
            <Field label={t.fieldNameUa}>
              <input
                className={inputCls}
                value={form.nameUa}
                onChange={(e) => onChange({ nameUa: e.target.value })}
                placeholder="—"
              />
            </Field>
          </div>

          {/* Descriptions */}
          <Field label={t.fieldDescEn}>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={form.descriptionEn}
              onChange={(e) => onChange({ descriptionEn: e.target.value })}
              placeholder="—"
            />
          </Field>
          <Field label={t.fieldDescUa}>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={form.descriptionUa}
              onChange={(e) => onChange({ descriptionUa: e.target.value })}
              placeholder="—"
            />
          </Field>

          {/* Type / Price / Guests / Size */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.fieldType}>
              <select
                className={inputCls}
                value={form.type}
                onChange={(e) => onChange({ type: e.target.value })}
              >
                {roomTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </Field>
            <Field label={t.fieldPrice}>
              <input
                type="number"
                min="0"
                className={inputCls}
                value={form.basePrice}
                onChange={(e) => onChange({ basePrice: e.target.value })}
                placeholder="180"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.fieldMaxGuests}>
              <input
                type="number"
                min="1"
                max="10"
                className={inputCls}
                value={form.capacity}
                onChange={(e) => onChange({ capacity: e.target.value })}
              />
            </Field>
            <Field label={t.fieldSize}>
              <input
                type="number"
                min="1"
                className={inputCls}
                value={form.size}
                onChange={(e) => onChange({ size: e.target.value })}
                placeholder="32"
              />
            </Field>
          </div>

          {/* Images */}
          <Field label={`${t.fieldImages} — ${t.fieldImagesHint}`}>
            <textarea
              className={cn(inputCls, 'resize-none font-mono text-base sm:text-xs')}
              rows={4}
              value={form.imagesText}
              onChange={(e) => onChange({ imagesText: e.target.value })}
              placeholder="https://images.unsplash.com/…"
            />
          </Field>

          {/* Amenities */}
          <Field label={t.fieldAmenities}>
            <div className="flex gap-2 mb-2">
              <input
                className={`${inputCls} flex-1`}
                value={form.amenityInput}
                onChange={(e) => onChange({ amenityInput: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }}
                placeholder={t.fieldAmenitiesPlaceholder}
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-3 py-2 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-200 text-sm transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            {form.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.amenities.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-stone-800 text-stone-300 border border-stone-700"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => onChange({ amenities: form.amenities.filter((x) => x !== a) })}
                      className="text-stone-500 hover:text-red-400 transition-colors ml-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          {/* Active toggle */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              role="switch"
              aria-checked={form.isActive}
              onClick={() => onChange({ isActive: !form.isActive })}
              className={`relative w-10 h-6 rounded-full transition-colors ${form.isActive ? 'bg-gold-500' : 'bg-stone-700'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-4' : ''}`} />
            </button>
            <span className="text-sm text-stone-300">{t.fieldActive}</span>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-800 shrink-0">
          <div>
            {isEdit && onDelete && (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">{t.confirmDelete}</span>
                  <button
                    onClick={onDelete}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
                  >
                    {t.deleteRoom}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                  {t.deleteRoom}
                </button>
              )
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-sm text-stone-400 hover:text-white px-4 py-2 rounded-xl transition-colors"
            >
              {t.cancel}
            </button>
            <button
              onClick={onSubmit}
              disabled={busy}
              className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-stone-950 font-semibold text-sm px-5 py-2 rounded-xl transition-colors"
            >
              {busy ? busyLabel : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function AdminRoomsClient({ initialRooms }: { initialRooms: Room[] }) {
  const t = useTranslations().admin.rooms;
  const publicRooms = useTranslations().rooms;
  const [rooms, setRooms] = useState(initialRooms);
  const [search, setSearch] = useState('');

  // Edit state
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editForm, setEditForm] = useState<RoomFormState | null>(null);
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Add state
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<RoomFormState>(emptyForm());
  const [addBusy, setAddBusy] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const filtered = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.type.includes(search.toLowerCase())
  );

  // ── Edit handlers ──────────────────────────────────────────────────────
  function openEdit(room: Room) {
    setEditingRoom(room);
    setEditForm(roomToForm(room));
    setEditError(null);
  }

  function closeEdit() {
    setEditingRoom(null);
    setEditForm(null);
    setEditError(null);
  }

  async function handleSave() {
    if (!editingRoom || !editForm) return;
    setEditBusy(true);
    setEditError(null);
    try {
      const images = editForm.imagesText.split('\n').map((u) => u.trim()).filter(Boolean);
      const res = await fetch(`/api/rooms/${editingRoom.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameEn: editForm.nameEn,
          nameUa: editForm.nameUa,
          descriptionEn: editForm.descriptionEn,
          descriptionUa: editForm.descriptionUa,
          type: editForm.type,
          basePrice: Number(editForm.basePrice),
          capacity: Number(editForm.capacity),
          size: Number(editForm.size),
          images,
          amenities: editForm.amenities,
          isActive: editForm.isActive,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to save');
      const updated: Room = await res.json();
      setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      closeEdit();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setEditBusy(false);
    }
  }

  async function handleDelete() {
    if (!editingRoom) return;
    setEditBusy(true);
    try {
      const res = await fetch(`/api/rooms/${editingRoom.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to delete');
      setRooms((prev) => prev.filter((r) => r.id !== editingRoom.id));
      closeEdit();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Failed to delete');
      setEditBusy(false);
    }
  }

  // ── Add handlers ───────────────────────────────────────────────────────
  function openAdd() {
    setAddForm(emptyForm());
    setAddError(null);
    setAddOpen(true);
  }

  function closeAdd() {
    setAddOpen(false);
    setAddError(null);
  }

  async function handleAdd() {
    setAddBusy(true);
    setAddError(null);
    try {
      const images = addForm.imagesText.split('\n').map((u) => u.trim()).filter(Boolean);
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: addForm.slug || slugify(addForm.nameEn),
          nameEn: addForm.nameEn,
          nameUa: addForm.nameUa,
          descriptionEn: addForm.descriptionEn,
          descriptionUa: addForm.descriptionUa,
          type: addForm.type,
          basePrice: Number(addForm.basePrice),
          capacity: Number(addForm.capacity),
          size: Number(addForm.size),
          images,
          amenities: addForm.amenities,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to add room');
      const created: Room = await res.json();
      setRooms((prev) => [...prev, created]);
      closeAdd();
    } catch (e) {
      setAddError(e instanceof Error ? e.message : 'Failed to add room');
    } finally {
      setAddBusy(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="text-stone-400 text-sm mt-1">{rooms.length} {t.count}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-stone-950 font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={15} />
          {t.addRoom}
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="search"
          placeholder={t.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-base sm:text-sm px-4 py-2.5 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-800 text-stone-500 text-xs uppercase tracking-wide">
                <th className="text-left px-6 py-3 font-medium">{t.colRoom}</th>
                <th className="text-left px-4 py-3 font-medium">{t.colType}</th>
                <th className="text-left px-4 py-3 font-medium">{t.colPrice}</th>
                <th className="text-left px-4 py-3 font-medium">{t.colCapacity}</th>
                <th className="text-left px-4 py-3 font-medium">{t.colRating}</th>
                <th className="text-left px-4 py-3 font-medium">{t.colStatus}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filtered.map((room) => (
                <tr key={room.id} className="hover:bg-stone-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {room.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-white">{room.name}</p>
                        <p className="text-xs text-stone-500 font-mono">{room.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-stone-300">{publicRooms.types[room.type] ?? room.type}</td>
                  <td className="px-4 py-4 font-semibold text-white">{formatCurrency(room.pricePerNight)}</td>
                  <td className="px-4 py-4 text-stone-400">{room.maxGuests} {t.guests}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star size={12} fill="currentColor" />
                      <span className="text-white text-xs">{room.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`flex items-center gap-1.5 text-xs ${room.available ? 'text-emerald-400' : 'text-stone-500'}`}>
                      <ToggleRight size={14} />
                      {room.available ? t.active : t.inactive}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => openEdit(room)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-gold-400 hover:bg-stone-800 transition-colors"
                      aria-label={`${t.editTitle} ${room.name}`}
                    >
                      <Pencil size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-stone-500 text-sm">{t.noRooms}</div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingRoom && editForm && (
        <RoomFormModal
          title={t.editTitle}
          form={editForm}
          onChange={(patch) => setEditForm((prev) => prev ? { ...prev, ...patch } : prev)}
          onClose={closeEdit}
          onSubmit={handleSave}
          onDelete={handleDelete}
          busy={editBusy}
          busyLabel={t.saving}
          submitLabel={t.save}
          error={editError}
          isEdit
          t={t}
        />
      )}

      {/* Add Modal */}
      {addOpen && (
        <RoomFormModal
          title={t.addTitle}
          form={addForm}
          onChange={(patch) => setAddForm((prev) => ({ ...prev, ...patch }))}
          onClose={closeAdd}
          onSubmit={handleAdd}
          busy={addBusy}
          busyLabel={t.adding}
          submitLabel={t.addRoom}
          error={addError}
          t={t}
        />
      )}
    </div>
  );
}
