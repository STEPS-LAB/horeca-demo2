'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useTranslations } from '@/i18n/context';

export function AdminLoginForm() {
  const router = useRouter();
  const t = useTranslations().admin.login;
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.networkError);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError(t.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-stone-900 rounded-2xl border border-stone-800 p-8 space-y-5"
    >
      <h1 className="text-white font-semibold text-lg">{t.title}</h1>

      {error && (
        <div className="flex items-center gap-2 bg-red-950/60 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="admin-email" className="text-xs text-stone-400 font-medium uppercase tracking-wide">
          {t.email}
        </label>
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="username"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl text-white text-sm pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder:text-stone-600 transition-colors"
            placeholder="admin@luminahotel.ua"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="admin-password" className="text-xs text-stone-400 font-medium uppercase tracking-wide">
          {t.password}
        </label>
        <div className="relative">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl text-white text-sm pl-9 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder:text-stone-600 transition-colors"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
            aria-label={showPassword ? t.hidePassword : t.showPassword}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-semibold text-sm rounded-xl py-3 transition-colors"
      >
        {loading ? t.signingIn : t.signIn}
      </button>
    </form>
  );
}
