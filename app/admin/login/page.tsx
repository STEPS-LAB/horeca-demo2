import type { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = { title: 'Admin Login | LUMINA Hotel' };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold tracking-[0.15em] text-white">LUMINA</span>
          <p className="text-stone-400 text-sm mt-1 tracking-widest uppercase">Admin Portal</p>
        </div>

        <AdminLoginForm />

        {/* Demo hint */}
        <p className="text-center text-xs text-stone-600 mt-6">
          Demo credentials: admin@luminahotel.ua / lumina-admin-2025
        </p>
      </div>
    </div>
  );
}
