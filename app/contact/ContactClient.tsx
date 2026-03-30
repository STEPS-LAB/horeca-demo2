'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateContactForm, hasErrors } from '@/utils/validation';
import { useTranslations } from '@/i18n/context';
import type { ContactFormData, ValidationErrors } from '@/types';

const defaultForm: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function ContactClient() {
  const t = useTranslations();
  const [form, setForm] = useState<ContactFormData>(defaultForm);
  const [errors, setErrors] = useState<ValidationErrors<ContactFormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const subjectOptions = [
    { value: '', label: '—' },
    { value: 'general', label: t.contact.form.subjects.general },
    { value: 'reservation', label: t.contact.form.subjects.reservation },
    { value: 'feedback', label: t.contact.form.subjects.feedback },
    { value: 'events', label: t.contact.form.subjects.events },
    { value: 'other', label: t.contact.form.subjects.other },
  ];
  const contactInfo = [
    {
      Icon: Phone,
      label: t.contact.info.labels.phone,
      value: t.contact.info.phone,
      sub: t.contact.info.subs.phone,
      href: 'tel:+380441234567',
    },
    {
      Icon: Mail,
      label: t.contact.info.labels.email,
      value: t.contact.info.email,
      sub: t.contact.info.subs.email,
      href: 'mailto:hello@lumina-hotel.com',
    },
    {
      Icon: MapPin,
      label: t.contact.info.labels.address,
      value: t.contact.info.address,
      sub: t.contact.info.subs.address,
      href: 'https://maps.google.com',
    },
    {
      Icon: Clock,
      label: t.contact.info.labels.checkInOut,
      value: t.contact.info.checkInOutValue,
      sub: t.contact.info.subs.checkInOut,
      href: undefined,
    },
  ];

  const updateField = useCallback(
    <K extends keyof ContactFormData>(field: K, value: ContactFormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        const newErrors = validateContactForm({ ...form, [field]: value });
        setErrors(newErrors);
      }
    },
    [form, touched]
  );

  const touchField = useCallback((field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateContactForm(form);
    setErrors(newErrors);
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(defaultForm).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof ContactFormData, boolean>
    );
    setTouched(allTouched);
    const validationErrors = validateContactForm(form);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setStatus('submitting');
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('success');
  };

  const touchedErrors: ValidationErrors<ContactFormData> = Object.keys(touched).reduce(
    (acc, k) => {
      const key = k as keyof ContactFormData;
      if (touched[key] && errors[key]) acc[key] = errors[key];
      return acc;
    },
    {} as ValidationErrors<ContactFormData>
  );

  return (
    <section className="py-14 sm:py-20 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Contact info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-stone-900 mb-2">{t.contact.pageTitle}</h2>
              <p className="text-stone-500 text-sm leading-relaxed mb-8">
                {t.contact.pageSubtitle}
              </p>

              <div className="flex flex-col gap-5">
                {contactInfo.map(({ Icon, label, value, sub, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-stone-900 text-gold-400 shrink-0">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-sm font-medium text-stone-800 hover:text-stone-600 transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-stone-800">{value}</p>
                      )}
                      <p className="text-xs text-stone-400 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl border border-stone-100 shadow-card p-6 sm:p-8"
            >
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                      className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 mb-5"
                    >
                      <Check size={28} className="text-emerald-600" strokeWidth={2.5} />
                    </motion.div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">{t.contact.successTitle}</h3>
                    <p className="text-stone-500 text-sm max-w-xs">
                      {t.contact.successMessage} {form.email || form.name}
                    </p>
                    <button
                      onClick={() => { setForm(defaultForm); setStatus('idle'); setTouched({}); }}
                      className="mt-6 text-sm font-medium text-stone-600 hover:text-stone-900 underline underline-offset-2 transition-colors"
                    >
                      {t.contact.form.send}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-4"
                    aria-label={t.contact.pageTitle}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label={t.contact.form.name}
                        required
                        autoComplete="name"
                        placeholder="—"
                        value={form.name}
                        error={touchedErrors.name}
                        onChange={(e) => updateField('name', e.target.value.replace(/\d+/g, ''))}
                        onBlur={() => touchField('name')}
                      />
                      <Input
                        label={t.contact.form.email}
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="—"
                        value={form.email}
                        error={touchedErrors.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        onBlur={() => touchField('email')}
                      />
                    </div>

                    <Select
                      label={t.contact.form.subject}
                      required
                      options={subjectOptions}
                      value={form.subject}
                      error={touchedErrors.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      onBlur={() => touchField('subject')}
                    />

                    <Textarea
                      label={t.contact.form.message}
                      required
                      placeholder={t.contact.pageSubtitle}
                      value={form.message}
                      error={touchedErrors.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      onBlur={() => touchField('message')}
                      hint="20+"
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={status === 'submitting'}
                      rightIcon={<Send size={15} />}
                    >
                      {status === 'submitting' ? t.contact.form.sending : t.contact.form.send}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
