'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ROLE_PERMISSIONS } from '@/lib/mock/staff';
import type { Permission, StaffRole } from '@/lib/types';

/**
 * MOCK ADMIN SESSION.
 *
 * SECURITY - read before changing anything here:
 * There is no password, hash, token, master key or shared credential anywhere in this
 * prototype, and none may ever be added. This context remembers only two things: a boolean
 * saying the prototype walkthrough has started, and which role is being previewed so the
 * permission model can be demonstrated. Neither is a credential and neither grants access
 * to anything, because there is no server to grant access to.
 *
 * The flag is kept in sessionStorage purely so a page reload does not interrupt the
 * walkthrough. It is cleared when the browser tab closes. A real session must NEVER be
 * stored this way: it belongs in a server-issued HTTP-only, Secure, SameSite cookie that
 * client script cannot read or forge.
 *
 * PRODUCTION INTEGRATION POINT - Authentication:
 * - Individual accounts only. Passwords stored as Argon2id or bcrypt hashes, never
 *   reversible, never displayed, never logged.
 * - MFA required for every admin account.
 * - Server-issued, HTTP-only, Secure, SameSite session cookie with an absolute and an idle
 *   expiry. No session state in localStorage.
 * - CSRF tokens on every state-changing request, rate limiting and bot protection on the
 *   login route, and account lockout after repeated failures.
 * - Every permission check re-evaluated server-side on each request. The client-side checks
 *   below only hide UI; they stop nobody.
 * - Account recovery requires verified owner identity and single-use recovery codes, never
 *   a bare public reset link.
 * - All of the above reviewed by a qualified security professional before launch.
 */

interface AdminSession {
  signedIn: boolean;
  role: StaffRole;
  name: string;
  signIn: () => void;
  signOut: () => void;
  /** Prototype-only: preview the dashboard as another role to inspect the permission model. */
  previewAs: (role: StaffRole) => void;
  can: (permission: Permission) => boolean;
}

/** Prototype walkthrough flag. Not a session token and not a credential. */
const WALKTHROUGH_KEY = 'fp_admin_walkthrough';

const AdminSessionContext = createContext<AdminSession | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [role, setRole] = useState<StaffRole>('super-admin');

  // Restore the walkthrough flag after a reload. Never do this with a real session.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(WALKTHROUGH_KEY) === 'started') setSignedIn(true);
    } catch {
      // Private mode or blocked storage just means the walkthrough restarts.
    }
  }, []);

  function persist(value: boolean) {
    try {
      if (value) window.sessionStorage.setItem(WALKTHROUGH_KEY, 'started');
      else window.sessionStorage.removeItem(WALKTHROUGH_KEY);
    } catch {
      // Non-fatal: the prototype still works for this page view.
    }
  }

  const value = useMemo<AdminSession>(
    () => ({
      signedIn,
      role,
      name: '[OWNER NAME]',
      signIn: () => {
        persist(true);
        setSignedIn(true);
      },
      signOut: () => {
        persist(false);
        setSignedIn(false);
        setRole('super-admin');
      },
      previewAs: setRole,
      can: (permission) => ROLE_PERMISSIONS[role].includes(permission),
    }),
    [signedIn, role],
  );

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession(): AdminSession {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error('useAdminSession must be used inside AdminSessionProvider');
  return ctx;
}
