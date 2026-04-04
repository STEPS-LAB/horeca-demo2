'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { useLocale, useTranslations } from '@/i18n/context';
import { cn } from '@/utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function normalizePath(p: string) {
  const trimmed = p.replace(/\/$/, '') || '/';
  return trimmed;
}

const demoResponses: Record<string, { ua: string; en: string }> = {
  restaurant: {
    ua: 'Наш шеф-кухар рекомендує спробувати качку з яблуками, карпаччо з локальної риби та фірмовий десерт «Лісова ягода». Інгредієнти — від місцевих фермерів.',
    en: 'Our chef recommends the duck with apples, carpaccio from local fish, and the signature dessert “Forest Berry”. We source ingredients from local farmers.',
  },
  spa: {
    ua: 'Для релаксу радимо програму «Преміум велнес»: масаж, сауна та ароматерапія. Тривалість — близько 2,5 години.',
    en: 'For relaxation, try our “Premium Wellness” program: massage, sauna, and aromatherapy. About 2.5 hours.',
  },
  rooms: {
    ua: 'Для пари ідеально підійде люкс з панорамою гір; для сімей — просторий номер або вілла з двома спальнями. Можу підказати за бюджетом.',
    en: 'For couples, a suite with mountain views works beautifully; for families, a spacious room or a two-bedroom villa. I can help match your budget.',
  },
  activities: {
    ua: 'Є піші маршрути, йога на свіжому повітрі, рибалля, каякінг, спостереження за птахами та вечірнє зоряне небо.',
    en: 'We offer hiking trails, outdoor yoga, fishing, kayaking, birdwatching, and evening stargazing.',
  },
  booking: {
    ua: 'Щоб забронювати, натисніть «Забронювати» в меню або внизу екрана на телефоні — відкриється форма з датами та гостями.',
    en: 'To book, use “Book Now” in the menu or the bottom bar on your phone — you can pick dates and guests there.',
  },
  default: {
    ua: 'Дякую за запитання! Розкажу про номери, спа, ресторан і активності. Що саме вас цікавить?',
    en: 'Thanks for your message! I can help with rooms, spa, dining, and activities. What would you like to know?',
  },
};

