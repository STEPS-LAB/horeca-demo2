import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const footerLinks = {
  hotel: [
    { href: '/', label: 'Home' },
    { href: '/rooms', label: 'Rooms & Suites' },
    { href: '/booking', label: 'Book Now' },
    { href: '/contact', label: 'Contact Us' },
  ],
  amenities: [
    { href: '#', label: 'Spa & Wellness' },
    { href: '#', label: 'Restaurant & Bar' },
    { href: '#', label: 'Infinity Pool' },
    { href: '#', label: 'Conference Hall' },
    { href: '#', label: 'Guided Hikes' },
  ],
  info: [
    { href: '#', label: 'About LUMINA' },
    { href: '#', label: 'Gallery' },
    { href: '#', label: 'Press & Media' },
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Service' },
  ],
};

const socials = [
  { href: '#', label: 'Instagram', Icon: Instagram },
  { href: '#', label: 'Facebook', Icon: Facebook },
  { href: '#', label: 'Twitter', Icon: Twitter },
];

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400" role="contentinfo">
      {/* CTA Banner */}
      <div className="border-b border-stone-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Ready for an extraordinary stay?
              </h2>
              <p className="mt-1.5 text-stone-400 text-sm">
                Check availability and reserve your suite today.
              </p>
            </div>
            <Link
              href="/booking"
              className="shrink-0 inline-flex items-center justify-center h-12 px-7 rounded-xl gradient-gold text-white font-semibold text-sm shadow-button hover:opacity-90 transition-opacity duration-150"
            >
              Book a Stay
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold tracking-[0.15em] text-white">LUMINA</span>
              <span className="ml-2 text-xs tracking-[0.25em] uppercase font-light text-stone-500">Hotel</span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
              A sanctuary of refined luxury nestled in the ancient Carpathian forests of Ukraine.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-sm hover:text-white transition-colors"
              >
                <MapPin size={15} className="shrink-0 mt-0.5 text-gold-500" />
                <span>1 Lumina Drive, Yaremche, Ivano-Frankivsk Oblast, Ukraine 78500</span>
              </a>
              <a href="tel:+380441234567" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                <Phone size={15} className="text-gold-500" />
                <span>+380 44 123 4567</span>
              </a>
              <a href="mailto:hello@lumina-hotel.com" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                <Mail size={15} className="text-gold-500" />
                <span>hello@lumina-hotel.com</span>
              </a>
            </div>
          </div>

          {/* Hotel links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">Hotel</h3>
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

          {/* Amenities */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">
              Amenities
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.amenities.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-sm hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">
              Information
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.info.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-sm hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600 text-center sm:text-left">
            © {new Date().getFullYear()} LUMINA Hotel. All rights reserved. Demo by{' '}
            <span className="text-stone-500">STEPS LAB</span>.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
