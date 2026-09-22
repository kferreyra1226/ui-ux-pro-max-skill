'use client';

import { usePathname } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminSessionProvider, useAdminSession } from '@/context/AdminSessionContext';
import { ButtonLink } from '@/components/ui/Button';
import { isRoute } from '@/lib/format';

/**
 * Admin layout.
 * The login route renders bare. Every other admin route renders inside the shell and,
 * in this prototype, behind a mock sign-in check.
 *
 * PRODUCTION: this gate must be server-side. Check the session cookie in middleware and
 * re-check the permission for the specific resource inside every server action and route
 * handler. A client-side check like the one below protects nothing on its own.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSessionProvider>
      <AdminRouteGuard>{children}</AdminRouteGuard>
    </AdminSessionProvider>
  );
}

function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signedIn } = useAdminSession();

  if (isRoute(pathname, '/admin/login')) return <>{children}</>;

  if (!signedIn) {
    return (
      <div className="fp-shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <p className="fp-eyebrow mb-4">Owner dashboard</p>
        <h1 className="text-[clamp(1.75rem,6vw,2.75rem)]">Sign in required</h1>
        <p className="mt-4 max-w-md text-[14px] leading-relaxed text-chrome">
          This area is restricted to authorised staff accounts. Sign in with your individual
          account and multi-factor authentication.
        </p>
        <ButtonLink href="/admin/login" size="lg" className="mt-8">Go to sign in</ButtonLink>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
