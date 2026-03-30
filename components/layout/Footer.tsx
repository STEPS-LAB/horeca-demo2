'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { useLocale, useTranslations } from '@/i18n/context';

const socials = [
  { label: 'Instagram', Icon: Instagram },
  { label: 'Facebook', Icon: Facebook },
  { label: 'Twitter', Icon: Twitter },
];

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  const footerLinks = {
    hotel: [
      { href: '/', label: t.nav.home },
      { href: '/#lumina-experience', label: t.nav.about },
      { href: '/rooms', label: t.nav.rooms },
      { href: '/#visual-journey', label: t.nav.gallery },
    ],
    info: [
      { label: t.contact.info.labels.address, value: locale === 'ua' ? 'гора 1, Буковель, Івано-Франківська область, Україна' : t.contact.info.address, type: 'address' as const },
      { label: t.contact.info.labels.email, value: 'example@gmail.com', href: 'mailto:example@gmail.com', type: 'contact' as const },
      { label: t.contact.info.labels.phone, value: '+380 44 123 4567', href: 'tel:+380441234567', type: 'contact' as const },
      { label: t.footer.infoLinks.privacy, type: 'meta' as const },
      { label: t.footer.infoLinks.terms, type: 'meta' as const },
      { label: t.footer.infoLinks.social, type: 'meta' as const },
    ],
  };

  return (
    <footer className="bg-stone-950 text-stone-400" role="contentinfo">
      {/* CTA Banner */}
      <div className="bg-stone-900 border-b border-stone-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                {t.footer.cta.title}
              </h2>
              <p className="mt-1.5 text-stone-400 text-sm">
                {t.footer.cta.subtitle}
              </p>
            </div>
            <Link
              href="/booking"
              className="shrink-0 inline-flex items-center justify-center h-12 px-7 rounded-xl gradient-gold text-stone-950 font-semibold text-sm shadow-button hover:opacity-90 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
            >
              {t.footer.cta.button}
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold tracking-[0.15em] text-white lg:hidden">Готель</span>
              <span className="hidden lg:inline-block text-xl font-bold tracking-[0.15em] uppercase text-white">HOTEL</span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
              {t.footer.brandDescription}
            </p>
          </div>

          {/* Hotel links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">
              {t.footer.columns.hotel}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.hotel.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">
              {t.footer.columns.info}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.info
                .filter((item) => item.type !== 'meta')
                .map((item) => (
                  <li key={`${item.label}-${item.type}`}>
                    {item.type === 'address' && (
                      <div className="flex items-start gap-2.5 text-sm hover:text-white transition-colors">
                        <MapPin size={15} className="shrink-0 mt-0.5 text-gold-500" />
                        <span>
                          {item.label}: {item.value}
                        </span>
                      </div>
                    )}
                    {item.type === 'contact' && item.href && (
                      <a href={item.href} className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                        {item.label === t.contact.info.labels.phone ? (
                          <Phone size={15} className="text-gold-500" />
                        ) : (
                          <Mail size={15} className="text-gold-500" />
                        )}
                        <span>
                          {item.label}: {item.value}
                        </span>
                      </a>
                    )}
                  </li>
                ))}
              <li className="pt-1">
                <div className="mt-3 flex items-center gap-3" aria-hidden="true">
                  {socials.map(({ label, Icon }) => (
                    <span
                      key={label}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-800 text-stone-400"
                    >
                      <Icon size={15} aria-hidden />
                    </span>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600 text-center sm:text-left">
            © {new Date().getFullYear()} Готель. {t.footer.bottom.allRights}
            <span className="block sm:inline whitespace-nowrap">
              {' '}
              Developed by{' '}
              <a
                href="https://stepslab.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-white transition-colors"
              >
                STEPS LAB
              </a>
              .
            </span>
          </p>

          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span className="hover:text-white transition-colors cursor-default">
              {t.footer.infoLinks.privacy}
            </span>
            <span className="hover:text-white transition-colors cursor-default">
              {t.footer.infoLinks.terms}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
