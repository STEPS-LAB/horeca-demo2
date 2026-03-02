import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
export const LOCALES = ['en', 'ua'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

const LOCALE_COOKIE = 'lumina_locale';
const SESSION_COOKIE = 'lumina_admin_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'lumina-demo-secret-change-in-production'
);

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getLocaleFromRequest(req: NextRequest): Locale {
  // 1. Cookie preference
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;
  if (cookie && LOCALES.includes(cookie)) return cookie;

  // 2. Accept-Language header
  const acceptLang = req.headers.get('accept-language') ?? '';
  if (acceptLang.toLowerCase().startsWith('uk')) return 'ua';

  return DEFAULT_LOCALE;
}

async function isAdminAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// Matcher — skip static files / _next internals
// ─────────────────────────────────────────────
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/).*)',
  ],
};

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin protection ──────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── i18n redirect ─────────────────────────
  // Admin routes are not locale-prefixed — skip i18n logic for them
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const pathnameHasLocale = LOCALES.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );

  if (!pathnameHasLocale) {
    const locale = getLocaleFromRequest(req);
    const newUrl = req.nextUrl.clone();
    newUrl.pathname = `/${locale}${pathname}`;
    const response = NextResponse.redirect(newUrl);
    // Persist locale preference
    response.cookies.set(LOCALE_COOKIE, locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  // Update locale cookie to match the URL locale
  const urlLocale = pathname.split('/')[1] as Locale;
  if (LOCALES.includes(urlLocale)) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, urlLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.next();
}
