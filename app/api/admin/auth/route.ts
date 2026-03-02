import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signSession, sessionCookieOptions, clearSessionCookie, getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Demo credentials fallback when no DB is configured
const DEMO_ADMIN = {
  email: 'admin@luminahotel.ua',
  password: 'lumina-admin-2025',
  name: 'Admin User',
  role: 'ADMIN' as const,
};

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  let session: { userId: string; email: string; name: string; role: 'ADMIN' | 'MANAGER' } | null = null;

  if (!process.env.DATABASE_URL) {
    // Demo mode — use hardcoded credentials
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      session = { userId: 'demo-admin', email: DEMO_ADMIN.email, name: DEMO_ADMIN.name, role: DEMO_ADMIN.role };
    }
  } else {
    try {
      const dbUser = await prisma.user.findUnique({ where: { email } });
      if (dbUser) {
        const valid = await bcrypt.compare(password, dbUser.passwordHash);
        if (valid) {
          session = { userId: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role };
        }
      }
    } catch {
      // DB unavailable or not migrated yet — fall back to demo credentials
      if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
        session = { userId: 'demo-admin', email: DEMO_ADMIN.email, name: DEMO_ADMIN.name, role: DEMO_ADMIN.role };
      }
    }
  }

  if (!session) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await signSession(session);
  const cookieOpts = sessionCookieOptions(token);

  const response = NextResponse.json({ ok: true, user: { email: session.email, name: session.name, role: session.role } });
  response.cookies.set(cookieOpts);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(clearSessionCookie());
  return response;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
  return NextResponse.json({ user: { email: session.email, name: session.name, role: session.role } });
}