export function AIConcierge() {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const path = normalizePath(pathname ?? '');
  const isHome = path === '/';
  const hideOnRoute = path === '/booking' || path.startsWith('/admin');

  const [pastHero, setPastHero] = useState(!isHome);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeContent = t.aiConcierge.welcome;

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      role: 'assistant',
      content: welcomeContent,
      timestamp: new Date(),
    },
  ]);

  const syncHero = useCallback(() => {
    if (!isHome) {
      setPastHero(true);
      return;
    }
    const el = document.getElementById('site-hero');
    if (!el) {
      setPastHero(true);
      return;
    }
    setPastHero(el.getBoundingClientRect().bottom <= 1);
  }, [isHome]);

  useLayoutEffect(() => {
    syncHero();
  }, [path, syncHero]);

  useLayoutEffect(() => {
    if (!isHome || hideOnRoute) return;
    window.addEventListener('scroll', syncHero, { passive: true });
    window.addEventListener('resize', syncHero);
    return () => {
      window.removeEventListener('scroll', syncHero);
      window.removeEventListener('resize', syncHero);
    };
  }, [isHome, hideOnRoute, syncHero]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === 'assistant' && prev[0].id === '1') {
        return [{ ...prev[0], content: welcomeContent, timestamp: new Date() }];
      }
      return prev;
    });
  }, [welcomeContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const lang = locale === 'ua' ? 'ua' : 'en';

  const getResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();

    if (
      lower.includes('restaurant') ||
      lower.includes('ресторан') ||
      lower.includes('страв') ||
      lower.includes('dish') ||
      lower.includes('їж') ||
      lower.includes('food') ||
      lower.includes('меню')
    ) {
      return demoResponses.restaurant[lang];
    }
    if (
      lower.includes('spa') ||
      lower.includes('масаж') ||
      lower.includes('massage') ||
      lower.includes('релакс') ||
      lower.includes('relax') ||
      lower.includes('саун')
    ) {
      return demoResponses.spa[lang];
    }
    if (
      lower.includes('room') ||
      lower.includes('номер') ||
      lower.includes('котедж') ||
      lower.includes('cottage') ||
      lower.includes('люкс') ||
      lower.includes('suite')
    ) {
      return demoResponses.rooms[lang];
    }
    if (
      lower.includes('activity') ||
      lower.includes('розваг') ||
      lower.includes('entertainment') ||
      lower.includes('що робити') ||
      lower.includes('what to do') ||
      lower.includes('прогулян')
    ) {
      return demoResponses.activities[lang];
    }
    if (
      lower.includes('book') ||
      lower.includes('брон') ||
      lower.includes('reserve') ||
      lower.includes('заброн')
    ) {
      return demoResponses.booking[lang];
    }
    return demoResponses.default[lang];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    window.setTimeout(() => {
      const assistantMessage: Message = {
        id: `${Date.now()}-a`,
        role: 'assistant',
        content: getResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const suggestions = t.aiConcierge.suggestions;

  const fabVisible = !hideOnRoute && pastHero && !isOpen;

  return (
    <>
      <motion.button
        type="button"
        initial={false}
        animate={{
          y: fabVisible ? 0 : 16,
          opacity: fabVisible ? 1 : 0,
          scale: fabVisible ? 1 : 0.92,
        }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        whileHover={fabVisible ? { scale: 1.04 } : undefined}
        whileTap={fabVisible ? { scale: 0.96 } : undefined}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed right-4 z-[45] flex h-14 items-center gap-2 rounded-2xl px-4 shadow-button md:bottom-6 md:right-6 md:h-auto md:px-5 md:py-3.5',
          'bg-stone-900 text-stone-50 ring-1 ring-stone-700/80 hover:bg-stone-800',
          'bottom-[calc(0.75rem+3rem+max(0.75rem,env(safe-area-inset-bottom,0px))+0.75rem)]',
          fabVisible ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-label={t.aiConcierge.openLabel}
        aria-hidden={!fabVisible}
      >
        <MessageSquare className="size-5 shrink-0 text-gold-400" aria-hidden />
        <span className="hidden max-w-[200px] text-left text-[10px] font-semibold uppercase leading-tight tracking-[0.18em] sm:max-w-[240px] sm:inline">
          {t.aiConcierge.fabLine}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:items-end md:justify-end md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="presentation"
              className="absolute inset-0 bg-stone-950/45 backdrop-blur-md md:bg-stone-950/30 md:backdrop-blur-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="ai-concierge-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                'relative z-10 flex max-h-[min(34rem,85dvh)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-stone-25 shadow-modal',
                'md:max-h-[min(32rem,calc(100dvh-5rem))] md:w-[min(100%,24rem)]'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gradient-gold flex items-center justify-between gap-3 px-4 py-3.5 text-stone-950 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/35 ring-1 ring-stone-950/10">
                    <Sparkles className="size-5 text-stone-900" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h2 id="ai-concierge-title" className="truncate text-sm font-semibold tracking-tight">
                      {t.aiConcierge.title}
                    </h2>
                    <p className="text-xs font-medium text-stone-800/80">{t.aiConcierge.online}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-stone-900/80 transition-colors hover:bg-white/25 hover:text-stone-950"
                  aria-label={t.common.close}
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="modal-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                        message.role === 'user'
                          ? 'gradient-gold text-stone-950 shadow-sm'
                          : 'bg-stone-150 text-stone-800 ring-1 ring-stone-200/80'
                      )}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-1 rounded-2xl bg-stone-150 px-4 py-3 ring-1 ring-stone-200/80">
                      <span className="size-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.2s]" />
                      <span className="size-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.1s]" />
                      <span className="size-2 animate-bounce rounded-full bg-stone-400" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {messages.length <= 2 && (
                <div className="border-t border-stone-200/90 px-4 py-3 sm:px-5">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setInputValue(suggestion)}
                        className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-stone-600 transition-colors hover:border-gold-400/60 hover:bg-gold-300/15 hover:text-stone-800"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="border-t border-stone-200/90 bg-stone-50/80 p-3 sm:p-4"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t.aiConcierge.placeholder}
                    disabled={isTyping}
                    className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl gradient-gold text-stone-950 shadow-sm transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
                    aria-label={t.aiConcierge.send}
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
